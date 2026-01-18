'use client';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';

interface ChartDataPoint {
    date: string;
    value: number;
    [key: string]: string | number;
}

interface LineChartCardProps {
    title: string;
    data: ChartDataPoint[];
    dataKey?: string;
    color?: string;
}

export function LineChartCard({
    title,
    data,
    dataKey = 'value',
    color = '#3b82f6',
}: LineChartCardProps) {
    return (
        <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

interface BarChartCardProps {
    title: string;
    data: ChartDataPoint[];
    dataKey?: string;
    color?: string;
}

export function BarChartCard({
    title,
    data,
    dataKey = 'value',
    color = '#06b6d4',
}: BarChartCardProps) {
    return (
        <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

interface MultiLineChartCardProps {
    title: string;
    data: ChartDataPoint[];
    lines: { dataKey: string; color: string; name: string }[];
}

export function MultiLineChartCard({ title, data, lines }: MultiLineChartCardProps) {
    return (
        <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        {lines.map((line) => (
                            <Line
                                key={line.dataKey}
                                type="monotone"
                                dataKey={line.dataKey}
                                stroke={line.color}
                                strokeWidth={2}
                                name={line.name}
                                dot={{ fill: line.color, strokeWidth: 2, r: 3 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
