'use client';

import ReviewCard from '@/components/review-card';
import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { ReviewProps } from '@/components/review';
import { Movie } from '@/app/lib/definitions';
import Menu from '@/components/menu';
import { AuthContext } from '@/app/providers/AuthProvider';
import { redirect } from 'next/navigation';

export default function Home() {
    // Redirect to the login page if the user is not authenticated
    const authContext = useContext(AuthContext);
    if (!authContext?.user?.id) {
        redirect('/sign-in');
    }

    const [data, setData] = useState<{ review: ReviewProps; movie: Movie }[]>(
        [],
    );
    const [loading, setLoading] = useState(true);

    const menuRef = useRef<any>(null);

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

            // update the review list
            const newReviews = data.filter(
                (item) => item.review.id !== reviewId,
            );
            setData(newReviews);

            // Update the menu counts
            menuRef.current?.updateCounts(newReviews.length, undefined);
        } else throw new Error('Movie Id is null');
    }

    return (
        <>
            <Menu ref={menuRef} />
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
                                onUpdate={fetchReviews}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
