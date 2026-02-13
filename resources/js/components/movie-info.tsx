import Image from "next/image";
import Review from "@/components/Review";
import Rating from "@/components/Rating";

interface Props {
	imageSrc: number;
}

export default function MovieInfo(props: Props) {
	return (
		<div>
			{/* Button/Image trigger for the modal */}
			<button
				type="button"
				className="btn"
				data-bs-toggle="modal"
				data-bs-target="#exampleModal"
			>
				<Image
					className="rounded-xl"
					src={`/poster${props.imageSrc}.jpg`}
					alt={`Poster ${props.imageSrc}`}
					width={250}
					height={20}
					priority
				/>
			</button>
			{/* Modal */}
			<div
				className="modal fade"
				id="exampleModal"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
					<div className="modal-content rounded-5 border-5">
						<div className="modal-body bg-black p-4">
							<div className="container-fluid">
								<div className="row">
									{/* Image and Buttons */}
									<div className="col-4 ms-auto d-flex flex-col align-items-center gap-10">
										<Image
											className="rounded-xl"
											src={`/poster${props.imageSrc}.jpg`}
											alt={`Poster ${props.imageSrc}`}
											width={250}
											height={20}
											priority
										/>
										<button className="btn btn-primary">Leave a review</button>
										<button className="btn btn-primary">
											Add/Remove to watchlist
										</button>
									</div>
									{/* Description and reviews */}
									<div className="col-8 ms-auto d-flex flex-col gap-10">
										<div>
											<h1 className="text-white">Movie Title</h1>
											{/* Rating */}
											<Rating rating={2.5} size={1} />
											<h2 className="text-white">Synopsis</h2>
										</div>
										<p className="text-white">INSERT DETAILS HERE</p>
										{/* Reviews */}
										<div className="flex flex-column gap-3">
											<h2 className="text-white">Reviews</h2>
											<Review />
											<Review />
											<Review />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
