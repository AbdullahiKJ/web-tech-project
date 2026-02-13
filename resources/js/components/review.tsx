import Rating from "@/components/Rating";

export default function Review() {
	return (
		<div className="flex flex-row gap-3">
			{/* Icon */}
			<i className="bi bi-person-circle fs-1 align-self-center text-white"></i>
			{/* Review */}
			<div className="flex flex-col">
				<p className="text-white">Lorem ipsum</p>
				<Rating rating={4} size={2} />
			</div>
		</div>
	);
}
