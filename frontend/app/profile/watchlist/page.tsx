'use client'

import Sidebar from "@/components/sidebar";
import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/app/lib/definitions"
import MovieModal from "@/components/movie-modal";
import { Trash } from "lucide-react";

export default function Home() {
    const [watchlist, setWatchlist] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState<boolean[]>([]);

    function setStateAtIndex(index: number) {
        return (value: boolean) => {
            const newState = [...isOpen]
            newState[index] = value
            setIsOpen(newState)
        };
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_TMDB_AUTH
            }
    };

   const fetchWatchlist = useCallback(async () => {
        setLoading(true);

        // Get a list of the user's watchlist
        let res = await fetch('http://localhost:8080/watchlist/1');
        let json = await res.json();
 
        // Fetch each movie
        const moviePromises = json.movies.map(async (id: number) => {
                const movieRes = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}`,
                    options
                );

                const movie = await movieRes.json();

                return movie;
            });
        const movies = await Promise.all(moviePromises);

        setWatchlist(movies);
        setIsOpen([])
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist])

    async function handleDelete(movieId: string | undefined) {
        if(movieId != null)
        {
            await fetch(`http://localhost:8080/watchlist/1/${movieId}`, {method: "DELETE"});

            // refresh review list
            fetchWatchlist();
        }
        else
            throw new Error("Movie Id is null")
    }

    return (
        <Sidebar>
            <p className="text-3xl">Watchlist</p>
            {loading ? (
                <span className="loading loading-spinner loading-xl"></span>
                ) : (
                <div className="flex flex-wrap gap-5 py-4 justify-items-center">
                    {watchlist.map((movie: Movie, index: number) => {
                        return (
                        <div className="flex flex-col gap-2"  key={movie.id}>
                            <MovieModal 
                                movie={movie}
                                isOpen={isOpen[index]}
                                setIsOpen={setStateAtIndex(index)}
                                onUpdateWatchList={fetchWatchlist}
                            />
                            <div className="flex flex-row justify-evenly">
                                <button className="btn btn-lg btn-circle btn-error" onClick={() => handleDelete(String(movie.id))}>
                                    <Trash/>
                                </button>
                            </div>
                        </div>
                        );
                    })}  
                </div>
            )}
        </Sidebar>
    );
}