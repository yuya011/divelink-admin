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

    // 開発用：常にログイン状態を返す（バイパス）
    // 本番環境に戻す際は、以下のダミーユーザー返却を削除し、下のコメントアウトされている元のロジックを有効化してください
    const dummyUser: AuthUser = {
        uid: 'dev-admin',
        email: 'admin@example.com',
        role: 'super_admin',
    };

    return (
        <AuthContext.Provider value={{ user: dummyUser, loading: false, login: async () => { }, logout: async () => { } }}>
            {children}
        </AuthContext.Provider>
    );

    /* 元の認証ロジック（一時無効化）
    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        // ...
    }
    // ...
    // ...
    
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    */
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

