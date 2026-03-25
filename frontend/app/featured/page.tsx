'use client'

import MovieModal from '@/components/movie-modal';
import { useEffect, useState } from 'react';
import { Movie } from '../lib/definitions';

export default function Home() {
    const [isOpen, setIsOpen] = useState<boolean[]>([]);
    const [featured, setFeatured] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true);

    function setStateAtIndex(index: number) {
        return (value: boolean) => {
            const newState = [...isOpen]
            newState[index] = value
            setIsOpen(newState)
        };
    }

    async function fetchFeatured() {
        setLoading(true);
        // Get popular movies from the TMDB API
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_TMDB_AUTH
            }
        }
        let data = await fetch('https://api.themoviedb.org/3/movie/popular', options);
        let response = await data.json();
        setFeatured(response.results);
        setLoading(false);
    }

    useEffect(() => {
        fetchFeatured();
    }, []);

    return (
        <main className="flex flex-col items-center justify-between px-8 py-8">
            {loading ? (
                <div>
                    <span className="loading loading-spinner loading-xl"></span>
                </div>
            ) : (
                <div className="flex flex-wrap gap-5 py-4 justify-items-center">
                    {featured.map((movie: Movie, index: number) => (
                        <MovieModal 
                            key={movie.id} 
                            movie={movie}
                            isOpen={isOpen[index]} 
                            setIsOpen={setStateAtIndex(index)} 
                            isEditing={false}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}