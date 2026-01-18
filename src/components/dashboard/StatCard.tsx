import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: 'default' | 'warning' | 'success' | 'danger';
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    variant = 'default',
}: StatCardProps) {
    const variantStyles = {
        default: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
        warning: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
        success: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
        danger: 'from-red-500/10 to-pink-500/10 border-red-500/20',
    };

    const iconStyles = {
        default: 'bg-blue-500/10 text-blue-600',
        warning: 'bg-amber-500/10 text-amber-600',
        success: 'bg-green-500/10 text-green-600',
        danger: 'bg-red-500/10 text-red-600',
    };

    return (
        <Card
            className={cn(
                'relative overflow-hidden border bg-gradient-to-br p-6',
                variantStyles[variant]
            )}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                    )}
                    {trend && (
                        <p
                            className={cn(
                                'text-xs font-medium',
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            )}
                        >
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            <span className="ml-1 text-gray-500">前週比</span>
                        </p>
                    )}
                </div>
                <div className={cn('rounded-xl p-3', iconStyles[variant])}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </Card>
    );
}
