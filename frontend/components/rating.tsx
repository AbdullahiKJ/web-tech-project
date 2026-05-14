import { FullStar, EmptyStar, HalfStar } from './rating-input';
interface Props {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rating: number;
}

const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
};

export default function RatingDisplay({ size, rating }: Props) {
    const halfRating = Math.floor(rating * 2) / 2; // Round to nearest 0.5
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                let fillType: 'empty' | 'half' | 'full';
                if (halfRating >= star) {
                    fillType = 'full';
                } else if (halfRating >= star - 0.5) {
                    fillType = 'half';
                } else {
                    fillType = 'empty';
                }

                return (
                    <div key={star} className={sizeMap[size]}>
                        {fillType === 'full' && <FullStar />}
                        {fillType === 'half' && (
                            <HalfStar id={`display-half-${star}`} />
                        )}
                        {fillType === 'empty' && <EmptyStar />}
                    </div>
                );
            })}
        </div>
    );
}
