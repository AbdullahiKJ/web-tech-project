'use client';

import ReviewCard from '@/components/review-card';
import { useState, useEffect, useCallback } from 'react';
import { ReviewProps } from '@/components/review';
import { Movie } from '@/app/lib/definitions';
import Menu from '@/components/menu';

export default function Home() {
    const [data, setData] = useState<{ review: ReviewProps; movie: Movie }[]>(
        [],
    );
    const [loading, setLoading] = useState(true);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_TMDB_AUTH,
        },
    };

    const fetchReviews = useCallback(async () => {
        setLoading(true);

        // Get a list of the user's reviews
        const res = await fetch('http://localhost:8080/reviews/users/1');
        const json = await res.json();

        // Fetch each movie
        const moviePromises = json.reviews.map(async (review: ReviewProps) => {
            const movieRes = await fetch(
                `https://api.themoviedb.org/3/movie/${review.movie_id}`,
                options,
            );

            const movie = await movieRes.json();

            return { review, movie };
        });
        const combined = await Promise.all(moviePromises);

        setData(combined);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    async function handleDelete(reviewId: string | undefined) {
        if (reviewId != null) {
            await fetch(`http://localhost:8080/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            // refresh review list
            fetchReviews();
        } else throw new Error('Movie Id is null');
    }

    return (
        <>
            <Menu />
            <div className="p-5">
                <p className="text-3xl">Reviews</p>
                {loading ? (
                    <div className="flex items-center justify-evenly">
                        <span className="loading loading-xl loading-spinner"></span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-7 p-5">
                        {data.map(({ review, movie }) => (
                            <ReviewCard
                                review={review}
                                movie={movie}
                                onDelete={handleDelete}
                                key={review.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
