import { ReviewFormSchema, ReviewFormState } from '@/app/lib/definitions';
import * as z from 'zod';

export async function createReview(state: ReviewFormState, formData: FormData) {
    // Validate form fields
    const validatedFields = ReviewFormSchema.safeParse({
        rating: formData.get('rating')
            ? parseFloat(formData.get('rating') as string)
            : null,
        review_description: formData.get('review_description'),
        movie_id: formData.get('movie_id'),
        user_id: formData.get('user_id'),
        review_id: formData.get('review_id'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties,
        };
    }

    // Prepare data for insertion into database
    const { rating, review_description, movie_id, user_id, review_id } =
        validatedFields.data;

    const review = { rating, review_description, movie_id, user_id };
    const isEditing = review_id !== '' && review_id != null;

    const options: RequestInit = {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, review_description, movie_id, user_id }),
        cache: 'no-store',
    };

    try {
        const path =
            'http://localhost:8080/reviews' +
            (isEditing ? `/${review_id}` : '');
        const res = await fetch(path, options);
        if (!res.ok) {
            const text = await res.text();
            return { apiError: text };
        } else {
            // Redirect to the home page after successful signup
            return {
                success: true,
                review: { rating, review_description, user_id },
            };
        }
    } catch (err) {
        console.error('Network error', err);
        return { apiError: 'Network error' };
    }
}
