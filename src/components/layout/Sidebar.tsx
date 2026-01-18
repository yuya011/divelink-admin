'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BarChart3,
    Bell,
    Store,
    AlertTriangle,
    HeadphonesIcon,
    Users,
    Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'ダッシュボード', icon: LayoutDashboard },
    { href: '/analytics', label: '統計・分析', icon: BarChart3 },
    { href: '/notifications', label: '通知配信', icon: Bell },
    { href: '/shops', label: 'ショップ管理', icon: Store },
    { href: '/reports', label: '報告対応', icon: AlertTriangle },
    { href: '/support', label: 'サポート', icon: HeadphonesIcon },
    { href: '/users', label: 'ユーザー管理', icon: Users },
    { href: '/settings', label: 'システム設定', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400" />
                    <span className="text-xl font-bold tracking-tight">DiveLink</span>
                    <span className="text-xs text-gray-500">Admin</span>
                </Link>
            </div>

            <nav className="space-y-1 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
