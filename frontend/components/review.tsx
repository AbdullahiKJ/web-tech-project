'use client';

import Rating from '@/components/rating';
import { CircleUser } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ReviewProps {
    rating: number;
    review_description: string;
    size?: number;
    user_id?: string;
    movie_id?: string;
    id?: string;
}

export default function Review(props: ReviewProps) {
    const [displayName, setDisplayName] = useState('Anon');
    // Get user display name from user_id
    useEffect(() => {
        async function fetchUser() {
            if (props.user_id) {
                try {
                    const res = await fetch(
                        `http://localhost:8080/users/${props.user_id}`,
                    );
                    if (res.ok) {
                        const json = await res.json();
                        setDisplayName(json.display_name);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
            fetchUser();
        }
    }, [props.user_id]);

    return (
        <div className="flex flex-row gap-3">
            {/* Icon */}
            <CircleUser className="h-10 w-10" />
            {/* Review */}
            <div className="flex flex-col">
                <p>{displayName}</p>
                <p>{props.review_description}</p>
                <Rating rating={props.rating} size={'sm'} />
            </div>
        </div>
    );
}
