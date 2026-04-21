import { ReactElement } from 'react';

interface Props {
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rating?: number;
}

export default function RatingInput(props: Props) {
    const stars: ReactElement[] = [];
    for (let i = 0; i <= 10; i++) {
        const value = i / 2;
        if (value === 0) {
            stars.push(
                <input
                    type="radio"
                    name="rating"
                    className="rating-hidden"
                    defaultChecked={props.rating == null || props.rating === 0}
                    value={0}
                />,
            );
        } else {
            stars.push(
                <input
                    type="radio"
                    name="rating"
                    className={`mask mask-star-2 mask-half-${i % 2 === 0 ? '2' : '1'}`}
                    aria-label={`${value} star`}
                    defaultChecked={props.rating === value}
                    value={value}
                />,
            );
        }
    }
    return (
        <div className={`rating rating-half rating-${props.size}`}>{stars}</div>
    );
}
