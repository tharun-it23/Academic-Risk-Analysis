"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card} from "@heroui/react";

interface DepartmentStats {
    _id: string; // Department Name
    total: number;
    highRisk: number;
    avgRiskScore: number;
    [key: string]: any;
}

interface DepartmentComparisonWidgetProps {
    departmentStats: DepartmentStats[];
}

const DepartmentComparisonWidget = ({ departmentStats }: DepartmentComparisonWidgetProps) => {
    if (!departmentStats || departmentStats.length === 0) {
        return (
            <Card className="min-h-[300px] h-full">
                <Card.Header>
                    <h3 className="text-lg font-bold">Department Comparison</h3>
                </Card.Header>
                <Card.Content className="flex items-center justify-center">
                    <p className="text-slate-400">No data available for comparison.</p>
                </Card.Content>
            </Card>
        );
    }

    const data = departmentStats.map(dept => ({
        department: dept._id,
        total: dept.total,
        highRisk: dept.highRisk,
        avgRisk: parseFloat(dept.avgRiskScore?.toFixed(1) || "0")
    }));

    return (
        <Card className="min-h-[400px] h-full">
            <Card.Header>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">🏢 Department Comparison</h3>
            </Card.Header>
            <Card.Content>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="department" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    color: '#1e293b'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="total" fill="#3b82f6" name="Total Students" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="highRisk" fill="#ef4444" name="High Risk" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {data.map((dept, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors">
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{dept.department}</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">{dept.total}</p>
                            <p className="text-xs text-red-600 dark:text-red-400">{dept.highRisk} at risk</p>
                        </div>
                    ))}
                </div>
            </Card.Content>
        </Card>
    );
};

export default DepartmentComparisonWidget;
