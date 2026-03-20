import { ReactElement } from 'react';
import { Star, StarHalf } from 'lucide-react';

interface Props {
    rating: number;
    size: number;
}

export default function Rating(props: Props) {
    let fullStars = Math.floor(props.rating/1);
    let halfStars = props.rating % 1 >= 0.5 ? 1 : 0;

    const starCount = 5;
    const stars: ReactElement[] = [];
    let count = 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Star className="fill-white" key={count} size={props.size} />,
        );
        count++;
    }

    // Half stars
    for (let i = 0; i < halfStars; i++) {
        stars.push(
            <StarHalf className="fill-white" key={count} size={props.size} />,
        );
        count++;
    }

    // Empty stars
    let leftovers = starCount - stars.length;
    for (let i = 0; i < leftovers; i++) {
        stars.push(<Star key={count} size={props.size}/>);
        count++;
    }
    return <div className="flex">{stars}</div>;
}