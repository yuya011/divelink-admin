'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Bell,
    Send,
    Clock,
    CheckCircle,
    Users,
    Calendar,
} from 'lucide-react';

// サンプルデータ
const notificationHistory = [
    {
        id: '1',
        title: '新機能リリースのお知らせ',
        body: 'AIダイブ分析機能がリリースされました！',
        target: 'all',
        status: 'sent',
        sentAt: '2026-01-18 12:00',
        recipientCount: 5234,
        openRate: 45.2,
    },
    {
        id: '2',
        title: 'メンテナンスのお知らせ',
        body: '1月20日 AM2:00〜AM4:00 メンテナンス予定',
        target: 'all',
        status: 'scheduled',
        scheduledAt: '2026-01-19 18:00',
    },
    {
        id: '3',
        title: '沖縄エリアイベント',
        body: '沖縄で開催されるダイビングイベントのご案内',
        target: 'segment',
        status: 'sent',
        sentAt: '2026-01-15 10:00',
        recipientCount: 1823,
        openRate: 52.1,
    },
];

export default function NotificationsPage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [target, setTarget] = useState('all');
    const [scheduleType, setScheduleType] = useState('now');
    const [scheduledAt, setScheduledAt] = useState('');

    const handleSend = () => {
        // TODO: API呼び出し
        console.log({ title, body, target, scheduleType, scheduledAt });
    };

    const handleSaveDraft = () => {
        // TODO: 下書き保存
        console.log('Saving draft...');
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
                                通知配信
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                プッシュ通知とアプリ内お知らせを管理します
                            </p>
                        </div>

                        <Tabs defaultValue="create">
                            <TabsList className="mb-6">
                                <TabsTrigger value="create">新規作成</TabsTrigger>
                                <TabsTrigger value="history">配信履歴</TabsTrigger>
                            </TabsList>

                            {/* 新規作成 */}
                            <TabsContent value="create">
                                <Card className="p-6">
                                    <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        新しい通知を作成
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">タイトル</Label>
                                            <Input
                                                id="title"
                                                placeholder="通知のタイトルを入力"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="body">本文</Label>
                                            <Textarea
                                                id="body"
                                                placeholder="通知の本文を入力"
                                                value={body}
                                                onChange={(e) => setBody(e.target.value)}
                                                rows={4}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>対象</Label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="target"
                                                        checked={target === 'all'}
                                                        onChange={() => setTarget('all')}
                                                        className="h-4 w-4"
                                                    />
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        全員
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="target"
                                                        checked={target === 'segment'}
                                                        onChange={() => setTarget('segment')}
                                                        className="h-4 w-4"
                                                    />
                                                    セグメント指定
                                                </label>
                                            </div>
                                        </div>

                                        {target === 'segment' && (
                                            <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                                                <p className="mb-3 text-sm font-medium">セグメント条件</p>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label>ランク</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="選択..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="owd">OWD</SelectItem>
                                                                <SelectItem value="aow">AOW</SelectItem>
                                                                <SelectItem value="red">RED</SelectItem>
                                                                <SelectItem value="dm">DM以上</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>地域</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="選択..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="okinawa">沖縄</SelectItem>
                                                                <SelectItem value="izu">伊豆</SelectItem>
                                                                <SelectItem value="wakayama">和歌山</SelectItem>
                                                                <SelectItem value="ishigaki">石垣島</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>配信日時</Label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="schedule"
                                                        checked={scheduleType === 'now'}
                                                        onChange={() => setScheduleType('now')}
                                                        className="h-4 w-4"
                                                    />
                                                    即時配信
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="schedule"
                                                        checked={scheduleType === 'scheduled'}
                                                        onChange={() => setScheduleType('scheduled')}
                                                        className="h-4 w-4"
                                                    />
                                                    スケジュール
                                                </label>
                                            </div>
                                        </div>

                                        {scheduleType === 'scheduled' && (
                                            <div className="space-y-2">
                                                <Label htmlFor="scheduledAt">配信日時</Label>
                                                <Input
                                                    id="scheduledAt"
                                                    type="datetime-local"
                                                    value={scheduledAt}
                                                    onChange={(e) => setScheduledAt(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <div className="flex gap-3 pt-4">
                                            <Button variant="outline" onClick={handleSaveDraft}>
                                                下書き保存
                                            </Button>
                                            <Button onClick={handleSend} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                                                <Send className="mr-2 h-4 w-4" />
                                                {scheduleType === 'now' ? '送信' : 'スケジュール設定'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* 配信履歴 */}
                            <TabsContent value="history">
                                <Card className="p-6">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>タイトル</TableHead>
                                                <TableHead>対象</TableHead>
                                                <TableHead>ステータス</TableHead>
                                                <TableHead>配信日時</TableHead>
                                                <TableHead>開封率</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {notificationHistory.map((notif) => (
                                                <TableRow key={notif.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{notif.title}</p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">{notif.body}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={notif.target === 'all' ? 'default' : 'secondary'}>
                                                            {notif.target === 'all' ? '全員' : 'セグメント'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {notif.status === 'sent' ? (
                                                            <Badge variant="outline" className="border-green-500 text-green-600">
                                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                                送信済み
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="border-blue-500 text-blue-600">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                予約済み
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {notif.sentAt || notif.scheduledAt}
                                                    </TableCell>
                                                    <TableCell>
                                                        {notif.openRate ? (
                                                            <span className="font-medium">{notif.openRate}%</span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
