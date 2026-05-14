import Toast from '@/components/toast';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Toast', () => {
    it('renders the message and displays the correct styling based on its type', () => {
        render(<Toast message="Success" type="success" />);

        const successToast = screen.getByText('Success');
        expect(successToast).toBeInTheDocument();
        expect(successToast.parentElement).toHaveClass('alert-success');

        render(<Toast message="Error" type="error" />);
        const errorToast = screen.getByText('Error');
        expect(errorToast).toBeInTheDocument();
        expect(errorToast.parentElement).toHaveClass('alert-error');

        render(<Toast message="Warning" type="warning" />);
        const warningToast = screen.getByText('Warning');
        expect(warningToast).toBeInTheDocument();
        expect(warningToast.parentElement).toHaveClass('alert-warning');

        render(<Toast message="Info" type="info" />);
        const infoToast = screen.getByText('Info');
        expect(infoToast).toBeInTheDocument();
        expect(infoToast.parentElement).toHaveClass('alert-info');
    });

    it('defaults to success type when no type is provided', () => {
        render(<Toast message="Default" />);

        const defaultToast = screen.getByText('Default');
        expect(defaultToast).toBeInTheDocument();
        expect(defaultToast.parentElement).toHaveClass('alert-success');
    });
});
