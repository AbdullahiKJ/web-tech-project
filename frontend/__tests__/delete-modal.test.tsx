import { DeleteModal } from '@/components/delete-modal';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('DeleteModal', () => {
    const onConfirmMock = jest.fn();

    beforeEach(() => {
        // Mock HTMLDialogElement.showModal and close if not available
        HTMLDialogElement.prototype.showModal = jest.fn(function () {
            this.setAttribute('open', '');
        });

        HTMLDialogElement.prototype.close = jest.fn(function () {
            this.removeAttribute('open');
        });
    });

    it('renders the open button correctly', () => {
        render(
            <DeleteModal onConfirm={onConfirmMock}>Placeholder</DeleteModal>,
        );

        const openButton = screen.getByText('Placeholder');
        expect(openButton).toBeInTheDocument();
    });

    it('opens the modal when the open button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <DeleteModal onConfirm={onConfirmMock} reviewId="1">
                Placeholder
            </DeleteModal>,
        );

        const openButton = screen.getByText('Placeholder');
        await user.click(openButton);

        const modal = screen.getByTestId('1delete');
        expect(modal).toBeInTheDocument();
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('calls the on confirm callback with the correct id when the delete button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <DeleteModal onConfirm={onConfirmMock} reviewId="1">
                Placeholder
            </DeleteModal>,
        );

        const openButton = screen.getByText('Placeholder');
        await user.click(openButton);

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        await user.click(deleteButton);

        expect(onConfirmMock).toHaveBeenCalledWith('1');
    });

    it('closes the modal when the cancel button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <DeleteModal onConfirm={onConfirmMock} reviewId="1">
                Placeholder
            </DeleteModal>,
        );

        const openButton = screen.getByText('Placeholder');
        await user.click(openButton);

        const modal = screen.getByTestId('1delete');
        expect(modal).toHaveAttribute('open');

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await user.click(cancelButton);

        expect(modal).not.toHaveAttribute('open');
    });
});
