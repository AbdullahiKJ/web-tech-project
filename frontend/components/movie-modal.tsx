'use client';
import { ReviewProps } from '@/components/review';
import Review from '@/components/review';
import Rating from '@/components/rating';
import {
    useEffect,
    useActionState,
    useState,
    useContext,
    forwardRef,
    useRef,
} from 'react';
import { createReview } from '@/app/actions/reviews';
import { Movie } from '@/app/lib/definitions';
import ReviewForm from './review-form';
import { AuthContext } from '@/app/providers/AuthProvider';
import { redirect } from 'next/navigation';

interface Props {
    movie: Movie;
    review?: ReviewProps;
    isOpen?: boolean;
    setIsOpen: (open: boolean) => void;
    onExitModal?: () => void;
    isEditing?: boolean;
    onUpdateWatchList?: () => void;
    onUpdateReview?: () => void;
}

// Fetch the user's watchlist and check if the movie is in it
async function isInWatchList(
    movieId: string,
    userId: number | null,
): Promise<boolean> {
    if (userId == null) return false;

    const data = await fetch(`http://localhost:8080/watchlist/${userId}`);
    const response = await data.json();
    const watchlist = response.movies;

    // Cast the movieId to a string and compare
    return watchlist.some((movie: string) => movie === `${movieId}`);
}

// Send a request to add/remove the movie from the user's watchlist
export async function sendWatchlistRequest(
    movieId: string,
    userId: number | null,
    action: 'add' | 'remove',
): Promise<void> {
    if (userId == null) return;

    const options: RequestInit = {
        method: action === 'add' ? 'POST' : 'DELETE',
    };
    await fetch(
        `http://localhost:8080/watchlist/${userId}/${movieId}`,
        options,
    );
}

// Fetch the reviews for a movie
async function fetchReviews(movieId: string) {
    const data = await fetch(`http://localhost:8080/reviews/movie/${movieId}`);
    const response = await data.json();
    return response.reviews;
}

export const MovieModal = forwardRef<HTMLDialogElement, Props>((props, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Get auth context
    const authContext = useContext(AuthContext);

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
        dialogRef.current?.showModal();

        // Check if the movie is in the user's watchlist
        const result = await isInWatchList(
            String(props.movie.id),
            authContext?.user?.id,
        );
        setInWatchlist(result);

        // Fetch the reviews for the movie
        const reviews = await fetchReviews(String(props.movie.id));

        // Check if the user has already reviewed the movie
        let userReview = null;
        if (authContext?.user?.id) {
            userReview = reviews.find(
                (review: ReviewProps) =>
                    review.user_id === authContext?.user?.id.toString(),
            );
        }

        // Remove the user's review from the reviews list if it exists
        const filteredReviews = reviews.filter(
            (review: ReviewProps) => review.user_id !== authContext?.user?.id,
        );

        // Set the reviews and user review state
        setReviews(filteredReviews);
        setUserReview(userReview);
    }

    function handleCloseModal() {
        dialogRef.current?.close();
        setReviewing(false);
        props.setIsOpen(false);
        props.onExitModal?.();
    }

    function handleReview() {
        // Redirect to the login page if the user is not authenticated
        if (authContext?.user?.id == null) redirect('/sign-in');

        setReviewing(!reviewing);
    }

    async function handleWatchlist() {
        // Redirect to the login page if the user is not authenticated
        if (authContext?.user?.id == null) redirect('/sign-in');

        props.setIsOpen?.(true);
        await sendWatchlistRequest(
            String(props.movie.id),
            authContext?.user?.id,
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
            handleOpenModal();
            // Call the onUpdateReview method if it exists
            props.onUpdateReview?.();
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
                data-testid={'open-modal-button'}
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
            <dialog
                ref={dialogRef}
                className="modal"
                id={String(props.movie.id)}
                data-testid={props.movie.id}
            >
                <div className="relative modal-box max-h-[90vh] w-11/12 max-w-7xl overflow-y-auto p-4 sm:p-6">
                    {/* Button to close the modal */}
                    <div className="sticky top-0 z-20 flex justify-end bg-transparent pb-2">
                        <button
                            className="btn btn-circle btn-sm"
                            onClick={handleCloseModal}
                            data-testid="close-modal-button-2"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Panel: Image and Buttons */}
                        <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col lg:gap-6">
                            <img
                                className="w-32 rounded-xl sm:w-48 lg:w-full lg:max-w-[250px]"
                                src={`${baseImgUrl}${props.movie.poster_path}`}
                                alt={props.movie.title}
                            />
                            <button
                                className="btn h-auto w-full btn-outline sm:w-auto lg:w-full"
                                onClick={handleReview}
                                data-testid="review-button"
                            >
                                {!reviewing
                                    ? userReview
                                        ? 'Edit Review'
                                        : 'Leave a review'
                                    : 'View Movie'}
                            </button>
                            <button
                                className="btn h-auto w-full btn-outline sm:w-auto lg:w-full"
                                onClick={handleWatchlist}
                                data-testid="watchlist-button"
                            >
                                {inWatchlist ? 'Remove from' : 'Add to'}{' '}
                                watchlist
                            </button>
                        </div>
                        {/* Right Panel: Description and reviews */}
                        <div className="flex min-h-0 flex-col gap-5 lg:col-span-2">
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
                                    <p className="text-lg sm:text-xl">
                                        Synopsis
                                    </p>
                                    <p className="shrink-0 text-sm">
                                        {props.movie.overview}
                                    </p>
                                    {/* Reviews */}
                                    <p className="shrink-0 text-xl">Reviews</p>
                                    <div className="flex-1 overflow-y-auto">
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
                                        {reviews.map((review: ReviewProps) => (
                                            <Review
                                                key={review.id}
                                                rating={review.rating}
                                                review_description={
                                                    review.review_description
                                                }
                                                user_id={review.user_id}
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
                                    isEditing={userReview != null}
                                    action={action}
                                    review={userReview}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button
                        onClick={handleCloseModal}
                        data-testid="close-modal-button"
                    ></button>
                </form>
            </dialog>
        </div>
    );
});
