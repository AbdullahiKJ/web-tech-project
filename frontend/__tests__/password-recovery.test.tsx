import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordRecovery from '@/components/password-recovery';

const fetchMock = jest.fn();
beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockReset();
    window.history.replaceState(null, '', '/');
});

test('sends the email and displays a generic confirmation', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    render(<PasswordRecovery />);
    fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
        'If an account exists',
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
        email: 'user@example.com',
    });
});

test('shows connection failures and allows another attempt', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    render(<PasswordRecovery />);
    fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByRole('alert')).toHaveTextContent(
        'Unable to connect',
    );
    await waitFor(() => expect(screen.getByRole('button')).toBeEnabled());
});

test('missing reset token offers a new link without a password form', () => {
    render(<PasswordRecovery reset />);
    expect(screen.getByRole('alert')).toHaveTextContent('missing a token');
    expect(screen.queryByLabelText('New password')).not.toBeInTheDocument();
});
