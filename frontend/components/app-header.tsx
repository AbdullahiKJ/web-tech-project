'use client'

import {
    Search,
    CircleUser,
    Clock,
    Star,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    const [theme, setTheme] = useState<"light"|"dark">("light");

    useEffect(() => {
    // Check if the theme is stored in local storage
    const saved = localStorage.getItem("theme") as "light"|"dark"|null;
    if (saved) {
        setTheme(saved);
    } 
    else {
        // Check if the system theme is dark if there is no local storage theme
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
    }
    }, []);

    // Update the theme when the theme state is updated
    useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    }, [theme]);

    // Update the theme and store 
    function toggleTheme() {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
  
    return (
        <>
            <div className="border-sidebar-border/80 bg-gray-950">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        {mainNavItems.map((item, index) => (
                                <Link
                                    href={item.href || "#"}
                                    className='h-9 cursor-pointer px-3 flex flex-row'
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
                        <div className="relative flex items-center space-x-1">
                            <button className="group h-9 w-9 cursor-pointer">
                                <Search className="size-5! opacity-80 group-hover:opacity-100" />
                            </button>
                        </div>
                        <Link
                            href="/sign-in"
                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                        >
                            Log in
                        </Link>
                        <label className="toggle text-base-content">
                            <input
                                type="checkbox"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                                className="theme-controller"
                            />
                            <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>
                            <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}