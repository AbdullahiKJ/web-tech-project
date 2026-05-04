import { AuthContext } from '@/app/providers/AuthProvider';
import { AppHeader } from '@/components/app-header';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';

// Mock the user router to render the component without errors
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        prefetch: jest.fn(),
        back: jest.fn(),
    }),
    usePathname() {
        return '/';
    },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe('AppHeader', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        mockPush.mockClear();
    });

    it('renders each component of the header correctly', () => {
        render(<AppHeader />);

        const featured = screen.getAllByText('Featured')[0];
        expect(featured).toBeInTheDocument();

        const upcoming = screen.getAllByText('Upcoming')[0];
        expect(upcoming).toBeInTheDocument();

        const profile = screen.getAllByText('Profile')[0];
        expect(profile).toBeInTheDocument();

        const searchInput = screen.getByPlaceholderText('Search');
        expect(searchInput).toBeInTheDocument();

        const loginButton = screen.getByRole('link', { name: 'Log in' });
        expect(loginButton).toBeInTheDocument();

        const themeToggle = screen.getByRole('checkbox', { name: 'sun moon' });
        expect(themeToggle).toBeInTheDocument();
    });

    it('calls the handle submit function with the correct query when the search form is submitted', async () => {
        const user = userEvent.setup();

        render(<AppHeader />);

        const searchInput = screen.getByPlaceholderText('Search');
        await user.type(searchInput, 'testQuery');

        const searchButton = screen.getByRole('button', { name: 'search' });
        await user.click(searchButton);

        expect(mockPush).toHaveBeenCalledWith('/search?page=1&query=testQuery');
    });

    it('should update the login button to log out when the user is logged in and log in when the user is logged out', () => {
        const { rerender } = render(
            <AuthContext.Provider
                value={{
                    user: null,
                    setUser: jest.fn(),
                    refreshUser: jest.fn(),
                }}
            >
                <AppHeader />
            </AuthContext.Provider>,
        );

        // Initially, the login button should be visible
        let loginButton = screen.getByRole('link', { name: 'Log in' });
        expect(loginButton).toBeInTheDocument();

        // Rerender the component with a user in the auth context
        rerender(
            <AuthContext.Provider
                value={{
                    user: { id: '1', name: 'Test User' },
                    setUser: jest.fn(),
                    refreshUser: jest.fn(),
                }}
            >
                <AppHeader />
            </AuthContext.Provider>,
        );

        // Now, the log out button should be visible instead of the log in button
        const logoutButton = screen.getByText('Log out');
        expect(logoutButton).toBeInTheDocument();
    });
});
