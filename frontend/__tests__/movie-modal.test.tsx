import { MovieModal } from '@/components/movie-modal';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testMovie } from './review-form.test';
import { AuthContext } from '@/app/providers/AuthProvider';

describe('Movie Modal', () => {
    const onConfirmMock = jest.fn();
    const setIsOpenMock = jest.fn();

    beforeEach(() => {
        global.fetch = jest.fn((url) =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        movies: [],

                        reviews: [],
                    }),
            }),
        ) as jest.Mock;

        // Mock HTMLDialogElement.showModal and close if not available
        HTMLDialogElement.prototype.showModal = jest.fn(function () {
            this.setAttribute('open', '');
        });

        HTMLDialogElement.prototype.close = jest.fn(function () {
            this.removeAttribute('open');
        });
    });

    it('renders the modal image button correctly', () => {
        render(<MovieModal movie={testMovie} setIsOpen={setIsOpenMock} />);

        const openButton = screen.getByTestId('open-modal-button');
        expect(openButton).toBeInTheDocument();
    });

    it('opens the modal when the open button is clicked', async () => {
        const user = userEvent.setup();
        render(<MovieModal movie={testMovie} setIsOpen={setIsOpenMock} />);

        const openButton = screen.getByTestId('open-modal-button');
        await user.click(openButton);

        await waitFor(() => {
            const modal = screen.getByTestId(testMovie.id.toString());
            expect(modal).toHaveAttribute('open');
            expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        });
    });

    it('displays the modal components correctly', () => {
        render(<MovieModal movie={testMovie} setIsOpen={setIsOpenMock} />);

        const title = screen.getByText(testMovie.title);
        expect(title).toBeInTheDocument();

        const overview = screen.getByText(testMovie.overview);
        expect(overview).toBeInTheDocument();

        const reviewButton = screen.getByTestId('review-button');
        expect(reviewButton).toBeInTheDocument();

        const watchlistButton = screen.getByTestId('watchlist-button');
        expect(watchlistButton).toBeInTheDocument();
    });

    it('displays the form review when the leave review button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <AuthContext.Provider
                value={{
                    user: { id: 1, name: 'Test User' },
                    setUser: jest.fn(),
                    refreshUser: jest.fn(),
                }}
            >
                <MovieModal movie={testMovie} setIsOpen={setIsOpenMock} />
            </AuthContext.Provider>,
        );

        const openButton = screen.getByTestId('open-modal-button');
        await user.click(openButton);

        const reviewButton = screen.getByRole('button', {
            name: 'Leave a review',
        });
        await user.click(reviewButton);

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        expect(submitButton).toBeInTheDocument();
    });

    it('closes the modal when the outside of the modal is clicked', async () => {
        const user = userEvent.setup();
        render(<MovieModal movie={testMovie} setIsOpen={setIsOpenMock} />);

        const openButton = screen.getByTestId('open-modal-button');
        await user.click(openButton);

        const modal = screen.getByTestId(testMovie.id.toString());
        expect(modal).toHaveAttribute('open');

        const closeButton = screen.getByTestId('close-modal-button');
        await user.click(closeButton);

        expect(modal).not.toHaveAttribute('open');
    });
});
