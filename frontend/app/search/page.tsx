'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Movie } from '../lib/definitions';
import { MovieModal } from '@/components/movie-modal';
import Pagination from '@/components/pagination';

export default function Home() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');

    const [isOpen, setIsOpen] = useState<boolean[]>([]);
    const [results, setResults] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    function setStateAtIndex(index: number) {
        return (value: boolean) => {
            const newState = [...isOpen];
            newState[index] = value;
            setIsOpen(newState);
        };
    }

    async function fetchQuery(page?: number) {
        // Fetch search results from the TMDB API
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_TMDB_AUTH,
            },
        };
        const data = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page || 1}`,
            options,
        );
        const response = await data.json();
        setResults(response.results);
        setTotalPages(response.total_pages);
        setPage(page || 1);
    }

    // Refetch search results when the query changes
    useEffect(() => {
        if (query) fetchQuery();
    }, [query]);

    return (
        <main className="grid p-8">
            {results != undefined && results.length > 0 ? (
                <div className="flex flex-wrap justify-evenly gap-5 py-4">
                    {results.map((movie: Movie, index: number) => (
                        <MovieModal
                            key={movie.id}
                            movie={movie}
                            isOpen={isOpen[index]}
                            setIsOpen={setStateAtIndex(index)}
                            isEditing={false}
                        />
                    ))}
                </div>
            ) : (
                <div>No results found</div>
            )}
            <Pagination
                index={page}
                count={totalPages}
                onPageChange={fetchQuery}
            />
        </main>
    );
}
