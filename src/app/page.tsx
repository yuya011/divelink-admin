'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { StatCard } from '@/components/dashboard/StatCard';
import { LineChartCard, BarChartCard } from '@/components/dashboard/Charts';
import {
  Users,
  FileText,
  Store,
  AlertTriangle,
  HeadphonesIcon,
  UserPlus,
} from 'lucide-react';

// サンプルデータ（実際のデータはAPIから取得）
const userGrowthData = [
  { date: '1/1', value: 150 },
  { date: '1/2', value: 180 },
  { date: '1/3', value: 210 },
  { date: '1/4', value: 195 },
  { date: '1/5', value: 240 },
  { date: '1/6', value: 280 },
  { date: '1/7', value: 310 },
];

const logsData = [
  { date: '1/1', value: 45 },
  { date: '1/2', value: 52 },
  { date: '1/3', value: 61 },
  { date: '1/4', value: 38 },
  { date: '1/5', value: 72 },
  { date: '1/6', value: 89 },
  { date: '1/7', value: 95 },
];

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <Header />

        <main className="ml-64 pt-16">
          <div className="p-6">
            {/* ページヘッダー */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ダッシュボード
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                DiveLinkアプリの概要を確認できます
              </p>
            </div>

            {/* 統計カード */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <StatCard
                title="アクティブユーザー（今日）"
                value="1,234"
                icon={Users}
                trend={{ value: 12.5, isPositive: true }}
              />
              <StatCard
                title="新規登録（7日間）"
                value="89"
                icon={UserPlus}
                trend={{ value: 8.3, isPositive: true }}
                variant="success"
              />
              <StatCard
                title="ダイブログ投稿（今日）"
                value="156"
                icon={FileText}
                description="月間: 4,521件"
              />
              <StatCard
                title="登録ショップ"
                value="42"
                icon={Store}
                description="承認待ち: 3件"
                variant="warning"
              />
              <StatCard
                title="未対応報告"
                value="5"
                icon={AlertTriangle}
                variant="danger"
              />
              <StatCard
                title="未対応サポート"
                value="12"
                icon={HeadphonesIcon}
                description="高優先度: 2件"
                variant="warning"
              />
            </div>

            {/* チャート */}
            <div className="grid gap-6 lg:grid-cols-2">
              <LineChartCard
                title="ユーザー成長（日別）"
                data={userGrowthData}
                color="#3b82f6"
              />
              <BarChartCard
                title="ログ投稿数（日別）"
                data={logsData}
                color="#06b6d4"
              />
            </div>

            {/* クイックアクション */}
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                要対応項目
              </h3>
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  <ActionItem
                    title="ショップ申請の承認待ち"
                    count={3}
                    href="/shops?status=pending"
                    variant="warning"
                  />
                  <ActionItem
                    title="未対応のユーザー報告"
                    count={5}
                    href="/reports?status=pending"
                    variant="danger"
                  />
                  <ActionItem
                    title="未対応のサポートチケット"
                    count={12}
                    href="/support?status=open"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

function ActionItem({
  title,
  count,
  href,
  variant = 'default',
}: {
  title: string;
  count: number;
  href: string;
  variant?: 'default' | 'warning' | 'danger';
}) {
  const variantStyles = {
    default: 'bg-blue-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };

  return (
    <a
      href={href}
      className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </span>
      <span
        className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold text-white ${variantStyles[variant]}`}
      >
        {count}
      </span>
    </a>
  );
}
