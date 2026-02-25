import Review from '@/components/review';
import Rating from '@/components/rating';

interface Props {
    imageSrc: number;
}

export default function MovieModal(props: Props) {
    return (
        <div>
            {/* Button/Image trigger for the modal */}
            {/* todo: make modal id generic */}
            <button
                type="button"
                onClick={() =>
                    document.getElementById('exampleModal')?.showModal()
                }
            >
                <img
                    className="rounded-xl"
                    src={`/poster${props.imageSrc}.jpg`}
                    alt={`Poster ${props.imageSrc}`}
                    width={225}
                    height={20}
                />
            </button>
            {/* Modal */}
            {/* todo: make modal id generic */}
            <dialog className="modal" id="exampleModal">
                <div className="modal-box grid h-10/12 max-w-6xl grid-cols-6 gap-10">
                    {/* Image and Buttons */}
                    <div className="col-span-2 flex flex-col justify-items-center gap-10">
                        <img
                            className="rounded-xl"
                            src={`/poster${props.imageSrc}.jpg`}
                            alt={`Poster ${props.imageSrc}`}
                            width={250}
                            height={20}
                        />
                        <button className="btn btn-outline">
                            Leave a review
                        </button>
                        <button className="btn btn-outline">
                            Add/Remove to watchlist
                        </button>
                    </div>
                    {/* Description and reviews */}
                    <div className="col-span-4 col-start-3 flex flex-col gap-10">
                        <div>
                            <p className="text-5xl text-white">Movie Title</p>
                            {/* Rating */}
                            <Rating rating={2.5} size={1} />
                            <p className="text-xl text-white">Synopsis</p>
                        </div>
                        <p className="text-white">INSERT DETAILS HERE</p>
                        {/* Reviews */}
                        <div className="flex flex-col gap-3">
                            <p className="text-xl text-white">Reviews</p>
                            <Review />
                            <Review />
                            <Review />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button></button>
                </form>
            </dialog>
        </div>
    );
}