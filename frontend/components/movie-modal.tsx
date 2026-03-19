'use client';
import { ReviewProps} from '@/components/review';
import Review from '@/components/review';
import Rating from '@/components/rating';
import { useEffect, useActionState, useState } from 'react';
import {createReview} from "@/app/actions/reviews";
import { Movie } from '@/app/lib/definitions';

interface Props {
    movie: Movie;
}

async function isInWatchList(movieId: string): Promise<boolean> {
    // Fetch the user's watchlist and check if the movie is in it
    let data = await fetch('http://localhost:8080/watchlist/1');
    let response = await data.json();
    let watchlist = response.movies;

    // Cast the movieId to a string and compare
    return watchlist.some((movie: string) => movie === `${movieId}`);
}

async function sendWatchlistRequest(movieId: string, action: 'add' | 'remove'): Promise<void> {
    const options: RequestInit = {
        method: action === 'add' ? 'POST' : 'DELETE',
    };
    await fetch(`http://localhost:8080/watchlist/1/${movieId}`, options);
}

async function fetchReviews(movieId: string) {
    let data = await fetch(`http://localhost:8080/reviews/movie/${movieId}`);
    let response = await data.json();
    return response.reviews;
}

export default function MovieModal(props: Props) {
    const baseImgUrl: string = 'https://image.tmdb.org/t/p/original';
    const [reviewing, setReviewing] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [reviews, setReviews] = useState<ReviewProps[]>([]);
    const [state, action, pending] = useActionState(createReview, undefined)

    async function handleOpenModal() {
        // Show the modal
        (document.getElementById(String(props.movie.id)) as HTMLDialogElement | null)?.showModal();

        // Check if the movie is in the user's watchlist
        const result = await isInWatchList(String(props.movie.id));
        setInWatchlist(result);

        // Fetch the reviews for the movie
        const reviews = await fetchReviews(String(props.movie.id));
        setReviews(reviews);
    }

    async function handleWatchlist() {
        await sendWatchlistRequest(String(props.movie.id), inWatchlist ? 'remove' : 'add');
        setInWatchlist(!inWatchlist);
    }

    // After submitting a review close the review form and show the reviews
    useEffect(() => {
        if(state?.success) {
            setReviewing(false);
            // Add your review to the top of the reviews list
            setReviews([state.review, ...reviews]);
        }
        }, [state])

    return (
        <div>
            {/* Button/Image trigger for the modal */}
            <button
                type="button"
                onClick={handleOpenModal}
                className='cursor-pointer'
            >
                <img
                    className="rounded-xl"
                    src={`${baseImgUrl}${props.movie.poster_path}`}
                    alt={props.movie.title}
                    width={225}
                    height={20}
                />
            </button>
            {/* Modal */}
            <dialog className="modal" id={String(props.movie.id)}>
                <div className="modal-box grid h-10/12 max-w-6xl grid-cols-6 gap-10">
                    {/* Image and Buttons */}
                    <div className="col-span-2 flex flex-col justify-items-center gap-10">
                        <img
                            className="rounded-xl"
                            src={`${baseImgUrl}${props.movie.poster_path}`}
                            alt={props.movie.title}
                            width={250}
                            height={20}
                        />
                        <button className="btn btn-outline" onClick={() => setReviewing(true)}>
                            Leave a review
                        </button>
                        <button className="btn btn-outline" onClick={handleWatchlist}>
                            {inWatchlist ? 'Remove from' : 'Add to'} watchlist
                        </button>
                    </div>
                    {/* Description and reviews */}
                    <div className="col-span-4 col-start-3 flex flex-col gap-5">
                        <p className="text-5xl text-white">{props.movie.title}</p>
                        {/* Rating */}
                        {!reviewing && <Rating rating={props.movie.vote_average} size={48} />}
                        {!reviewing 
                            ? (
                            // Description
                            <div className="flex flex-col gap-5">
                                <p className="text-xl text-white">Synopsis</p>
                                <p className="text-white">{props.movie.overview}</p>
                                {/* Reviews */}
                                <div className="flex flex-col gap-3">
                                    <p className="text-xl text-white">Reviews</p>
                                    {reviews.map((review: any) => (
                                        <Review key={review.id}
                                            rating={review.rating}
                                            review_description={review.review_description}
                                        />
                                    ))}
                                    <Review rating={4} review_description='testing'/>
                                    <Review rating={3.5} review_description='Another review'/>
                                    <Review rating={5} review_description='Excellent movie!'/>
                                </div>
                            </div>
                            ) : (
                                // Review form
                                <div className="flex flex-col gap-5">
                                    <p className='text-xl'>Review</p>
                                    <form className='flex flex-col gap-5' action={action}>
                                        <input name="movie_id" type="hidden" value={String(props.movie.id)} />
                                        <input name="user_id" type="hidden" value={1} /> {/* Replace with actual user ID */}
                                        <input name="rating" type="number" step="0.5" min="0" max="5" className="input input-bordered" placeholder="Rating (0-5)"/>
                                        <textarea name="review_description" className="textarea w-full min-h-85" placeholder="Write your review here..." />
                                        <button className="btn btn-outline flex-none float-right" type="submit">
                                            Submit
                                        </button>
                                    </form>
                                    {state?.errors && (
                                        <div className="text-sm text-red-500">
                                            {Object.entries(state.errors).map(([field, error]) => (
                                                <div key={field}>
                                                    {error?.errors.map((err) => (
                                                        <p key={err}>- {err}</p>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setReviewing(false)}></button>
                </form>
            </dialog>
        </div>
    );
}