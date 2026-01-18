'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: 'super_admin' | 'admin' | 'moderator';
}

export function AuthGuard({ children, requiredRole = 'moderator' }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                    <p className="text-gray-500">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!user && pathname !== '/login') {
        return null;
    }

    // 権限チェック
    if (user && requiredRole) {
        const roleHierarchy = {
            super_admin: 3,
            admin: 2,
            moderator: 1,
        };

        if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
            return (
                <div className="flex h-screen items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500">アクセス権限がありません</h1>
                        <p className="mt-2 text-gray-500">
                            このページにアクセスするには {requiredRole} 以上の権限が必要です
                        </p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
}
