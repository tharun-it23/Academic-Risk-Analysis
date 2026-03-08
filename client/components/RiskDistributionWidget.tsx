"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from "@heroui/react";

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
        // Fallback/Loading state
        return (
            <Card className="min-h-[300px] h-full">
                <Card.Header>
                    <h3 className="text-lg font-bold">Risk Distribution</h3>
                </Card.Header>
                <Card.Content className="flex items-center justify-center">
                    <p className="text-slate-400">Loading chart data...</p>
                </Card.Content>
            </Card>
        );
    }

    const data = [
        { name: 'High Risk', value: stats.highRisk || 0, color: '#EF4444' },
        { name: 'Medium Risk', value: stats.mediumRisk || 0, color: '#F59E0B' },
        { name: 'Low Risk', value: stats.lowRisk || 0, color: '#10B981' }
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="min-h-[300px] h-full">
            <Card.Header>
                <h3 className="text-lg font-bold">Risk Distribution</h3>
            </Card.Header>
            <Card.Content className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-1/2 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                // label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    color: '#1e293b'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                    {data.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors" style={{ backgroundColor: `${item.color}15` }}>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800 dark:text-white">{item.value}</p>
                                <p className="text-xs text-slate-500">{total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card.Content>
        </Card>
    );
};

export default RiskDistributionWidget;
