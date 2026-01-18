'use client';

import { createContext, useContext, ReactNode } from 'react';

// シンプルなダミーユーザー定義
const DUMMY_USER = {
    uid: 'dev-admin',
    email: 'admin@example.com',
    role: 'super_admin' as const,
};

const AuthContext = createContext({
    user: DUMMY_USER,
    loading: false,
    login: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <AuthContext.Provider value={{
            user: DUMMY_USER,
            loading: false,
            login: async () => { },
            logout: async () => { }
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

