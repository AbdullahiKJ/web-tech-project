'use client';

import MovieModal from '@/components/movie-modal';
import { ReactNode, useEffect, useState } from 'react';
import { Movie } from '../lib/definitions';

export default function Home() {
    const [isOpen, setIsOpen] = useState<boolean[]>([]);
    const [featured, setFeatured] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    function setStateAtIndex(index: number) {
        return (value: boolean) => {
            const newState = [...isOpen];
            newState[index] = value;
            setIsOpen(newState);
        };
    }

    async function fetchFeatured() {
        setLoading(true);
        // Get upcoming movies from the TMDB API
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_TMDB_AUTH,
            },
        };

        // Set the min and max dates to search for upcoming movies (starting today and ending a year from now)
        const today = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(
            today.getFullYear() + 1,
            today.getMonth(),
            today.getDate(),
        );

        const minDate = today.toISOString().split('T')[0];
        const maxDate = nextYear.toISOString().split('T')[0];

        const data = await fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=${minDate}&primary_release_date.lte=${maxDate}&sort_by=popularity.desc`,
            options,
        );
        const response = await data.json();
        setFeatured(response.results);
        setLoading(false);
    }

    useEffect(() => {
        fetchFeatured();
    }, []);

    function getTimeUntilMovie(release_date: string): ReactNode {
        const release = new Date(release_date);
        let difference = Math.floor(
            (release.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        if (difference < 0) difference = 0;

        // Compress the difference to days, months or year plus and assign badge classes for each category
        let display;
        let badgeClass;
        if (difference <= 30) {
            display = `${difference} days`;
            badgeClass = 'badge-success';
        } else if (difference <= 120) {
            display = `${Math.floor(difference / 30)} months`;
            badgeClass = 'badge-warning';
        } else if (difference < 365) {
            display = `${Math.floor(difference / 30)} months`;
            badgeClass = 'badge-error';
        } else {
            display = '1 year+';
            badgeClass = 'badge-error';
        }

        return (
            <div className={`align-center badge ${badgeClass}`}>
                <p>{display}</p>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center justify-between px-8 py-8">
            {loading ? (
                <div>
                    <span className="loading loading-xl loading-spinner"></span>
                </div>
            ) : (
                <div className="flex flex-wrap justify-evenly gap-5 py-4">
                    {featured.map((movie: Movie, index: number) => (
                        <div
                            className="flex flex-col items-center gap-2"
                            key={movie.id}
                        >
                            <MovieModal
                                key={movie.id}
                                movie={movie}
                                isOpen={isOpen[index]}
                                setIsOpen={setStateAtIndex(index)}
                                isEditing={false}
                            />
                            {getTimeUntilMovie(movie.release_date)}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
