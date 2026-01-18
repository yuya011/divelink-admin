'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    MoreHorizontal,
    User,
    Mail,
    Calendar,
    FileText,
    AlertTriangle,
    Ban,
    MessageSquare,
    Shield,
    Loader2,
    RefreshCw
} from 'lucide-react';

export interface UserData {
    uid: string;
    email: string;
    name: string;
    rank: string;
    organization: string;
    totalLogs: number;
    lastLoginAt: string;
    createdAt: string;
    isShopStaff: boolean;
    isBanned: boolean;
}

interface UsersClientProps {
    initialUsers: UserData[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>(initialUsers);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [actionType, setActionType] = useState<'warn' | 'ban' | 'unban' | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const refreshData = () => {
        setLoading(true);
        router.refresh();
        setTimeout(() => setLoading(false), 1000);
    };

    const filteredUsers = users.filter((user) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (user.name?.toLowerCase() || '').includes(query) ||
            (user.email?.toLowerCase() || '').includes(query) ||
            (user.uid?.toLowerCase() || '').includes(query)
        );
    });

    const handleViewDetail = (user: UserData) => {
        setSelectedUser(user);
        setIsDetailOpen(true);
    };

    const handleAction = (user: UserData, action: 'warn' | 'ban' | 'unban') => {
        setSelectedUser(user);
        setActionType(action);
        setIsActionOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedUser || !actionType) return;
        setProcessingId(selectedUser.uid);

        try {
            const res = await fetch(`/api/users/${selectedUser.uid}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: actionType }),
            });

            if (!res.ok) throw new Error('Failed to take action');

            if (actionType === 'ban' || actionType === 'unban') {
                const isBanned = actionType === 'ban';
                setUsers(prev => prev.map(u =>
                    u.uid === selectedUser.uid ? { ...u, isBanned } : u
                ));
            } else if (actionType === 'warn') {
                alert('警告を送信しました（ログに記録されました）');
            }

            setIsActionOpen(false);
            setActionType(null);
            router.refresh();
        } catch (error) {
            console.error('Error taking action:', error);
            alert('アクションの実行に失敗しました');
        } finally {
            setProcessingId(null);
        }
    };

    const getActionTitle = () => {
        switch (actionType) {
            case 'warn': return '警告を送信';
            case 'ban': return 'アカウントを停止';
            case 'unban': return '停止を解除';
            default: return '';
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <Sidebar />
                <Header />

                <main className="ml-64 pt-16">
                    <div className="p-6">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ユーザー管理
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    アプリユーザーの検索・管理を行います
                                </p>
                            </div>
                            <Button variant="outline" size="icon" onClick={refreshData} disabled={loading}>
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        <Card className="p-6">
                            {/* 検索バー */}
                            <div className="mb-6 flex items-center gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="名前、メール、UIDで検索..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* ユーザーテーブル */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ユーザー</TableHead>
                                        <TableHead>ランク</TableHead>
                                        <TableHead>ログ数</TableHead>
                                        <TableHead>最終ログイン</TableHead>
                                        <TableHead>ステータス</TableHead>
                                        <TableHead className="text-right">アクション</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.uid}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-white">
                                                        {user.name ? user.name.charAt(0) : 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.name || 'No Name'}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{user.rank || '-'}</p>
                                                    <p className="text-xs text-gray-500">{user.organization || '-'}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">{user.totalLogs}</span>
                                            </TableCell>
                                            <TableCell className="text-sm">{user.lastLoginAt}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {user.isShopStaff && (
                                                        <Badge variant="secondary">ショップ</Badge>
                                                    )}
                                                    {user.isBanned && (
                                                        <Badge variant="destructive">停止中</Badge>
                                                    )}
                                                    {!user.isShopStaff && !user.isBanned && (
                                                        <Badge variant="outline">通常</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewDetail(user)}>
                                                            <User className="mr-2 h-4 w-4" />
                                                            詳細を見る
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleAction(user, 'warn')}>
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            警告を送信
                                                        </DropdownMenuItem>
                                                        {user.isBanned ? (
                                                            <DropdownMenuItem onClick={() => handleAction(user, 'unban')}>
                                                                <Shield className="mr-2 h-4 w-4" />
                                                                停止を解除
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                onClick={() => handleAction(user, 'ban')}
                                                                className="text-red-600"
                                                            >
                                                                <Ban className="mr-2 h-4 w-4" />
                                                                アカウント停止
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </main>

                {/* ユーザー詳細ダイアログ */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>ユーザー詳細</DialogTitle>
                        </DialogHeader>

                        {selectedUser && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-bold text-white">
                                        {selectedUser.name ? selectedUser.name.charAt(0) : 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedUser.name || 'No Name'}</h3>
                                        <p className="text-gray-500">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800 sm:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">ランク</p>
                                            <p className="font-medium">{selectedUser.rank} ({selectedUser.organization})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">ダイブログ数</p>
                                            <p className="font-medium">{selectedUser.totalLogs}本</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">登録日</p>
                                            <p className="font-medium">{selectedUser.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">最終ログイン</p>
                                            <p className="font-medium">{selectedUser.lastLoginAt}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-gray-500">
                                    UID: {selectedUser.uid}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* アクション確認ダイアログ */}
                <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {actionType === 'ban' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                                {getActionTitle()}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedUser?.name} に対してこのアクションを実行しますか？
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsActionOpen(false)} disabled={!!processingId}>
                                キャンセル
                            </Button>
                            <Button
                                variant={actionType === 'ban' ? 'destructive' : 'default'}
                                onClick={confirmAction}
                                disabled={!!processingId}
                            >
                                {processingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                確定
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthGuard>
    );
}
