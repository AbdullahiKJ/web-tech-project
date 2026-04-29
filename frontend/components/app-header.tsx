'use client';

import { Search, CircleUser, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { AuthContext } from '@/app/providers/AuthProvider';

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
    // Get the auth context to determine if the user is logged in
    const authContext = useContext(AuthContext);

    const [query, setQuery] = useState('');
    const router = useRouter();

    function handleSubmit(e: React.SubmitEvent) {
        // Prevent the form from being resubmited
        e.preventDefault();
        // Navigate to the search page if there is a valid query
        if (query != '') router.push(`/search?page=1&query=${query}`);
    }

    function handleSignOut() {
        if (authContext?.user?.id) {
            // fetch the sign out endpoint
            fetch('http://localhost:8080/auth/logout', {
                method: 'POST',
                credentials: 'include',
            }).then(() => {
                // Clear the user from the auth context
                authContext.setUser(null);
                // Navigate to the home page
                router.push('/');
            });
        }
    }

    return (
        <>
            <div className="navbar bg-base-300 shadow-sm">
                {/* Mobile Navigation */}
                <div className="sm:hidden">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-circle btn-ghost"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {' '}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7"
                                />{' '}
                            </svg>
                        </div>
                        <ul
                            tabIndex={-1}
                            className="dropdown-content menu z-1 mt-3 w-52 menu-sm rounded-box bg-base-300 p-2 shadow"
                        >
                            {mainNavItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href || '#'}
                                        className="flex h-9 cursor-pointer flex-row items-center px-3"
                                        key={index}
                                    >
                                        {item.icon && (
                                            <item.icon className="mr-2 h-4 w-4" />
                                        )}
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden sm:flex">
                    {mainNavItems.map((item, index) => (
                        <Link
                            href={item.href || '#'}
                            className="flex h-9 cursor-pointer flex-row items-center px-3"
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
                    <form onSubmit={handleSubmit} className="flex gap-5">
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
                    <Link
                        href={authContext?.user?.id ? '' : '/sign-in'}
                        className="btn"
                        onClick={handleSignOut}
                    >
                        {authContext?.user?.id ? 'Log out' : 'Log in'}
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </>
    );
}
