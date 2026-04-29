import { Bookmark, MessageCircleMore } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

export default forwardRef(function Menu(props, ref) {
    const [watchlistCount, setWatchlistCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    async function fetchReviews() {
        // Get a list of the user's reviews
        // todo: replace with the current user's id
        const res = await fetch('http://localhost:8080/reviews/users/1');
        const json = await res.json();

        // Set the review count
        setReviewCount(json.reviews.length);
    }

    async function fetchWatchlist() {
        // Get a list of the user's watchlist items
        // todo: replace with the current user's id
        const res = await fetch('http://localhost:8080/watchlist/1');
        const json = await res.json();

        // Set the watchlist count
        setWatchlistCount(json.movies.length);
    }

    function updateCounts(reviewCount?: number, watchlistCount?: number) {
        if (reviewCount !== undefined) setReviewCount(reviewCount);
        if (watchlistCount !== undefined) setWatchlistCount(watchlistCount);
    }

    useImperativeHandle(ref, () => ({
        fetchWatchlist,
        updateCounts,
    }));

    useEffect(() => {
        fetchReviews();
        fetchWatchlist();
    }, []);

    return (
        <div className="flex justify-center">
            <ul className="menu menu-horizontal w-full rounded-box bg-base-300 sm:w-auto">
                <li>
                    <Link href="/profile/watchlist">
                        <Bookmark />
                        Watchlist
                        <span className="badge badge-xs">
                            {watchlistCount > 99 ? '99+' : watchlistCount}
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/profile/reviews">
                        <MessageCircleMore />
                        Reviews
                        <span className="badge badge-xs badge-warning">
                            {reviewCount > 99 ? '99+' : reviewCount}
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/profile/settings">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            fill="none"
                            stroke="currentColor"
                            className="my-1.5 inline-block size-4"
                        >
                            <path d="M20 7h-9"></path>
                            <path d="M14 17H5"></path>
                            <circle cx="17" cy="17" r="3"></circle>
                            <circle cx="7" cy="7" r="3"></circle>
                        </svg>
                        Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
});
