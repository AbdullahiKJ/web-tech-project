import { Movie, ReviewFormState } from '@/app/lib/definitions';
import { ReviewProps } from './review';
import RatingInput from './rating-input';

interface Props {
    movie: Movie;
    review?: ReviewProps;
    isEditing?: boolean;
    action: (payload: FormData) => void;
    state?: ReviewFormState;
}
export default function ReviewForm(props: Props) {
    return (
        // Review form
        <div className="flex flex-col gap-5">
            <p className="text-xl">Review</p>
            <form className="flex flex-col gap-5" action={props.action}>
                <input
                    name="movie_id"
                    type="hidden"
                    value={String(props.movie.id)}
                />
                <input name="user_id" type="hidden" value={1} />{' '}
                {/* Replace with actual user ID */}
                <input
                    name="review_id"
                    type="hidden"
                    value={props.isEditing ? props.review?.id : ''}
                />
                <RatingInput
                    size="xl"
                    rating={props.review?.rating ?? undefined}
                />
                <textarea
                    name="review_description"
                    className="textarea min-h-85 w-full"
                    placeholder="Write your review here..."
                    defaultValue={props.review?.review_description ?? undefined}
                />
                <button
                    className="btn float-right flex-none btn-outline"
                    type="submit"
                >
                    Submit
                </button>
            </form>
            {props.state?.errors && (
                <div className="text-sm text-red-500">
                    {Object.entries(props.state.errors).map(
                        ([field, error]) => (
                            <div key={field}>
                                {error?.errors.map((err) => (
                                    <p key={err}>
                                        -{field}: {err}
                                    </p>
                                ))}
                            </div>
                        ),
                    )}
                </div>
            )}
        </div>
    );
}
