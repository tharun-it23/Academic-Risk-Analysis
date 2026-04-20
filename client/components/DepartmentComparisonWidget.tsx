"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building } from 'lucide-react';

interface DepartmentStats {
    _id?: string;
    name?: string;
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-6 min-h-[320px] flex items-center justify-center">
                <p className="text-sm text-slate-400">No data available for comparison.</p>
            </div>
        );
    }

    const data = departmentStats.map(dept => ({
        department: dept._id || dept.name || 'Unknown',
        total: dept.total,
        highRisk: dept.highRisk,
        avgRisk: parseFloat(dept.avgRiskScore?.toFixed(1) || "0")
    }));

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden h-full">
            <div className="flex items-center gap-3 p-5 pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Building size={16} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Department Comparison</h3>
            </div>
            <div className="px-5 pb-3">
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    boxShadow: 'none',
                                    fontSize: '13px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="total" fill="#6366f1" name="Total Students" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="highRisk" fill="#ef4444" name="High Risk" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pb-3">
                    {data.map((dept, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{dept.department}</p>
                            <p className="text-lg font-bold text-slate-800 dark:text-white">{dept.total}</p>
                            <p className="text-xs text-red-500 font-medium">{dept.highRisk} at risk</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DepartmentComparisonWidget;
