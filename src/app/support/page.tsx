'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    HeadphonesIcon,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    Send,
    User,
} from 'lucide-react';

// サンプルデータ
const sampleTickets = [
    {
        id: '1',
        userId: 'user_001',
        userName: '山田太郎',
        userEmail: 'yamada@example.com',
        subject: 'ログが保存されない',
        message: 'ダイブログを保存しようとしても、エラーが発生して保存できません。再起動しても解決しませんでした。',
        status: 'open' as const,
        priority: 'high' as const,
        createdAt: '2026-01-18 16:00',
        messages: [
            { senderId: 'user_001', senderType: 'user', message: 'ダイブログを保存しようとしても、エラーが発生して保存できません。', timestamp: '2026-01-18 16:00' },
        ],
    },
    {
        id: '2',
        userId: 'user_002',
        userName: '佐藤花子',
        userEmail: 'sato@example.com',
        subject: 'プロフィール画像の変更方法',
        message: 'プロフィール画像を変更したいのですが、どこから変更できますか？',
        status: 'in_progress' as const,
        priority: 'low' as const,
        createdAt: '2026-01-18 14:30',
        messages: [
            { senderId: 'user_002', senderType: 'user', message: 'プロフィール画像を変更したいのですが、どこから変更できますか？', timestamp: '2026-01-18 14:30' },
            { senderId: 'admin_001', senderType: 'admin', message: 'プロフィール画面の編集ボタンから変更できます。', timestamp: '2026-01-18 15:00' },
        ],
    },
    {
        id: '3',
        userId: 'user_003',
        userName: '鈴木一郎',
        userEmail: 'suzuki@example.com',
        subject: '退会方法について',
        message: 'アカウントを退会したいのですが、手順を教えてください。',
        status: 'closed' as const,
        priority: 'medium' as const,
        createdAt: '2026-01-17 10:00',
        messages: [],
    },
];

export default function SupportPage() {
    const [selectedTab, setSelectedTab] = useState('open');
    const [selectedTicket, setSelectedTicket] = useState<typeof sampleTickets[0] | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');

    const filteredTickets = sampleTickets.filter((ticket) => {
        if (selectedTab === 'all') return true;
        return ticket.status === selectedTab;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge variant="outline" className="border-red-500 text-red-600"><AlertCircle className="mr-1 h-3 w-3" />未対応</Badge>;
            case 'in_progress':
                return <Badge variant="outline" className="border-blue-500 text-blue-600"><Clock className="mr-1 h-3 w-3" />対応中</Badge>;
            case 'closed':
                return <Badge variant="outline" className="border-green-500 text-green-600"><CheckCircle className="mr-1 h-3 w-3" />解決済み</Badge>;
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            high: 'bg-red-500',
            medium: 'bg-amber-500',
            low: 'bg-gray-400',
        };
        const labels: Record<string, string> = {
            high: '高',
            medium: '中',
            low: '低',
        };
        return (
            <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${colors[priority]}`}>
                {labels[priority]}
            </span>
        );
    };

    const handleViewDetail = (ticket: typeof sampleTickets[0]) => {
        setSelectedTicket(ticket);
        setIsDetailOpen(true);
    };

    const handleSendReply = () => {
        // TODO: API呼び出し
        console.log('Reply:', replyMessage, selectedTicket?.id);
        setReplyMessage('');
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
                                サポート
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                ユーザーからのお問い合わせを管理します
                            </p>
                        </div>

                        <Card className="p-6">
                            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                                <TabsList className="mb-6">
                                    <TabsTrigger value="open">
                                        未対応
                                        <Badge variant="destructive" className="ml-2">
                                            {sampleTickets.filter(t => t.status === 'open').length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="in_progress">対応中</TabsTrigger>
                                    <TabsTrigger value="closed">解決済み</TabsTrigger>
                                    <TabsTrigger value="all">すべて</TabsTrigger>
                                </TabsList>

                                <TabsContent value={selectedTab}>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>優先度</TableHead>
                                                <TableHead>件名</TableHead>
                                                <TableHead>ユーザー</TableHead>
                                                <TableHead>ステータス</TableHead>
                                                <TableHead>受信日時</TableHead>
                                                <TableHead className="text-right">アクション</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTickets.map((ticket) => (
                                                <TableRow key={ticket.id}>
                                                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                                    <TableCell>
                                                        <p className="font-medium">{ticket.subject}</p>
                                                        <p className="text-xs text-gray-500 line-clamp-1">{ticket.message}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <div>
                                                                <p className="text-sm">{ticket.userName}</p>
                                                                <p className="text-xs text-gray-500">{ticket.userEmail}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                                    <TableCell className="text-sm">{ticket.createdAt}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDetail(ticket)}
                                                        >
                                                            <MessageSquare className="mr-1 h-4 w-4" />
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

                {/* チケット詳細ダイアログ */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <HeadphonesIcon className="h-5 w-5" />
                                {selectedTicket?.subject}
                            </DialogTitle>
                        </DialogHeader>

                        {selectedTicket && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                                    <User className="h-8 w-8 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{selectedTicket.userName}</p>
                                        <p className="text-sm text-gray-500">{selectedTicket.userEmail}</p>
                                    </div>
                                    <div className="ml-auto flex gap-2">
                                        {getPriorityBadge(selectedTicket.priority)}
                                        {getStatusBadge(selectedTicket.status)}
                                    </div>
                                </div>

                                {/* メッセージ履歴 */}
                                <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border p-4">
                                    {selectedTicket.messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${msg.senderType === 'admin'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 dark:bg-gray-800'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.message}</p>
                                                <p className={`mt-1 text-xs ${msg.senderType === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {msg.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 返信フォーム */}
                                {selectedTicket.status !== 'closed' && (
                                    <div className="flex gap-2">
                                        <Textarea
                                            placeholder="返信を入力..."
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            rows={2}
                                            className="flex-1"
                                        />
                                        <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AuthGuard>
    );
}
