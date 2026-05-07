import { Movie } from '@/app/lib/definitions';
import { DeleteModal } from './delete-modal';
import { MovieModal } from './movie-modal';
import Rating from './rating';
import { ReviewProps } from './review';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

interface CardProps {
    movie: Movie;
    review: ReviewProps;
    onDelete: (data: string | undefined) => Promise<void>;
    onUpdate: () => Promise<void>;
}

export default function ReviewCard(props: CardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reviewing, setReviewing] = useState(false);

    function openReviewModal() {
        setReviewing(true);
        setIsOpen(true);
    }

    function closeModal() {
        setReviewing(false);
        setIsOpen(false);
    }

    return (
        <div className="flex flex-row">
            <MovieModal
                movie={props.movie}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                review={props.review ?? undefined}
                onExitModal={closeModal}
                isEditing={reviewing ? true : false}
                onUpdateReview={props.onUpdate}
            />
            {/* Movie/Review Info */}
            <div className="flex grow flex-row sm:gap-5">
                <div className="flex flex-col p-5">
                    {/* Title */}
                    <p className="pb-2 text-3xl sm:text-4xl">
                        {props.movie.title ?? 'Missing title'}
                    </p>
                    {/* Rating */}
                    <Rating rating={props.review.rating} size={'xl'} />
                    {/* Review Description */}
                    <p className="pt-5">
                        {props.review.review_description ??
                            'Missing description'}
                    </p>
                </div>
                {/* Div to fill space */}
                <div className="hidden sm:flex sm:grow" />
                <div className="flex flex-col justify-center gap-5 p-5 sm:flex-row">
                    <button onClick={openReviewModal}>
                        <Pencil />
                    </button>
                    <DeleteModal
                        reviewId={props.review.id}
                        onConfirm={props.onDelete}
                    >
                        <Trash />
                    </DeleteModal>
                </div>
            </div>
        </div>
    );
}
