'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie } from '@/app/lib/definitions';
import MovieModal from '@/components/movie-modal';
import { Trash } from 'lucide-react';
import Menu from '@/components/menu';

export default function Home() {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState<boolean[]>([]);

    function setStateAtIndex(index: number) {
        return (value: boolean) => {
            const newState = [...isOpen];
            newState[index] = value;
            setIsOpen(newState);
        };
    }

    const menuRef = useRef<any>(null);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_TMDB_AUTH,
        },
    };

    const fetchWatchlist = useCallback(async () => {
        setLoading(true);

        // Get a list of the user's watchlist
        const res = await fetch('http://localhost:8080/watchlist/1');
        const json = await res.json();

        // Fetch each movie
        const moviePromises = json.movies.map(async (id: number) => {
            const movieRes = await fetch(
                `https://api.themoviedb.org/3/movie/${id}`,
                options,
            );

            const movie = await movieRes.json();

            return movie;
        });
        const movies = await Promise.all(moviePromises);

        setWatchlist(movies);
        setIsOpen([]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]);

    async function handleDelete(movieId: string | undefined) {
        if (movieId != null) {
            await fetch(`http://localhost:8080/watchlist/1/${movieId}`, {
                method: 'DELETE',
            });

            // update the watchlist list
            const newWatchlist = watchlist.filter(
                (movie) => String(movie.id) !== movieId,
            );
            setWatchlist(newWatchlist);

            // Update the menu counts
            menuRef.current?.updateCounts(undefined, newWatchlist.length);
        } else throw new Error('Movie Id is null');
    }

    return (
        <>
            <Menu ref={menuRef} />
            <div className="p-5">
                <p className="text-3xl">Watchlist</p>
                {loading ? (
                    <div className="flex items-center justify-evenly">
                        <span className="loading loading-xl loading-spinner"></span>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-evenly gap-5 py-4">
                        {watchlist.map((movie: Movie, index: number) => {
                            return (
                                <div
                                    className="flex flex-col gap-2"
                                    key={movie.id}
                                >
                                    <MovieModal
                                        movie={movie}
                                        isOpen={isOpen[index]}
                                        setIsOpen={setStateAtIndex(index)}
                                        onUpdateWatchList={fetchWatchlist}
                                    />
                                    <div className="flex flex-row justify-evenly">
                                        <button
                                            className="btn btn-circle btn-lg btn-error"
                                            onClick={() =>
                                                handleDelete(String(movie.id))
                                            }
                                        >
                                            <Trash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
