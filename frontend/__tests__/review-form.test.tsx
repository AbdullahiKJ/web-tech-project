import ReviewForm from '@/components/review-form';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const testMovie = {
    adult: true,
    backdrop_path: 'test',
    belongs_to_collection: 'test',
    budget: 0,
    genres: [
        {
            id: 0,
            name: 'test',
        },
    ],
    homepage: 'test',
    id: 0,
    imdb_id: 'test',
    original_language: 'test',
    original_title: 'test title',
    overview: 'test overview',
    popularity: 0,
    poster_path: 'test',
    production_companies: [
        {
            id: 0,
            logo_path: 'test',
            name: 'test',
            origin_country: 'test',
        },
    ],
    production_countries: [
        {
            iso_3166_1: 'test',
            name: 'test',
        },
    ],
    release_date: 'test',
    revenue: 0,
    runtime: 0,
    spoken_languages: [
        {
            english_name: 'test',
            iso_639_1: 'test',
            name: 'test',
        },
    ],
    status: 'test',
    tagline: 'test',
    title: 'test title',
    video: true,
    vote_average: 0,
    vote_count: 0,
};

describe('ReviewForm', () => {
    const mockAction = jest.fn();

    it('renders all field correctly', () => {
        render(<ReviewForm movie={testMovie} action={mockAction} />);

        const ratingInput = screen.getByTestId('rating-value');
        expect(ratingInput).toBeInTheDocument();

        const reviewInput = screen.getByPlaceholderText(
            'Write your review here...',
        );
        expect(reviewInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        expect(submitButton).toBeInTheDocument();
    });

    it('calls the action function on submit', async () => {
        render(<ReviewForm movie={testMovie} action={mockAction} />);

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        await userEvent.click(submitButton);

        expect(mockAction).toHaveBeenCalled();
    });
});
