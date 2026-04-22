'use client';
import { ReviewProps } from '@/components/review';
import Review from '@/components/review';
import Rating from '@/components/rating';
import { useEffect, useActionState, useState } from 'react';
import { createReview } from '@/app/actions/reviews';
import { Movie } from '@/app/lib/definitions';
import ReviewForm from './review-form';

interface Props {
    movie: Movie;
    review?: ReviewProps;
    isOpen?: boolean;
    setIsOpen: (open: boolean) => void;
    onExitModal?: () => void;
    isEditing?: boolean;
    onUpdateWatchList?: () => void;
}

// Fetch the user's watchlist and check if the movie is in it
async function isInWatchList(movieId: string): Promise<boolean> {
    const data = await fetch('http://localhost:8080/watchlist/1');
    const response = await data.json();
    const watchlist = response.movies;

    // Cast the movieId to a string and compare
    return watchlist.some((movie: string) => movie === `${movieId}`);
}

// Send a request to add/remove the movie from the user's watchlist
export async function sendWatchlistRequest(
    movieId: string,
    action: 'add' | 'remove',
): Promise<void> {
    const options: RequestInit = {
        method: action === 'add' ? 'POST' : 'DELETE',
    };
    await fetch(`http://localhost:8080/watchlist/1/${movieId}`, options);
}

// Fetch the reviews for a movie
async function fetchReviews(movieId: string) {
    const data = await fetch(`http://localhost:8080/reviews/movie/${movieId}`);
    const response = await data.json();
    return response.reviews;
}

export default function MovieModal(props: Props) {
    const baseImgUrl: string = 'https://image.tmdb.org/t/p/original';

    // Set reviewing to true if a review is passed as a prop
    const [reviewing, setReviewing] = useState<boolean>(
        () => props.review != null,
    );
    const [inWatchlist, setInWatchlist] = useState(false);
    const [reviews, setReviews] = useState<ReviewProps[]>([]);
    const [userReview, setUserReview] = useState<ReviewProps | undefined>(
        props.review,
    );
    const [state, action, pending] = useActionState(createReview, undefined);

    async function handleOpenModal() {
        // Show the modal
        (
            document.getElementById(
                String(props.movie.id),
            ) as HTMLDialogElement | null
        )?.showModal();

        // Check if the movie is in the user's watchlist
        const result = await isInWatchList(String(props.movie.id));
        setInWatchlist(result);

        // Fetch the reviews for the movie
        const reviews = await fetchReviews(String(props.movie.id));

        // Check if the user has already reviewed the movie
        // todo: replace with current user's id
        const userReview = reviews.find(
            (review: ReviewProps) => review.user_id === '1',
        );

        // Remove the user's review from the reviews list if it exists
        const filteredReviews = reviews.filter(
            (review: ReviewProps) => review.user_id !== '1',
        );

        // Set the reviews and user review state
        setReviews(filteredReviews);
        setUserReview(userReview);
    }

    async function handleWatchlist() {
        props.setIsOpen?.(true);
        await sendWatchlistRequest(
            String(props.movie.id),
            inWatchlist ? 'remove' : 'add',
        );
        setInWatchlist(!inWatchlist);

        // Call the On Update Watchlist method if it exists
        props.onUpdateWatchList?.();
    }

    // After submitting a review close the review form and show the reviews
    useEffect(() => {
        if (state?.success) {
            setReviewing(false);
            // Refresh the reviews list
            fetchReviews(String(props.movie.id)).then(
                (reviews: ReviewProps[]) => setReviews(reviews),
            );
        }
    }, [state]);

    // Set reviewing to true if there is a review prop on the first render
    useEffect(() => {
        if (props.review) {
            setReviewing(true);
        }
    }, [props.review]);

    useEffect(() => {
        if (props.isOpen) {
            handleOpenModal();
        }
    }, [props.isOpen]);

    return (
        <div className="flex items-center">
            {/* Button/Image trigger for the modal */}
            <button
                type="button"
                onClick={handleOpenModal}
                className="cursor-pointer"
            >
                {/* Mobile */}
                <img
                    className="rounded-xl sm:hidden"
                    src={`${baseImgUrl}${props.movie.poster_path}`}
                    alt={props.movie.title}
                    width={150}
                    height={20}
                />
                {/* Desktop */}
                <img
                    className="hidden rounded-xl sm:block"
                    src={`${baseImgUrl}${props.movie.poster_path}`}
                    alt={props.movie.title}
                    width={225}
                    height={20}
                />
            </button>
            {/* Modal */}
            <dialog className="modal" id={String(props.movie.id)}>
                <div className="modal-box grid h-4/5 max-w-6xl grid-cols-6 gap-10 overflow-hidden sm:h-3/5 xl:h-10/12">
                    {/* Image and Buttons */}
                    <div className="col-span-2 flex flex-col items-center gap-10">
                        <img
                            className="rounded-xl"
                            src={`${baseImgUrl}${props.movie.poster_path}`}
                            alt={props.movie.title}
                            width={250}
                            height={20}
                        />
                        <button
                            className="btn w-full btn-outline"
                            onClick={() => setReviewing(!reviewing)}
                        >
                            {!reviewing
                                ? userReview
                                    ? 'Edit Review'
                                    : 'Leave a review'
                                : 'View Movie'}
                        </button>
                        <button
                            className="btn w-full btn-outline"
                            onClick={handleWatchlist}
                        >
                            {inWatchlist ? 'Remove from' : 'Add to'} watchlist
                        </button>
                    </div>
                    {/* Description and reviews */}
                    <div className="col-span-4 col-start-3 flex flex-col gap-5 overflow-hidden">
                        <p className="text-3xl sm:text-5xl">
                            {props.movie.title}
                        </p>
                        {/* Rating */}
                        {!reviewing && (
                            <Rating
                                rating={props.movie.vote_average / 2}
                                size={'xl'}
                            />
                        )}
                        {!reviewing ? (
                            // Description
                            <div className="flex flex-1 flex-col gap-5 overflow-hidden">
                                <p className="text-lg sm:text-xl">Synopsis</p>
                                <p className="shrink-0 text-sm">
                                    {props.movie.overview}
                                </p>
                                {/* Reviews */}
                                <p className="shrink-0 text-xl">Reviews</p>
                                <div className="flex flex-1 flex-col overflow-y-auto">
                                    {/* User Review */}
                                    {userReview && (
                                        <Review
                                            rating={userReview.rating}
                                            review_description={
                                                userReview.review_description
                                            }
                                        />
                                    )}
                                    {/* Other Reviews */}
                                    {reviews.map((review: any) => (
                                        <Review
                                            key={review.id}
                                            rating={review.rating}
                                            review_description={
                                                review.review_description
                                            }
                                        />
                                    ))}
                                    {/* No Reviews Placeholder */}
                                    {reviews.length == 0 && !userReview && (
                                        <p className="text-l pt-10 text-center">
                                            No Reviews. Be the first!
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Review form
                            <ReviewForm
                                movie={props.movie}
                                isEditing={false}
                                action={action}
                            />
                        )}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button
                        onClick={() => {
                            setReviewing(false);
                            props.setIsOpen(false);
                            props.onExitModal?.();
                        }}
                    ></button>
                </form>
            </dialog>
        </div>
    );
}
