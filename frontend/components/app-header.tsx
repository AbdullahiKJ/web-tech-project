import {
    BookOpen,
    Folder,
    Search,
    CircleUser,
    Clock,
    Star,
} from 'lucide-react';
import Link from 'next/link';

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

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        icon: Folder,
    },
    {
        title: 'Documentation',
        icon: BookOpen,
    },
];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader() {
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
                            <button
                                className="group h-9 w-9 cursor-pointer"
                            >
                                <Search className="size-5! opacity-80 group-hover:opacity-100" />
                            </button>
                            <div className="ml-1 hidden gap-1 lg:flex">
                                {rightNavItems.map((item, index) => (
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                    key={index}
                                                >
                                                    <span className="sr-only">
                                                        {item.title}
                                                    </span>
                                                    {item.icon && (
                                                        <item.icon className="size-5 opacity-80 group-hover:opacity-100" />
                                                    )}
                                                </a>
                                ))}
                            </div>
                        </div>
                            <Link
                                href=""
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                    </div>
                </div>
            </div>
        </>
    );
}