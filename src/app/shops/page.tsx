'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, Check, X, Eye, MapPin, Building2 } from 'lucide-react';

// サンプルデータ
const sampleApplications = [
    {
        id: '1',
        userId: 'user_123',
        userName: '田中太郎',
        userEmail: 'tanaka@example.com',
        shopName: 'ダイビングショップ サンシャイン',
        address: '沖縄県那覇市牧志1-2-3',
        region: '沖縄',
        description: '沖縄本島でのダイビングツアーを提供しています。初心者から上級者まで対応。',
        status: 'pending' as const,
        createdAt: '2026-01-18',
    },
    {
        id: '2',
        userId: 'user_456',
        userName: '佐藤花子',
        userEmail: 'sato@example.com',
        shopName: 'ブルーダイブ伊豆',
        address: '静岡県伊東市宇佐美1-2-3',
        region: '伊豆',
        description: '伊豆半島でのダイビングスクールとファンダイブを運営。',
        status: 'pending' as const,
        createdAt: '2026-01-17',
    },
    {
        id: '3',
        userId: 'user_789',
        userName: '鈴木一郎',
        userEmail: 'suzuki@example.com',
        shopName: 'マリンハウス石垣',
        address: '沖縄県石垣市美崎町1-2-3',
        region: '石垣島',
        description: '石垣島でのマンタポイントへのダイビングツアーが人気。',
        status: 'approved' as const,
        createdAt: '2026-01-15',
    },
];

export default function ShopsPage() {
    const [selectedTab, setSelectedTab] = useState('pending');
    const [selectedApplication, setSelectedApplication] = useState<typeof sampleApplications[0] | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const filteredApplications = sampleApplications.filter((app) => {
        if (selectedTab === 'all') return true;
        return app.status === selectedTab;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="border-amber-500 text-amber-600"><Clock className="mr-1 h-3 w-3" />保留中</Badge>;
            case 'approved':
                return <Badge variant="outline" className="border-green-500 text-green-600"><Check className="mr-1 h-3 w-3" />承認済み</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="border-red-500 text-red-600"><X className="mr-1 h-3 w-3" />却下</Badge>;
            default:
                return null;
        }
    };

    const handleViewDetail = (application: typeof sampleApplications[0]) => {
        setSelectedApplication(application);
        setIsDetailOpen(true);
    };

    const handleApprove = () => {
        // TODO: API呼び出し
        console.log('Approving:', selectedApplication?.id);
        setIsDetailOpen(false);
    };

    const handleReject = () => {
        setIsDetailOpen(false);
        setIsRejectOpen(true);
    };

    const confirmReject = () => {
        // TODO: API呼び出し
        console.log('Rejecting:', selectedApplication?.id, rejectReason);
        setIsRejectOpen(false);
        setRejectReason('');
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <Sidebar />
                <Header />

                <main className="ml-64 pt-16">
                    <div className="p-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                ショップ管理
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                ショップ登録申請の確認と承認を行います
                            </p>
                        </div>

                        <Card className="p-6">
                            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                                <TabsList className="mb-6">
                                    <TabsTrigger value="pending">
                                        保留中
                                        <Badge variant="secondary" className="ml-2">
                                            {sampleApplications.filter(a => a.status === 'pending').length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="approved">承認済み</TabsTrigger>
                                    <TabsTrigger value="rejected">却下</TabsTrigger>
                                    <TabsTrigger value="all">すべて</TabsTrigger>
                                </TabsList>

                                <TabsContent value={selectedTab}>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ショップ名</TableHead>
                                                <TableHead>申請者</TableHead>
                                                <TableHead>地域</TableHead>
                                                <TableHead>申請日</TableHead>
                                                <TableHead>ステータス</TableHead>
                                                <TableHead className="text-right">アクション</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredApplications.map((app) => (
                                                <TableRow key={app.id}>
                                                    <TableCell className="font-medium">{app.shopName}</TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="text-sm">{app.userName}</p>
                                                            <p className="text-xs text-gray-500">{app.userEmail}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            {app.region}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{app.createdAt}</TableCell>
                                                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDetail(app)}
                                                        >
                                                            <Eye className="mr-1 h-4 w-4" />
                                                            詳細
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>
                </main>

                {/* 詳細ダイアログ */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                {selectedApplication?.shopName}
                            </DialogTitle>
                            <DialogDescription>
                                ショップ登録申請の詳細
                            </DialogDescription>
                        </DialogHeader>

                        {selectedApplication && (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-500">申請者</Label>
                                    <p className="font-medium">{selectedApplication.userName}</p>
                                    <p className="text-sm text-gray-500">{selectedApplication.userEmail}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">住所</Label>
                                    <p className="font-medium">{selectedApplication.address}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">地域</Label>
                                    <p className="font-medium">{selectedApplication.region}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">説明</Label>
                                    <p className="text-sm">{selectedApplication.description}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-500">申請日</Label>
                                    <p className="font-medium">{selectedApplication.createdAt}</p>
                                </div>
                            </div>
                        )}

                        {selectedApplication?.status === 'pending' && (
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={handleReject}>
                                    <X className="mr-1 h-4 w-4" />
                                    却下
                                </Button>
                                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                                    <Check className="mr-1 h-4 w-4" />
                                    承認
                                </Button>
                            </DialogFooter>
                        )}
                    </DialogContent>
                </Dialog>

                {/* 却下理由ダイアログ */}
                <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>申請を却下</DialogTitle>
                            <DialogDescription>
                                却下理由を入力してください。申請者に通知されます。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="却下理由を入力..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
                                キャンセル
                            </Button>
                            <Button variant="destructive" onClick={confirmReject}>
                                却下を確定
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthGuard>
    );
}
