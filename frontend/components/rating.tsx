import { ReactElement } from 'react';
import { Star, StarHalf } from 'lucide-react';

interface Props {
    rating: number;
    size: number;
}

export default function Rating(props: Props) {
    let fullStars = Math.floor(props.rating);
    let halfStars = props.rating - fullStars >= 0.5 ? 0.5 : 0;

    const starCount = 5;
    const stars: ReactElement[] = [];
    let count = 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Star className={`fs-${props.size} fill-white`} key={count} />,
        );
        count++;
    }

    // Half stars
    for (let i = 0; i < halfStars; i++) {
        stars.push(
            <StarHalf className={`fs-${props.size} fill-white`} key={count} />,
        );
        count++;
    }

    // Empty stars
    let leftovers = starCount - stars.length;
    for (let i = 0; i < leftovers; i++) {
        stars.push(<Star className={`fs-${props.size}`} key={count} />);
        count++;
    }
    return <div className="flex">{stars}</div>;
}