'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { MessageSquare, User, Clock, Send, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export interface Ticket {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    status: 'open' | 'replied' | 'closed';
    priority: 'low' | 'medium' | 'high';
    category: string;
    createdAt: string;
    lastReplyAt?: string;
    content: string; // 最初のメッセージ
    replies?: {
        content: string;
        createdAt: string;
        isAdmin: boolean;
    }[];
}

interface SupportClientProps {
    initialTickets: Ticket[];
}

export default function SupportClient({ initialTickets }: SupportClientProps) {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('open');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const refreshData = () => {
        setLoading(true);
        router.refresh();
        setTimeout(() => setLoading(false), 1000);
    };

    const filteredTickets = tickets.filter((ticket) => {
        if (selectedTab === 'all') return true;
        return ticket.status === selectedTab;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge variant="outline" className="border-green-500 text-green-600"><AlertCircle className="mr-1 h-3 w-3" />未対応</Badge>;
            case 'replied':
                return <Badge variant="outline" className="border-blue-500 text-blue-600"><MessageSquare className="mr-1 h-3 w-3" />返信済み</Badge>;
            case 'closed':
                return <Badge variant="outline" className="border-gray-500 text-gray-600"><CheckCircle className="mr-1 h-3 w-3" />解決済み</Badge>;
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <Badge variant="destructive">高</Badge>;
            case 'medium':
                return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">中</Badge>;
            case 'low':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">低</Badge>;
            default:
                return <Badge variant="secondary">{priority}</Badge>;
        }
    };

    const handleViewDetail = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsDetailOpen(true);
        // 返信履歴がある場合はスクロール最下部へ（実装省略）
    };

    const handleReply = async () => {
        if (!selectedTicket || !replyContent.trim()) return;
        setProcessingId(selectedTicket.id);

        try {
            const res = await fetch(`/api/support/${selectedTicket.id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reply: replyContent }),
            });

            if (!res.ok) throw new Error('Failed to reply');

            // ローカルステート更新（簡易的な追加）
            const newReply = {
                content: replyContent,
                createdAt: new Date().toISOString(),
                isAdmin: true,
            };

            setTickets(prev => prev.map(t =>
                t.id === selectedTicket.id ? {
                    ...t,
                    status: 'replied',
                    replies: [...(t.replies || []), newReply]
                } : t
            ));

            // ダイアログ内の選択中チケットも更新
            setSelectedTicket(prev => prev ? {
                ...prev,
                status: 'replied',
                replies: [...(prev.replies || []), newReply]
            } : null);

            setReplyContent('');
            router.refresh();
        } catch (error) {
            console.error('Error replying:', error);
            alert('返信に失敗しました');
        } finally {
            setProcessingId(null);
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
                                    カスタマーサポート
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    ユーザーからのお問い合わせに対応します
                                </p>
                            </div>
                            <Button variant="outline" size="icon" onClick={refreshData} disabled={loading}>
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        <Card className="p-6">
                            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                                <TabsList className="mb-6">
                                    <TabsTrigger value="open">
                                        未対応
                                        <Badge variant="destructive" className="ml-2">
                                            {tickets.filter(t => t.status === 'open').length}
                                        </Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="replied">返信済み</TabsTrigger>
                                    <TabsTrigger value="closed">完了</TabsTrigger>
                                    <TabsTrigger value="all">すべて</TabsTrigger>
                                </TabsList>

                                <TabsContent value={selectedTab}>
                                    {filteredTickets.length === 0 ? (
                                        <div className="flex h-40 items-center justify-center text-gray-500">
                                            データがありません
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>件名</TableHead>
                                                    <TableHead>送信者</TableHead>
                                                    <TableHead>カテゴリー</TableHead>
                                                    <TableHead>優先度</TableHead>
                                                    <TableHead>最終更新</TableHead>
                                                    <TableHead>ステータス</TableHead>
                                                    <TableHead className="text-right">アクション</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredTickets.map((ticket) => (
                                                    <TableRow key={ticket.id}>
                                                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p className="text-sm">{ticket.userName}</p>
                                                                <p className="text-xs text-gray-500">{ticket.userEmail}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell><Badge variant="outline">{ticket.category}</Badge></TableCell>
                                                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                                        <TableCell className="text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3 text-gray-400" />
                                                                {ticket.lastReplyAt || ticket.createdAt}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
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
                                    )}
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>
                </main>

                {/* 詳細・返信ダイアログ */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {selectedTicket?.subject}
                                {selectedTicket && getStatusBadge(selectedTicket.status)}
                            </DialogTitle>
                            <DialogDescription>
                                お問い合わせ詳細と返信
                            </DialogDescription>
                        </DialogHeader>

                        {selectedTicket && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{selectedTicket.userName}</p>
                                            <p className="text-xs text-gray-500">{selectedTicket.userEmail}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-gray-500">
                                        <p>{selectedTicket.createdAt}</p>
                                        <p>ID: {selectedTicket.id}</p>
                                    </div>
                                </div>

                                <div className="h-[300px] overflow-y-auto rounded-md border p-4">
                                    <div className="space-y-4">
                                        {/* 最初の質問 */}
                                        <div className="flex gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                                                {selectedTicket.content}
                                            </div>
                                        </div>

                                        {/* 返信履歴 */}
                                        {selectedTicket.replies?.map((reply, i) => (
                                            <div key={i} className={`flex gap-3 ${reply.isAdmin ? 'flex-row-reverse' : ''}`}>
                                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${reply.isAdmin ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}`}>
                                                    {reply.isAdmin ? <MessageSquare className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                </div>
                                                <div className={`rounded-lg p-3 text-sm ${reply.isAdmin ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                                    {reply.content}
                                                    <p className="mt-1 text-xs opacity-70">{reply.createdAt}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 border-t pt-4">
                                    <Label>返信を作成</Label>
                                    <Textarea
                                        placeholder="返信内容を入力してください..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                                            閉じる
                                        </Button>
                                        <Button onClick={handleReply} disabled={!replyContent.trim() || !!processingId}>
                                            {processingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                            送信
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AuthGuard>
    );
}
