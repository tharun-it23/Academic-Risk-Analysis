"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface RiskDistributionWidgetProps {
    stats: {
        highRisk: number;
        mediumRisk: number;
        lowRisk: number;
        [key: string]: any;
    } | null;
}

const RiskDistributionWidget = ({ stats }: RiskDistributionWidgetProps) => {
    if (!stats) {
        return (
            <div className="rounded-2xl p-6 flex items-center justify-center min-h-[320px]"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <p className="text-sm text-slate-400">Loading chart data...</p>
            </div>
        );
    }

    const data = [
        { name: 'High Risk',   value: stats.highRisk   || 0, color: '#ef4444', gradient: ['#ef4444', '#dc2626'], glow: 'rgba(239,68,68,0.3)' },
        { name: 'Medium Risk', value: stats.mediumRisk || 0, color: '#f59e0b', gradient: ['#f59e0b', '#d97706'], glow: 'rgba(245,158,11,0.3)' },
        { name: 'Low Risk',    value: stats.lowRisk    || 0, color: '#10b981', gradient: ['#10b981', '#059669'], glow: 'rgba(16,185,129,0.3)' },
    ];

    const total = data.reduce((s, d) => s + d.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload?.length) {
            const item = payload[0];
            return (
                <div className="rounded-xl px-4 py-2.5 text-sm shadow-xl"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{item.name}</p>
                    <p className="text-slate-400">{item.value} students &bull; {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="rounded-2xl overflow-hidden h-full"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <AlertTriangle size={15} className="text-red-500" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Risk Distribution</h3>
                    <p className="text-xs text-slate-400">{total} students total</p>
                </div>
            </div>

            <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                {/* Chart */}
                <div className="w-full md:w-1/2 h-[200px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={3}
                                strokeWidth={0}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="w-full md:w-1/2 space-y-3">
                    {data.map((item, idx) => {
                        const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                        return (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                                        <span className="text-xs text-slate-400 ml-1">({pct}%)</span>
                                    </div>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${item.color}18` }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${pct}%`, background: item.color }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RiskDistributionWidget;
