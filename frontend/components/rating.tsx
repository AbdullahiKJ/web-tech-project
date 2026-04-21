import { ReactElement } from 'react';

interface Props {
    rating: number;
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Rating(props: Props) {
    // Round to nearest 0.5
    const halfRating = Math.round(props.rating * 2) / 2;
    const stars: ReactElement[] = [];

    for (let i = 0; i <= 10; i++) {
        const value = i / 2;
        if (value === 0) {
            stars.push(
                <div
                    className="rating-hidden w-0"
                    aria-label={`${value} star`}
                    aria-current={halfRating === value}
                />,
            );
        } else {
            stars.push(
                <div
                    className={`mask mask-star-2 mask-half-${i % 2 === 0 ? '2' : '1'}`}
                    aria-label={`${value} star`}
                    aria-current={halfRating === value}
                ></div>,
            );
        }
    }

    return (
        <div className={`rating rating-half rating-${props.size}`}>{stars}</div>
    );
}
