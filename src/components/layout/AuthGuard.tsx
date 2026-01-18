'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requiredRole?: 'moderator' | 'admin' | 'super_admin';
}

export function AuthGuard({
    children,
    requireAuth = true,
    requiredRole
}: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // ログインページの場合は認証チェックをスキップ（ただしログイン済みならダッシュボードへ）
    const inLoginInfo = pathname === '/login';

    useEffect(() => {
        if (!loading && user && inLoginInfo) {
            router.push('/');
        }
        // 元のリダイレクトロジックは無効化
    }, [user, loading, router, pathname, inLoginInfo]);

    // 開発用：認証バイパス
    // ログイン画面へのアクセスはそのまま通し、それ以外は常に許可

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
