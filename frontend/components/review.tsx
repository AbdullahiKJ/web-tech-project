import Rating from '@/components/rating';
import { CircleUser } from 'lucide-react';

export interface ReviewProps {
    rating: number;
    review_description: string;
    size?: number;
    user_id?: string;
}

export default function Review(props: ReviewProps) {
    return (
        <div className="flex flex-row gap-3">
            {/* Icon */}
            <CircleUser className="h-10 w-10" />
            {/* Review */}
            <div className="flex flex-col">
                <p className="text-white">{props.review_description}</p>
                <Rating rating={props.rating} size={props.size ?? 24} />
            </div>
        </div>
    );
}