'use client';

import { createContext, useEffect, useState } from 'react';
import { getCurrentUser, refreshSession } from '../actions/auth';

interface AuthContextType {
    user: any;
    setUser: (user: any) => void;
    refreshUser: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState(null);

    async function refreshUser() {
        const user = await getCurrentUser();
        setUser(user);
    }

    // Fetch the id for the currently logged in user and set the user state
    useEffect(() => {
        getCurrentUser()
            .then((data) => setUser(data))
            .catch(() => setUser(null));
    }, []);

    // Refresh the session every 5 miunutes to prevent it from expiring
    useEffect(() => {
        const timer = setInterval(
            () => {
                refreshSession();
            },
            5 * 60 * 1000,
        );

        return () => clearInterval(timer);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
