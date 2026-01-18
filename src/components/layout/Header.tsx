'use client';

import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
    const { user, logout } = useAuth();

    const getInitials = (email: string) => {
        return email.substring(0, 2).toUpperCase();
    };

    const getRoleBadge = (role: string) => {
        const labels: Record<string, string> = {
            super_admin: 'スーパー管理者',
            admin: '管理者',
            moderator: 'モデレーター',
        };
        return labels[role] || role;
    };

    return (
        <header className="fixed right-0 top-0 z-30 flex h-16 w-[calc(100%-16rem)] items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
            <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    管理者ダッシュボード
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        3
                    </span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                                    {user ? getInitials(user.email) : '?'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <p className="text-sm font-medium">{user?.email}</p>
                                <p className="text-xs text-gray-500">
                                    {user ? getRoleBadge(user.role) : ''}
                                </p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            プロフィール
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            ログアウト
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
