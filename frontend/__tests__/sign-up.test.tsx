import SignUp from '@/components/sign-up';
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

describe('Sign Up', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        mockPush.mockClear();
    });

    it('renders all form fields correctly', () => {
        render(<SignUp />);

        const nameInput = screen.getByLabelText('Name');
        expect(nameInput).toBeInTheDocument();

        const emailInput = screen.getByLabelText('Email');
        expect(emailInput).toBeInTheDocument();

        const passwordInput = screen.getByLabelText('Password');
        expect(passwordInput).toBeInTheDocument();

        const confirmPasswordInput = screen.getByLabelText('Confirm Password');
        expect(confirmPasswordInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', {
            name: 'Continue',
        });
        expect(submitButton).toBeInTheDocument();
    });

    it('displays validation errors when form is submitted with empty fields', async () => {
        render(<SignUp />);

        const submitButton = screen.getByRole('button', {
            name: 'Continue',
        });
        await userEvent.click(submitButton);

        expect(
            screen.getByText('Name must be at least 2 characters long.'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('Please enter a valid email.'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('- Be at least 8 characters long'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('- Please confirm your password.'),
        ).toBeInTheDocument();
    });

    it('displays validation errors for passwords without letters', async () => {
        render(<SignUp />);

        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, '12345678');

        const submitButton = screen.getByRole('button', {
            name: 'Continue',
        });
        await userEvent.click(submitButton);

        expect(
            screen.getByText('- Contain at least one letter.'),
        ).toBeInTheDocument();
    });

    it('displays validation errors for passwords without numbers', async () => {
        render(<SignUp />);

        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, 'abcdefgh');

        const submitButton = screen.getByRole('button', {
            name: 'Continue',
        });
        await userEvent.click(submitButton);

        expect(
            screen.getByText('- Contain at least one number.'),
        ).toBeInTheDocument();
    });

    it('displays validation errors for passwords without special characters', async () => {
        render(<SignUp />);

        const passwordInput = screen.getByLabelText('Password');
        await userEvent.type(passwordInput, '12345678abc');

        const submitButton = screen.getByRole('button', {
            name: 'Continue',
        });
        await userEvent.click(submitButton);

        expect(
            screen.getByText('- Contain at least one special character.'),
        ).toBeInTheDocument();
    });
});
