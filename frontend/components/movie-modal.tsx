'use client';
import Review from '@/components/review';
import Rating from '@/components/rating';
import React from 'react';

interface Props {
    movie: MovieInfo;
}

interface MovieInfo {
    poster_path: string;
    title: string;
    vote_average: number;
    overview: string;
    id: string;
}

export default function MovieModal(props: Props) {
    const baseImgUrl: string = 'https://image.tmdb.org/t/p/original';
    const [reviewing, setReveiwing] = React.useState(false);

    return (
        <div>
            {/* Button/Image trigger for the modal */}
            <button
                type="button"
                onClick={() =>
                    (document.getElementById(props.movie.id) as HTMLDialogElement | null)?.showModal()
                }
            >
                <img
                    className="rounded-xl"
                    src={`${baseImgUrl}${props.movie.poster_path}`}
                    alt={props.movie.title}
                    width={225}
                    height={20}
                />
            </button>
            {/* Modal */}
            <dialog className="modal" id={props.movie.id}>
                <div className="modal-box grid h-10/12 max-w-6xl grid-cols-6 gap-10">
                    {/* Image and Buttons */}
                    <div className="col-span-2 flex flex-col justify-items-center gap-10">
                        <img
                            className="rounded-xl"
                            src={`${baseImgUrl}${props.movie.poster_path}`}
                            alt={props.movie.title}
                            width={250}
                            height={20}
                        />
                        <button className="btn btn-outline" onClick={() => setReveiwing(true)}>
                            Leave a review
                        </button>
                        <button className="btn btn-outline">
                            Add/Remove to watchlist
                        </button>
                    </div>
                    {/* Description and reviews */}
                    <div className="col-span-4 col-start-3 flex flex-col gap-5">
                        <p className="text-5xl text-white">{props.movie.title}</p>
                        {/* Rating */}
                        <Rating rating={props.movie.vote_average} size={48} />
                        {!reviewing 
                            ? (
                            <div className="flex flex-col gap-5">
                                <p className="text-xl text-white">Synopsis</p>
                                <p className="text-white">{props.movie.overview}</p>
                                {/* Reviews */}
                                <div className="flex flex-col gap-3">
                                    <p className="text-xl text-white">Reviews</p>
                                    <Review />
                                    <Review />
                                    <Review />
                                </div>
                            </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    <p className='text-xl'>Review</p>
                                    <form className='flex flex-col gap-5'>
                                        <textarea className="textarea w-full min-h-85" placeholder="Write your review here..." />
                                        <button className="btn btn-outline flex-none float-right">Submit</button>
                                    </form>
                                </div>
                            )}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setReveiwing(false)}></button>
                </form>
            </dialog>
        </div>
    );
}