'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser {
    uid: string;
    email: string;
    role: 'super_admin' | 'admin' | 'moderator';
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.admin);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'ログインに失敗しました');
            }

            const data = await response.json();
            setUser(data.admin);
            router.push('/');
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
