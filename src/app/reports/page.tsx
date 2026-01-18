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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    AlertTriangle,
    User,
    MessageSquare,
    Ban,
    Trash2,
    CheckCircle,
    XCircle,
    Eye,
} from 'lucide-react';

// サンプルデータ
const sampleReports = [
    {
        id: '1',
        reporterId: 'user_001',
        reporterName: '山田太郎',
        reportedUserId: 'user_100',
        reportedUserName: '迷惑ユーザー',
        reason: 'spam' as const,
        details: 'プロフィールに外部サイトへの誘導リンクを貼っています。',
        status: 'pending' as const,
        createdAt: '2026-01-18 15:30',
    },
    {
        id: '2',
        reporterId: 'user_002',
        reporterName: '鈴木花子',
        reportedUserId: 'user_101',
        reportedUserName: '偽アカウント',
        reason: 'impersonation' as const,
        details: '有名ダイバーのなりすましアカウントです。',
        status: 'pending' as const,
        createdAt: '2026-01-18 14:00',
    },
    {
        id: '3',
        reporterId: 'user_003',
        reporterName: '佐藤一郎',
        reportedUserId: 'user_102',
        reportedUserName: '問題ユーザー',
        reportedPostId: 'post_999',
        reason: 'harassment' as const,
        details: 'コメント欄で不適切な発言を繰り返しています。',
        status: 'reviewed' as const,
        action: 'warning',
        createdAt: '2026-01-17 10:00',
    },
];

const reasonLabels: Record<string, string> = {
    spam: 'スパム/不適切コンテンツ',
    impersonation: 'なりすまし',
    harassment: 'ハラスメント',
    other: 'その他',
};

const actionLabels: Record<string, string> = {
    warning: '警告を送信',
    delete_content: 'コンテンツ削除',
    ban_user: 'アカウント停止',
    dismissed: '却下',
};

export default function ReportsPage() {
    const [selectedTab, setSelectedTab] = useState('pending');
    const [selectedReport, setSelectedReport] = useState<typeof sampleReports[0] | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');
    const [actionNote, setActionNote] = useState('');

    const filteredReports = sampleReports.filter((report) => {
        if (selectedTab === 'all') return true;
        return report.status === selectedTab;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="border-amber-500 text-amber-600"><AlertTriangle className="mr-1 h-3 w-3" />未対応</Badge>;
            case 'reviewed':
                return <Badge variant="outline" className="border-blue-500 text-blue-600"><Eye className="mr-1 h-3 w-3" />確認済み</Badge>;
            case 'resolved':
                return <Badge variant="outline" className="border-green-500 text-green-600"><CheckCircle className="mr-1 h-3 w-3" />解決済み</Badge>;
            default:
                return null;
        }
    };

    const getReasonBadge = (reason: string) => {
        const colors: Record<string, string> = {
            spam: 'bg-orange-500/10 text-orange-600',
            impersonation: 'bg-purple-500/10 text-purple-600',
            harassment: 'bg-red-500/10 text-red-600',
            other: 'bg-gray-500/10 text-gray-600',
        };
        return (
            <Badge className={colors[reason] || colors.other}>
                {reasonLabels[reason] || reason}
            </Badge>
        );
    };

    const handleViewDetail = (report: typeof sampleReports[0]) => {
        setSelectedReport(report);
        setIsDetailOpen(true);
    };

    const handleTakeAction = () => {
        setIsDetailOpen(false);
        setIsActionOpen(true);
    };

    const confirmAction = () => {
        // TODO: API呼び出し
        console.log('Action:', selectedAction, actionNote, selectedReport?.id);
        setIsActionOpen(false);
        setSelectedAction('');
        setActionNote('');
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
                                報告対応
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                ユーザーからの問題報告を確認し、対応を行います
                            </p>
                        </div>

                        <Card className="p-6">
                            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                                <TabsList className="mb-6">
                                    <TabsTrigger value="pending">
                                        未対応
                                        <Badge variant="destructive" className="ml-2">
                                            {sampleReports.filter(r => r.status === 'pending').length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="reviewed">確認済み</TabsTrigger>
                                    <TabsTrigger value="resolved">解決済み</TabsTrigger>
                                    <TabsTrigger value="all">すべて</TabsTrigger>
                                </TabsList>

                                <TabsContent value={selectedTab}>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>報告対象</TableHead>
                                                <TableHead>報告者</TableHead>
                                                <TableHead>理由</TableHead>
                                                <TableHead>報告日時</TableHead>
                                                <TableHead>ステータス</TableHead>
                                                <TableHead className="text-right">アクション</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredReports.map((report) => (
                                                <TableRow key={report.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <div>
                                                                <p className="font-medium">{report.reportedUserName}</p>
                                                                {report.reportedPostId && (
                                                                    <p className="text-xs text-gray-500">投稿ID: {report.reportedPostId}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm">{report.reporterName}</p>
                                                    </TableCell>
                                                    <TableCell>{getReasonBadge(report.reason)}</TableCell>
                                                    <TableCell className="text-sm">{report.createdAt}</TableCell>
                                                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDetail(report)}
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
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                報告詳細
                            </DialogTitle>
                        </DialogHeader>

                        {selectedReport && (
                            <div className="space-y-4">
                                <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                                    <Label className="text-xs text-gray-500">報告対象ユーザー</Label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <span className="font-medium">{selectedReport.reportedUserName}</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-gray-500">報告理由</Label>
                                    <div className="mt-1">{getReasonBadge(selectedReport.reason)}</div>
                                </div>
                                <div>
                                    <Label className="text-gray-500">詳細</Label>
                                    <p className="mt-1 text-sm">{selectedReport.details}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-gray-500">報告者</Label>
                                        <p className="text-sm font-medium">{selectedReport.reporterName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-500">報告日時</Label>
                                        <p className="text-sm">{selectedReport.createdAt}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedReport?.status === 'pending' && (
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                                    閉じる
                                </Button>
                                <Button onClick={handleTakeAction}>
                                    対応する
                                </Button>
                            </DialogFooter>
                        )}
                    </DialogContent>
                </Dialog>

                {/* 対応アクションダイアログ */}
                <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>対応アクションの選択</DialogTitle>
                            <DialogDescription>
                                この報告に対する対応を選択してください
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>アクション</Label>
                                <Select value={selectedAction} onValueChange={setSelectedAction}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="アクションを選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="warning">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4" />
                                                警告を送信
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="delete_content">
                                            <div className="flex items-center gap-2">
                                                <Trash2 className="h-4 w-4" />
                                                コンテンツを削除
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="ban_user">
                                            <div className="flex items-center gap-2">
                                                <Ban className="h-4 w-4" />
                                                アカウントを停止
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dismissed">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-4 w-4" />
                                                報告を却下
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>メモ（任意）</Label>
                                <Textarea
                                    placeholder="対応に関するメモを入力..."
                                    value={actionNote}
                                    onChange={(e) => setActionNote(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsActionOpen(false)}>
                                キャンセル
                            </Button>
                            <Button onClick={confirmAction} disabled={!selectedAction}>
                                確定
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthGuard>
    );
}
