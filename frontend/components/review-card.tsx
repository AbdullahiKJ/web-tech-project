import { Movie } from "@/app/lib/definitions";
import DeleteModal from "./delete-modal";
import MovieModal from "./movie-modal";
import Rating from "./rating";
import { ReviewProps } from "./review";
import { Pencil, Trash } from "lucide-react";

interface CardProps {
    movie: Movie,
    review: ReviewProps,
    onDelete: ((data: string | undefined) => Promise<void>),
}

export default function ReviewCard(props: CardProps) {  
    return (
        <div className="flex flex-row">
            <MovieModal movie={props.movie} />
            {/* Movie/Review Info */}
            <div className="flex flex-row gap-5 grow">
                <div className="flex flex-col p-5">
                    {/* Title */}
                    <p className="text-4xl pb-2">{props.movie.title ?? "Missing title"}</p>
                    {/* Rating */}
                    <Rating rating={props.review.rating} size={48}/>
                    {/* Review Description */}
                    <p className="pt-5">{props.review.review_description ?? "Missing description"}</p>
                </div>
                {/* Div to fill space */}
                <div className="grow"/>
                <div className="flex flex-row gap-5 p-5">
                    <button>
                        <Pencil/>
                    </button>
                    <DeleteModal reviewId={props.review.id} onConfirm={props.onDelete}>
                        <Trash/>
                    </DeleteModal>
                </div>
            </div>
        </div>
    );
}