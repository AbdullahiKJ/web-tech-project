import { ThemeToggle } from '@/components/theme-toggle';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe('ThemeToggle', () => {
    it('renders the component correctly', () => {
        render(<ThemeToggle />);

        const themeToggle = screen.getByRole('checkbox', { name: 'sun moon' });
        expect(themeToggle).toBeInTheDocument();
    });

    it('defaults to the sun theme and switches to the moon theme when clicked ', () => {
        render(<ThemeToggle />);

        const sunToggle = screen.getByRole('checkbox', { name: 'sun moon' });
        expect(sunToggle).toBeInTheDocument();
        expect(sunToggle).not.toBeChecked();

        sunToggle.click();

        expect(sunToggle).toBeChecked();
    });
});
