import SignIn from '@/components/sign-in';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

describe('Sign In', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        mockPush.mockClear();
    });

    it('renders all form fields correctly', () => {
        render(<SignIn />);

        const emailInput = screen.getByLabelText('Email');
        expect(emailInput).toBeInTheDocument();

        const passwordInput = screen.getByLabelText('Password');
        expect(passwordInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', {
            name: 'Continue',
        });
        expect(submitButton).toBeInTheDocument();
    });

    it('displays validation errors when form is submitted with empty fields', async () => {
        render(<SignIn />);

        const submitButton = screen.getByRole('button', {
            name: 'Continue',
        });
        await userEvent.click(submitButton);

        expect(
            screen.getByText('Please enter a valid email.'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Please enter your password.'),
        ).toBeInTheDocument();
    });
});
