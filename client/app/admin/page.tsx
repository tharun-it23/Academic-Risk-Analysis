"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import KPICard from '@/components/KPICard';
import RiskDistributionWidget from '@/components/RiskDistributionWidget';
import DepartmentComparisonWidget from '@/components/DepartmentComparisonWidget';
import ExportButton from '@/components/ExportButton';
import { Users, AlertTriangle, GraduationCap, Plus, TrendingUp, Calendar, ChevronRight, Bell, Building } from 'lucide-react';
import { Spinner } from "@heroui/react";
import { useDisclosure } from "@heroui/use-disclosure";
import { SendNotificationModal } from '@/components/SendNotificationModal';
import NotificationSection from '@/components/NotificationSection';

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
    const [students, setStudents] = useState<any[]>([]);
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

    if (authLoading || loading || !stats) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded flex items-center justify-center bg-slate-100 border border-slate-200">
                        <span className="text-slate-600 text-2xl">📊</span>
                    </div>
                    <Spinner size="lg" />
                    <p className="text-sm text-slate-400 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Computed placements logic simply mapping real data (mocking the fact that placement eligible means low arrears & good cgpa)
    const placementEligible = students.filter(s => s.placementInfo?.eligibilityStatus === 'Eligible' || (s.cgpa >= 6.5 && (!s.arrearHistory || s.arrearHistory.length === 0))).length;
    const placementAtRisk = stats.totalStudents - placementEligible;

    return (
        <div className="space-y-8 animate-slide-up pb-10">

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                            Institution Overview
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                        <Calendar size={13} className="text-slate-400" /> {today}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <ExportButton data={students} filename="Institution_All_Students" />
                    <button
                        onClick={onNotifOpen}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all"
                    >
                        <Bell size={15} className="text-indigo-500" /> Send Alert
                    </button>
                    <button
                        onClick={() => router.push('/admin/students')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded transition-all hover:bg-slate-200 active:scale-[0.98]"
                    >
                        <Plus size={15} /> Student Directory
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <KPICard title="Total Students" value={stats.totalStudents} icon={<Users size={22} />} emoji="👥" color="indigo" subtitle="Institution wide" />
                <KPICard title="High Risk" value={stats.highRisk} icon={<AlertTriangle size={22} />} emoji="⚠️" color="red" subtitle="Needs intervention" trend="up" trendValue="critical" />
                <KPICard title="Avg Attendance" value={`${stats.avgAttendance?.toFixed(1)}%`} icon={<TrendingUp size={22} />} emoji="📅" color="emerald" subtitle="Overall average" />
                <KPICard title="Institution CGPA" value={stats.avgCGPA?.toFixed(2)} icon={<GraduationCap size={22} />} emoji="🏆" color="purple" subtitle="Overall average" />
            </div>

            {/* ── Main Data Grids ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Col (2 span): Dept and Placements */}
                <div className="xl:col-span-2 space-y-6">
                    <DepartmentComparisonWidget departmentStats={monthlyStats} />

                    {/* Quick placement readiness */}
                    <div className="dashboard-card bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border"
                        style={{ borderColor: 'var(--card-border)' }}>
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Placement Readiness</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Eligibility across all departments</p>
                            </div>
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold font-mono border border-indigo-100">
                                {((placementEligible/stats.totalStudents)*100).toFixed(0)}% ELIGIBLE
                            </span>
                        </div>
                        <div className="p-5 flex gap-4">
                            <div className="flex-1 p-4 rounded-xl border" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Eligible Students</p>
                                <p className="text-3xl font-extrabold text-emerald-600">{placementEligible}</p>
                            </div>
                            <div className="flex-1 p-4 rounded-xl border" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">At Risk / Ineligible</p>
                                <p className="text-3xl font-extrabold text-amber-600">{placementAtRisk}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Risk Dist and Notifications */}
                <div className="xl:col-span-1 space-y-6">
                    <RiskDistributionWidget stats={stats} />
                    <NotificationSection key={notifRefresh} />
                </div>
            </div>

            <SendNotificationModal isOpen={isNotifOpen} onOpenChange={onNotifOpenChange} onSuccess={() => setNotifRefresh(prev => prev + 1)} />
        </div>
    );
}
