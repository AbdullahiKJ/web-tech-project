import { ReactElement } from "react";

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

	for (let i = 0; i < fullStars; i++) {
		stars.push(
			<i
				className={`bi bi-star-fill fs-${props.size} text-white`}
				key={count}
			/>,
		);
		count++;
	}
	for (let i = 0; i < halfStars; i++) {
		stars.push(
			<i
				className={`bi bi-star-half fs-${props.size} text-white`}
				key={count}
			/>,
		);
		count++;
	}
	let leftovers = starCount - stars.length;
	for (let i = 0; i < leftovers; i++) {
		stars.push(
			<i className={`bi bi-star fs-${props.size} text-white`} key={count} />,
		);
		count++;
	}
	return <div>{stars}</div>;
}
