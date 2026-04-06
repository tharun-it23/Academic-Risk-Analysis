"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import KPICard from '@/components/KPICard';
import RiskDistributionWidget from '@/components/RiskDistributionWidget';
import MonthlyRiskAnalytics from '@/components/MonthlyRiskAnalytics';
import DepartmentComparisonWidget from '@/components/DepartmentComparisonWidget';
import ActivityLog from '@/components/ActivityLog';
import ExportButton from '@/components/ExportButton';
import {
    Users,
    AlertTriangle,
    GraduationCap,
    Plus,
    TrendingUp,
    Calendar,
    ChevronRight,
    Bell,
} from 'lucide-react';
import { Button } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { useDisclosure } from "@heroui/use-disclosure";
import { SendNotificationModal } from '@/components/SendNotificationModal';
import NotificationSection from '@/components/NotificationSection';

interface Student {
    _id: string;
    name: string;
    rollNo: string;
    department: string;
    riskStatus: 'high' | 'medium' | 'low';
    cgpa: number;
    attendance: number;
}

interface Stats {
    totalStudents: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    avgAttendance: number;
    avgCGPA: number;
}

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [notifRefresh, setNotifRefresh] = useState(0);

    const { isOpen: isNotifOpen, onOpen: onNotifOpen, onOpenChange: onNotifOpenChange } = useDisclosure();

    useEffect(() => {
        if (!authLoading && !user) { router.push('/'); return; }

        const fetchData = async () => {
            try {
                const [statsRes, monthlyRes, studentsRes] = await Promise.all([
                    api.get('/students/stats'),
                    api.get('/students/stats/monthly'),
                    api.get('/students')
                ]);
                setStats(statsRes.data);
                setMonthlyStats(monthlyRes.data.departments || []);
                setStudents(studentsRes.data || []);
            } catch (err) {
                console.error("API Fetch Failed", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-sm text-slate-400 dark:text-slate-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6 animate-slide-up">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            Overview
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                        Dashboard
                    </h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Calendar size={13} />
                        {today}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ExportButton data={students} filename="All_Students" />
                    <button
                        onClick={onNotifOpen}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] shadow-sm"
                    >
                        <Bell size={16} className="text-indigo-500" /> Send Alert
                    </button>
                    <button
                        onClick={() => router.push('/admin/students')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
                        }}
                    >
                        <Plus size={16} /> Add Student
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={<Users />}
                        color="indigo"
                        subtitle="Registered in system"
                    />
                    <KPICard
                        title="High Risk"
                        value={stats.highRisk}
                        icon={<AlertTriangle />}
                        color="red"
                        trend="up"
                        trendValue="+5%"
                    />
                    <KPICard
                        title="Avg Attendance"
                        value={`${stats.avgAttendance?.toFixed(1)}%`}
                        icon={<TrendingUp />}
                        color="emerald"
                    />
                    <KPICard
                        title="Avg CGPA"
                        value={stats.avgCGPA?.toFixed(2)}
                        icon={<GraduationCap />}
                        color="purple"
                    />
                </div>
            )}

            {/* ── Risk Summary Bar ── */}
            {stats && (
                <div className="rounded-2xl p-5"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Risk Overview</p>
                            <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>
                                {stats.totalStudents} students total
                            </p>
                        </div>
                        <a href="/admin/students" className="flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
                            View all <ChevronRight size={14} />
                        </a>
                    </div>
                    <div className="flex rounded-full overflow-hidden h-3 gap-0.5">
                        {[
                            { val: stats.highRisk, color: '#ef4444' },
                            { val: stats.mediumRisk, color: '#f59e0b' },
                            { val: stats.lowRisk, color: '#10b981' },
                        ].map((seg, i) => {
                            const pct = stats.totalStudents > 0 ? (seg.val / stats.totalStudents) * 100 : 0;
                            return pct > 0 ? (
                                <div key={i} className="rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%`, background: seg.color }} />
                            ) : null;
                        })}
                    </div>
                    <div className="flex gap-6 mt-3">
                        {[
                            { label: 'High', val: stats.highRisk, color: '#ef4444' },
                            { label: 'Medium', val: stats.mediumRisk, color: '#f59e0b' },
                            { label: 'Low', val: stats.lowRisk, color: '#10b981' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                                <span className="text-xs text-slate-500 dark:text-slate-400">{s.label}: <b className="text-slate-700 dark:text-slate-300">{s.val}</b></span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Charts Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="lg:col-span-1">
                    <NotificationSection key={notifRefresh} />
                </div>
                <RiskDistributionWidget stats={stats} />
                <ActivityLog />
                <DepartmentComparisonWidget departmentStats={monthlyStats} />
                <MonthlyRiskAnalytics />
            </div>

            <SendNotificationModal 
                isOpen={isNotifOpen} 
                onOpenChange={onNotifOpenChange} 
                onSuccess={() => setNotifRefresh(prev => prev + 1)} 
            />
        </div>
    );
}
