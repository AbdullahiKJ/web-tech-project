'use client';

import { Search, CircleUser, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type NavItem = {
    title?: string;
    icon?: React.ElementType;
    href?: string;
};

const mainNavItems: NavItem[] = [
    {
        title: 'Featured',
        icon: Star,
        href: '/featured',
    },
    {
        title: 'Upcoming',
        icon: Clock,
        href: '/upcoming',
    },
    {
        title: 'Profile',
        icon: CircleUser,
        href: '/profile',
    },
];

export function AppHeader() {
    const [query, setQuery] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const router = useRouter();

    useEffect(() => {
        // Check if the theme is stored in local storage
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (saved) {
            setTheme(saved);
        } else {
            // Check if the system theme is dark if there is no local storage theme
            const prefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    // Update the theme when the theme state is updated
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Update the theme
    function toggleTheme() {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }

    function handleSubmit(e: React.SubmitEvent) {
        // Prevent the form from being resubmited
        e.preventDefault();
        // Navigate to the search page if there is a valid query
        if (query != '') router.push(`/search?page=1&query=${query}`);
    }

    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                {/* Desktop Navigation */}
                <div className="flex">
                    {mainNavItems.map((item, index) => (
                        <Link
                            href={item.href || '#'}
                            className="flex h-9 cursor-pointer flex-row px-3"
                            key={index}
                        >
                            {item.icon && (
                                <item.icon className="mr-2 h-4 w-4" />
                            )}
                            {item.title}
                        </Link>
                    ))}
                </div>

                <div className="ml-auto flex items-center space-x-2">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="input-bordered input w-24 md:w-auto"
                        />
                        <button type="submit">
                            <Search />
                        </button>
                    </form>
                    <Link href="/sign-in" className="btn">
                        Log in
                    </Link>
                    <label className="toggle text-base-content">
                        <input
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                            className="theme-controller"
                        />
                        <svg
                            aria-label="sun"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="12" cy="12" r="4"></circle>
                                <path d="M12 2v2"></path>
                                <path d="M12 20v2"></path>
                                <path d="m4.93 4.93 1.41 1.41"></path>
                                <path d="m17.66 17.66 1.41 1.41"></path>
                                <path d="M2 12h2"></path>
                                <path d="M20 12h2"></path>
                                <path d="m6.34 17.66-1.41 1.41"></path>
                                <path d="m19.07 4.93-1.41 1.41"></path>
                            </g>
                        </svg>
                        <svg
                            aria-label="moon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            </g>
                        </svg>
                    </label>
                </div>
            </div>
        </>
    );
}
