'use client';

import { createContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: any;
    setUser: (user: any) => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the id for the currently logged in user and set the user state
    useEffect(() => {
        fetch('http://localhost:8080/auth', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
