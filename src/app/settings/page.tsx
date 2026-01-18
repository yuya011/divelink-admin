'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Settings,
    UserPlus,
    Shield,
    Clock,
    AlertTriangle,
    Power,
} from 'lucide-react';

// サンプルデータ
const sampleAdmins = [
    {
        uid: 'admin_001',
        email: 'super@divelink.jp',
        role: 'super_admin' as const,
        lastLoginAt: '2026-01-18 15:00',
        createdAt: '2024-01-01',
    },
    {
        uid: 'admin_002',
        email: 'admin@divelink.jp',
        role: 'admin' as const,
        lastLoginAt: '2026-01-17 10:00',
        createdAt: '2025-06-15',
    },
    {
        uid: 'admin_003',
        email: 'mod@divelink.jp',
        role: 'moderator' as const,
        lastLoginAt: '2026-01-18 09:00',
        createdAt: '2025-12-01',
    },
];

const sampleAuditLogs = [
    {
        id: '1',
        adminEmail: 'admin@divelink.jp',
        action: 'ショップ申請を承認',
        targetType: 'shop',
        targetId: 'shop_123',
        timestamp: '2026-01-18 15:30',
    },
    {
        id: '2',
        adminEmail: 'mod@divelink.jp',
        action: '報告を解決済みに変更',
        targetType: 'report',
        targetId: 'report_456',
        timestamp: '2026-01-18 14:00',
    },
    {
        id: '3',
        adminEmail: 'super@divelink.jp',
        action: '管理者を追加',
        targetType: 'system',
        targetId: 'admin_003',
        timestamp: '2026-01-17 10:00',
    },
];

export default function SettingsPage() {
    const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminRole, setNewAdminRole] = useState('moderator');
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    const getRoleBadge = (role: string) => {
        const styles: Record<string, string> = {
            super_admin: 'bg-purple-500/10 text-purple-600 border-purple-500',
            admin: 'bg-blue-500/10 text-blue-600 border-blue-500',
            moderator: 'bg-gray-500/10 text-gray-600 border-gray-500',
        };
        const labels: Record<string, string> = {
            super_admin: 'スーパー管理者',
            admin: '管理者',
            moderator: 'モデレーター',
        };
        return (
            <Badge variant="outline" className={styles[role]}>
                {labels[role]}
            </Badge>
        );
    };

    const handleAddAdmin = () => {
        // TODO: API呼び出し
        console.log('Adding admin:', newAdminEmail, newAdminRole);
        setIsAddAdminOpen(false);
        setNewAdminEmail('');
        setNewAdminRole('moderator');
    };

    const toggleMaintenanceMode = () => {
        setIsMaintenanceMode(!isMaintenanceMode);
        // TODO: API呼び出し
    };

    return (
        <AuthGuard requiredRole="admin">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <Sidebar />
                <Header />

                <main className="ml-64 pt-16">
                    <div className="p-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                システム設定
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                管理者アカウントとシステム設定を管理します
                            </p>
                        </div>

                        <Tabs defaultValue="admins">
                            <TabsList className="mb-6">
                                <TabsTrigger value="admins">管理者アカウント</TabsTrigger>
                                <TabsTrigger value="audit">監査ログ</TabsTrigger>
                                <TabsTrigger value="system">システム</TabsTrigger>
                            </TabsList>

                            {/* 管理者アカウント */}
                            <TabsContent value="admins">
                                <Card className="p-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Shield className="h-5 w-5" />
                                            管理者一覧
                                        </h3>
                                        <Button onClick={() => setIsAddAdminOpen(true)}>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            管理者を追加
                                        </Button>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>メールアドレス</TableHead>
                                                <TableHead>権限</TableHead>
                                                <TableHead>最終ログイン</TableHead>
                                                <TableHead>登録日</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sampleAdmins.map((admin) => (
                                                <TableRow key={admin.uid}>
                                                    <TableCell className="font-medium">{admin.email}</TableCell>
                                                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                                                    <TableCell className="text-sm">{admin.lastLoginAt}</TableCell>
                                                    <TableCell className="text-sm">{admin.createdAt}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </TabsContent>

                            {/* 監査ログ */}
                            <TabsContent value="audit">
                                <Card className="p-6">
                                    <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        操作履歴
                                    </h3>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>日時</TableHead>
                                                <TableHead>管理者</TableHead>
                                                <TableHead>アクション</TableHead>
                                                <TableHead>対象</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sampleAuditLogs.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="text-sm">{log.timestamp}</TableCell>
                                                    <TableCell className="text-sm">{log.adminEmail}</TableCell>
                                                    <TableCell>{log.action}</TableCell>
                                                    <TableCell className="text-xs text-gray-500">
                                                        {log.targetType}: {log.targetId}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </TabsContent>

                            {/* システム設定 */}
                            <TabsContent value="system">
                                <Card className="p-6">
                                    <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                                        <Settings className="h-5 w-5" />
                                        システム設定
                                    </h3>

                                    <div className="space-y-6">
                                        {/* メンテナンスモード */}
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center gap-3">
                                                {isMaintenanceMode ? (
                                                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                                                ) : (
                                                    <Power className="h-6 w-6 text-green-500" />
                                                )}
                                                <div>
                                                    <p className="font-medium">メンテナンスモード</p>
                                                    <p className="text-sm text-gray-500">
                                                        有効にするとアプリが一時停止状態になります
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant={isMaintenanceMode ? 'destructive' : 'outline'}
                                                onClick={toggleMaintenanceMode}
                                            >
                                                {isMaintenanceMode ? 'メンテナンス中' : '有効化'}
                                            </Button>
                                        </div>

                                        <Separator />

                                        {/* Firebase情報 */}
                                        <div>
                                            <h4 className="mb-3 font-medium">Firebase接続情報</h4>
                                            <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Project ID</p>
                                                        <p className="font-mono text-sm">divelink02</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">ステータス</p>
                                                        <Badge variant="outline" className="border-green-500 text-green-600">
                                                            接続中
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>

                {/* 管理者追加ダイアログ */}
                <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>管理者を追加</DialogTitle>
                            <DialogDescription>
                                新しい管理者アカウントを追加します
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={newAdminEmail}
                                    onChange={(e) => setNewAdminEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>権限レベル</Label>
                                <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="moderator">モデレーター</SelectItem>
                                        <SelectItem value="admin">管理者</SelectItem>
                                        <SelectItem value="super_admin">スーパー管理者</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                                キャンセル
                            </Button>
                            <Button onClick={handleAddAdmin} disabled={!newAdminEmail}>
                                追加
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthGuard>
    );
}
