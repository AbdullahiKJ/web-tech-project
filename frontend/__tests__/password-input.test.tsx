import PasswordInput from '@/components/password-input';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PasswordInput', () => {
    it('renders the input field with the correct name and placeholder and defaults to the password type', () => {
        render(<PasswordInput name="testName" placeholder="testPlaceholder" />);

        const input = screen.getByPlaceholderText('testPlaceholder');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'password');
    });

    it('toggles the input type between password and text when the button is clicked', async () => {
        const user = userEvent.setup();
        render(<PasswordInput name="testName" placeholder="testPlaceholder" />);

        const input = screen.getByPlaceholderText('testPlaceholder');
        const button = screen.getByRole('button');

        // Initially, the input type should be password
        expect(input).toHaveAttribute('type', 'password');

        // Click the button to show the password
        await user.click(button);
        expect(input).toHaveAttribute('type', 'text');

        // Click the button again to hide the password
        await user.click(button);
        expect(input).toHaveAttribute('type', 'password');
    });
});
