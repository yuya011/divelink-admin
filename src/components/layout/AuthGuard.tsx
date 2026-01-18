'use client';

// 開発用：認証ロジックを完全に排除したシンプル版
export function AuthGuard({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
