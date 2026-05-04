import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Pagination from '@/components/pagination';

describe('Pagination', () => {
    it('renders the next and previous buttons', () => {
        render(<Pagination index={1} count={3} />);

        const prevButton = screen.getByRole('button', { name: '«' });
        const nextButton = screen.getByRole('button', { name: '»' });

        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
    });

    it('disables the previous button on the first page', () => {
        render(<Pagination index={1} count={3} />);

        const prevButton = screen.getByRole('button', { name: '«' });

        expect(prevButton).toBeDisabled();
    });

    it('disables the next button on the last page', () => {
        render(<Pagination index={3} count={3} />);

        const nextButton = screen.getByRole('button', { name: '»' });

        expect(nextButton).toBeDisabled();
    });

    it('calls onPageChange with the correct page number when the next/previous buttons are clickes', () => {
        const onPageChange = jest.fn();
        render(<Pagination index={2} count={3} onPageChange={onPageChange} />);

        const prevButton = screen.getByRole('button', { name: '«' });
        const nextButton = screen.getByRole('button', { name: '»' });

        prevButton.click();
        expect(onPageChange).toHaveBeenCalledWith(1);

        nextButton.click();
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
});
