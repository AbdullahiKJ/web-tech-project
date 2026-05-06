'use client';

import { MovieModal } from '@/components/movie-modal';
import { useEffect, useState } from 'react';
import { Movie } from '../lib/definitions';
import Pagination from '@/components/pagination';

export default function Home() {
    const [isOpen, setIsOpen] = useState<boolean[]>([]);
    const [featured, setFeatured] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    function setStateAtIndex(index: number) {
        return (value: boolean) => {
            const newState = [...isOpen];
            newState[index] = value;
            setIsOpen(newState);
        };
    }

    async function fetchFeatured(page?: number) {
        setLoading(true);
        // Get popular movies from the TMDB API
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_TMDB_AUTH,
            },
        };
        const data = await fetch(
            `https://api.themoviedb.org/3/movie/popular?page=${page || 1}&include_adult=false`,
            options,
        );
        const response = await data.json();
        setFeatured(response.results);
        setLoading(false);
        setTotalPages(response.total_pages);
        setPage(page || 1);
    }

    useEffect(() => {
        fetchFeatured();
    }, []);

    return (
        <main className="grid p-8">
            {loading ? (
                <div className="flex items-center justify-evenly">
                    <span className="loading loading-xl loading-spinner"></span>
                </div>
            ) : (
                <div className="flex flex-wrap justify-evenly gap-5 py-4">
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
            <Pagination
                index={page}
                count={totalPages}
                onPageChange={fetchFeatured}
            />
        </main>
    );
}
