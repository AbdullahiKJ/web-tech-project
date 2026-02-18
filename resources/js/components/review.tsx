import Rating from '@/components/rating';
import { CircleUser } from 'lucide-react';

export default function Review() {
    return (
        <div className="flex flex-row gap-3">
            {/* Icon */}
            <CircleUser className="h-10 w-10" />
            {/* Review */}
            <div className="flex flex-col">
                <p className="text-white">Lorem ipsum</p>
                <Rating rating={4} size={2} />
            </div>
        </div>
    );
}
