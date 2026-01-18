'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    LineChartCard,
    BarChartCard,
    MultiLineChartCard,
} from '@/components/dashboard/Charts';
import { StatCard } from '@/components/dashboard/StatCard';
import {
    Users,
    FileText,
    Award,
    MapPin,
    TrendingUp,
    Activity,
} from 'lucide-react';

// サンプルデータ
const userGrowthData = [
    { date: '12月', value: 2500, active: 1800 },
    { date: '1月', value: 2800, active: 2100 },
    { date: '2月', value: 3200, active: 2400 },
    { date: '3月', value: 3800, active: 2900 },
    { date: '4月', value: 4500, active: 3500 },
    { date: '5月', value: 5200, active: 4100 },
];

const logsData = [
    { date: '12月', value: 1200 },
    { date: '1月', value: 1450 },
    { date: '2月', value: 1680 },
    { date: '3月', value: 2100 },
    { date: '4月', value: 2800 },
    { date: '5月', value: 3200 },
];

const rankDistribution = [
    { date: 'OWD', value: 45 },
    { date: 'AOW', value: 28 },
    { date: 'RED', value: 12 },
    { date: 'MSD', value: 8 },
    { date: 'DM以上', value: 7 },
];

const regionData = [
    { date: '沖縄', value: 35 },
    { date: '伊豆', value: 25 },
    { date: '和歌山', value: 15 },
    { date: '石垣', value: 12 },
    { date: 'その他', value: 13 },
];

export default function AnalyticsPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <Sidebar />
                <Header />

                <main className="ml-64 pt-16">
                    <div className="p-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                統計・分析
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                アプリの詳細なデータ分析を確認できます
                            </p>
                        </div>

                        <Tabs defaultValue="users">
                            <TabsList className="mb-6">
                                <TabsTrigger value="users">ユーザー分析</TabsTrigger>
                                <TabsTrigger value="content">コンテンツ分析</TabsTrigger>
                                <TabsTrigger value="shops">ショップ分析</TabsTrigger>
                            </TabsList>

                            {/* ユーザー分析 */}
                            <TabsContent value="users" className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <StatCard
                                        title="登録ユーザー総数"
                                        value="5,234"
                                        icon={Users}
                                        trend={{ value: 15.2, isPositive: true }}
                                    />
                                    <StatCard
                                        title="アクティブ率"
                                        value="78.5%"
                                        icon={Activity}
                                        description="過去30日間"
                                        variant="success"
                                    />
                                    <StatCard
                                        title="平均ダイブ経験"
                                        value="45本"
                                        icon={TrendingUp}
                                    />
                                    <StatCard
                                        title="AI分析有効化率"
                                        value="62.3%"
                                        icon={Award}
                                        variant="warning"
                                    />
                                </div>

                                <div className="grid gap-6 lg:grid-cols-2">
                                    <MultiLineChartCard
                                        title="ユーザー成長推移"
                                        data={userGrowthData}
                                        lines={[
                                            { dataKey: 'value', color: '#3b82f6', name: '登録ユーザー' },
                                            { dataKey: 'active', color: '#10b981', name: 'アクティブ' },
                                        ]}
                                    />
                                    <BarChartCard
                                        title="ランク別分布"
                                        data={rankDistribution}
                                        color="#8b5cf6"
                                    />
                                </div>

                                <Card className="p-6">
                                    <h3 className="mb-4 text-lg font-semibold">所属団体別分布</h3>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4">
                                            <p className="text-2xl font-bold text-blue-600">52%</p>
                                            <p className="text-sm text-gray-600">PADI</p>
                                        </div>
                                        <div className="rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 p-4">
                                            <p className="text-2xl font-bold text-green-600">28%</p>
                                            <p className="text-sm text-gray-600">SSI</p>
                                        </div>
                                        <div className="rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4">
                                            <p className="text-2xl font-bold text-purple-600">12%</p>
                                            <p className="text-sm text-gray-600">NAUI</p>
                                        </div>
                                        <div className="rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-4">
                                            <p className="text-2xl font-bold text-amber-600">8%</p>
                                            <p className="text-sm text-gray-600">その他</p>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* コンテンツ分析 */}
                            <TabsContent value="content" className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <StatCard
                                        title="ダイブログ総数"
                                        value="28,456"
                                        icon={FileText}
                                        trend={{ value: 22.1, isPositive: true }}
                                    />
                                    <StatCard
                                        title="今月のログ"
                                        value="3,245"
                                        icon={TrendingUp}
                                        variant="success"
                                    />
                                    <StatCard
                                        title="平均ダイブ深度"
                                        value="18.5m"
                                        icon={Activity}
                                    />
                                    <StatCard
                                        title="平均ダイブ時間"
                                        value="42分"
                                        icon={Activity}
                                    />
                                </div>

                                <div className="grid gap-6 lg:grid-cols-2">
                                    <LineChartCard
                                        title="ログ投稿数推移（月別）"
                                        data={logsData}
                                        color="#10b981"
                                    />
                                    <BarChartCard
                                        title="地域別ダイブ数"
                                        data={regionData}
                                        color="#f59e0b"
                                    />
                                </div>

                                <Card className="p-6">
                                    <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        人気ポイントランキング
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: '慶良間諸島', logs: 2456, region: '沖縄' },
                                            { name: '石垣島マンタポイント', logs: 1823, region: '石垣' },
                                            { name: '大瀬崎', logs: 1567, region: '伊豆' },
                                            { name: '串本', logs: 1234, region: '和歌山' },
                                            { name: '田子', logs: 987, region: '伊豆' },
                                        ].map((point, i) => (
                                            <div
                                                key={point.name}
                                                className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white">
                                                        {i + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium">{point.name}</p>
                                                        <p className="text-xs text-gray-500">{point.region}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-600">
                                                    {point.logs.toLocaleString()} ログ
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* ショップ分析 */}
                            <TabsContent value="shops" className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <StatCard
                                        title="登録ショップ数"
                                        value="42"
                                        icon={MapPin}
                                        trend={{ value: 8.5, isPositive: true }}
                                    />
                                    <StatCard
                                        title="今月の新規登録"
                                        value="5"
                                        icon={TrendingUp}
                                        variant="success"
                                    />
                                    <StatCard
                                        title="平均投稿数/ショップ"
                                        value="156"
                                        icon={FileText}
                                    />
                                </div>

                                <BarChartCard
                                    title="地域別ショップ数"
                                    data={[
                                        { date: '沖縄本島', value: 15 },
                                        { date: '石垣・宮古', value: 8 },
                                        { date: '伊豆半島', value: 10 },
                                        { date: '和歌山', value: 5 },
                                        { date: 'その他', value: 4 },
                                    ]}
                                    color="#8b5cf6"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
