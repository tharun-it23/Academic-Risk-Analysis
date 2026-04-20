"use client";

import { useState, useEffect } from 'react';
import api from '../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, ChevronDown } from 'lucide-react';

const MonthlyRiskAnalytics = () => {
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth() + 1));
    const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()));
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const months = [
        { value: "1", label: 'January' },
        { value: "2", label: 'February' },
        { value: "3", label: 'March' },
        { value: "4", label: 'April' },
        { value: "5", label: 'May' },
        { value: "6", label: 'June' },
        { value: "7", label: 'July' },
        { value: "8", label: 'August' },
        { value: "9", label: 'September' },
        { value: "10", label: 'October' },
        { value: "11", label: 'November' },
        { value: "12", label: 'December' }
    ];

    const years: { value: string; label: string }[] = [];
    for (let year = 2020; year <= currentDate.getFullYear() + 1; year++) {
        years.push({ value: String(year), label: String(year) });
    }

    const fetchMonthlyData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/students/stats/monthly?month=${selectedMonth}&year=${selectedYear}`);
            setData(res.data.departments || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch monthly data');
            setData([
                { name: 'CSE', highRisk: 5, mediumRisk: 10, lowRisk: 40 },
                { name: 'ECE', highRisk: 3, mediumRisk: 8, lowRisk: 35 },
                { name: 'MECH', highRisk: 6, mediumRisk: 12, lowRisk: 30 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthlyData();
    }, [selectedMonth, selectedYear]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden h-full">
            <div className="p-5 pb-3 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                        <BarChart2 size={16} className="text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Risk Analytics</h3>
                </div>
                <div className="flex gap-3 max-w-md">
                    {/* Month Select */}
                    <div className="relative w-full max-w-[180px]">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Month</label>
                        <div className="relative">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="w-full appearance-none px-3 py-2 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-colors cursor-pointer"
                            >
                                {months.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Year Select */}
                    <div className="relative w-full max-w-[120px]">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Year</label>
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full appearance-none px-3 py-2 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-colors cursor-pointer"
                            >
                                {years.map((y) => (
                                    <option key={y.value} value={y.value}>{y.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-5 pb-5">
                {loading ? (
                    <div className="flex h-[300px] items-center justify-center">
                        <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: 'none', fontSize: '13px' }} />
                                <Legend />
                                <Bar dataKey="highRisk" name="High Risk" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="mediumRisk" name="Medium Risk" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="lowRisk" name="Low Risk" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthlyRiskAnalytics;
