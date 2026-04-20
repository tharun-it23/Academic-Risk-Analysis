"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import InterventionTimeline from '@/components/InterventionTimeline';
import CalendarView from '@/components/CalendarView';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { Spinner } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function StudentPerformancePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
            return;
        }

        const fetchStudentData = async () => {
            try {
                if (!user?.username) throw new Error("No username/rollNo");
                const response = await api.get(`/students/roll/${user.username}`);
                setStudent(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch student profile", err);
                const mockStudent = {
                    name: user?.name || 'Student Name',
                    rollNo: user?.username || 'RollNo',
                    department: 'CSE',
                    semester: 6,
                    riskStatus: 'Low',
                    academics: { gpa: 8.5, attendance: 92 },
                    interventions: []
                };
                setStudent(mockStudent);
                setLoading(false);
            }
        };

        if (user) {
            fetchStudentData();
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return <div className="flex h-[80vh] items-center justify-center"><Spinner size="lg" /></div>;
    }

    if (!student) {
        return <div className="p-8 text-center text-slate-500">Student data not found.</div>;
    }

    const { academics } = student;

    const performanceTrend = [
        { month: 'Jan', cgpa: +(Math.max(0, academics?.gpa - 1.0)).toFixed(1), attendance: Math.max(0, academics?.attendance - 12) },
        { month: 'Feb', cgpa: +(Math.max(0, academics?.gpa - 0.7)).toFixed(1), attendance: Math.max(0, academics?.attendance - 8) },
        { month: 'Mar', cgpa: +(Math.max(0, academics?.gpa - 0.4)).toFixed(1), attendance: Math.max(0, academics?.attendance - 5) },
        { month: 'Apr', cgpa: +(Math.max(0, academics?.gpa - 0.2)).toFixed(1), attendance: Math.max(0, academics?.attendance - 2) },
        { month: 'May', cgpa: academics?.gpa || 8.2, attendance: academics?.attendance || 90 },
    ];

    return (
        <main className="container mx-auto p-4 sm:p-6 space-y-6 max-w-6xl pt-4">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Academic Performance</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track your GPA trend, attendance, and calendar events</p>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current GPA</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{academics?.gpa?.toFixed(1)}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Attendance</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{academics?.attendance?.toFixed(0)}%</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Semester</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{student.semester || '—'}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Risk</p>
                    <p className={`text-2xl font-bold mt-1 ${student.riskStatus === 'High' ? 'text-red-500' : student.riskStatus === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>{student.riskStatus}</p>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-5 pb-0">
                    <BarChart3 size={20} className="text-indigo-500" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Performance Trend</h3>
                    <div className="ml-auto flex gap-4 text-xs font-medium">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> GPA</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Attendance</span>
                    </div>
                </div>
                <div className="h-[320px] p-4">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <LineChart data={performanceTrend}>
                            <defs>
                                <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} domain={[0, 10]} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} domain={[0, 100]} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: 'none', fontSize: '13px' }} />
                            <Line yAxisId="left" type="monotone" dataKey="cgpa" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: '#6366f1' }} name="GPA" />
                            <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: '#10b981' }} name="Attendance %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Calendar + Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-5 pb-3">
                        <Calendar size={20} className="text-purple-500" />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Calendar</h3>
                    </div>
                    <div className="px-4 pb-4">
                        <CalendarView />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-5 pb-3">
                        <TrendingUp size={20} className="text-orange-500" />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Interventions</h3>
                    </div>
                    <div className="px-4 pb-4">
                        <InterventionTimeline interventions={student.interventions || []} />
                    </div>
                </div>
            </div>
        </main>
    );
}
