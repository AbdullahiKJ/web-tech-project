'use client';

import { redirect } from 'next/navigation';
import { AuthContext } from '@/app/providers/AuthProvider';
import { useContext } from 'react';

export default function Home() {
    // Redirect to the login page if the user is not authenticated
    const authContext = useContext(AuthContext);
    if (!authContext?.user?.id) {
        redirect('/sign-in');
    }

    redirect('/profile/watchlist');
}
