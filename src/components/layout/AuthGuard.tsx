'use client';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requiredRole?: 'moderator' | 'admin' | 'super_admin';
}

// 開発用：認証ロジックを完全に排除したシンプル版
export function AuthGuard({ children }: AuthGuardProps) {
    return <>{children}</>;
}
