'use client';

import { useState } from 'react';

interface Props {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rating?: number;
}

export const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
};

export const FullStar = () => (
    <svg viewBox="0 0 640 640" fill="#FCD34D">
        <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
    </svg>
);

export const HalfStar = ({ id }: { id: string }) => {
    const uniqueId = `${id}-${Math.random().toString(36).slice(2, 9)}`;
    const clipId = `clip-${uniqueId}`;

    return (
        <svg viewBox="0 0 640 640">
            {/* grey background (empty star) */}
            <path
                d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
                fill="#E5E7EB"
            />

            {/* left half filled */}
            <defs>
                <clipPath id={clipId}>
                    <rect x="0" y="0" width="320" height="640" />
                </clipPath>
            </defs>

            <path
                d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
                fill="#FCD34D"
                clipPath={`url(#${clipId})`}
            />
        </svg>
    );
};

export const EmptyStar = () => (
    <svg viewBox="0 0 640 640" fill="#E5E7EB">
        <path d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
    </svg>
);

export default function RatingInput(props: Props) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState(props.rating || 0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const current = hoverRating ?? selectedRating;

                let fillType: 'empty' | 'half' | 'full' = 'empty';

                if (current >= star) fillType = 'full';
                else if (current >= star - 0.5) fillType = 'half';

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={(e) => {
                            const rect =
                                e.currentTarget.getBoundingClientRect();

                            const isHalf =
                                e.clientX - rect.left < rect.width / 2;

                            setSelectedRating(isHalf ? star - 0.5 : star);
                        }}
                        onMouseMove={(e) => {
                            const rect =
                                e.currentTarget.getBoundingClientRect();

                            const isHalf =
                                e.clientX - rect.left < rect.width / 2;

                            setHoverRating(isHalf ? star - 0.5 : star);
                        }}
                        onMouseLeave={() => setHoverRating(null)}
                        className={`${sizeMap[props.size]} cursor-pointer`}
                        aria-label={`${star} star rating`}
                    >
                        {fillType === 'full' && <FullStar />}

                        {fillType === 'half' && (
                            <HalfStar id={`input-half-${star}`} />
                        )}

                        {fillType === 'empty' && <EmptyStar />}
                    </button>
                );
            })}
            <input
                type="hidden"
                name="rating"
                value={selectedRating}
                data-testid="rating-value"
            />
        </div>
    );
}
