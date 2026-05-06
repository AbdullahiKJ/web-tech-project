import RatingInput from '@/components/rating-input';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Rating Input', () => {
    it('renders 5 stars buttons correctly', () => {
        render(<RatingInput size="md" />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(5);

        buttons.forEach((button) => {
            const svg = button.querySelector('svg');
            expect(svg?.querySelector('path')).toBeInTheDocument();
        });
    });

    it('should update the input value when a star is clicked', async () => {
        render(<RatingInput size="md" />);

        const buttons = screen.getAllByRole('button');
        await userEvent.click(buttons[2]); // Click the 3rd star

        const input = screen.getByTestId('rating-value');
        expect(input).toHaveValue('3');

        await userEvent.click(buttons[4]); // Click the 5th star
        expect(input).toHaveValue('5');
    });
});
