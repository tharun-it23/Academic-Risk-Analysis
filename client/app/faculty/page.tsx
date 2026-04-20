"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import KPICard from '@/components/KPICard';
import StudentsTable from '@/components/StudentsTable';
import RiskDistributionWidget from '@/components/RiskDistributionWidget';
import NotificationSection from '@/components/NotificationSection';
import {
    Users,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Plus,
    Upload,
    Eye,
    ChevronRight,
    Activity,
    Star,
    BarChart3
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';
import { Spinner } from "@heroui/react";
import { useRouter as useNextRouter } from 'next/navigation';
import Link from 'next/link';

interface Student {
    _id: string;
    name: string;
    rollNo: string;
    department: string;
    riskStatus: 'High' | 'Medium' | 'Low';
    semester: number;
    academics: {
        gpa: number;
        attendance: number;
    };
    [key: string]: any;
}

interface Stats {
    totalStudents: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
}

// ── Circular progress ring ──────────────────────────────────────────────────
function CircularRing({ pct, size = 64, stroke = 7, color }: { pct: number; size?: number; stroke?: number; color: string }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF0F8" strokeWidth={stroke} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
            />
        </svg>
    );
}

// ── Horizontal progress bar ─────────────────────────────────────────────────
function ProgressBar({ value, max = 100, color, secondaryColor, label, sublabel, right }: {
    value: number; max?: number; color: string; secondaryColor?: string;
    label: string; sublabel?: string; right?: string;
}) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                    {sublabel && <span className="text-xs text-slate-400">{sublabel}</span>}
                </div>
                <span className="text-sm font-bold text-slate-600">{right || `${Math.round(pct)}%`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
            {secondaryColor && (
                <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: secondaryColor }} />
                    <span className="text-[11px] text-slate-400">class average</span>
                </div>
            )}
        </div>
    );
}

// ── Student attention card ──────────────────────────────────────────────────
function AttentionCard({ student, onView }: { student: Student; onView: (id: string) => void }) {
    let subMsg = "Critical - needs immediate support";
    if (student.academics?.attendance < 65) subMsg = "No recent activity";
    else if (student.academics?.gpa < 5) subMsg = "Falling behind in multiple subjects";

    return (
        <div className="bg-[#FFFDF4] rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-amber-700/70">{subMsg}</p>
                </div>
            </div>
            <button
                onClick={() => onView(student._id)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-amber-900 transition-transform active:scale-95"
                style={{ background: '#FDE047' }}>
                View
            </button>
        </div>
    );
}

const mockWeeklyData = [
    { name: 'Mon', value: 20 },
    { name: 'Tue', value: 40 },
    { name: 'Wed', value: 30 },
    { name: 'Thu', value: 70 },
    { name: 'Fri', value: 50 },
    { name: 'Sat', value: 10 },
    { name: 'Sun', value: 10 },
];

export default function FacultyDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/'); return; }

        const fetchStudents = async () => {
            try {
                const res = await api.get('/students');
                setStudents(res.data || []);
            } catch (err) { console.error("Fetch Students failed", err); }
        };

        const fetchStats = async () => {
            try {
                const res = await api.get('/students/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Fetch Stats failed", err);
                setStats({ totalStudents: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 });
            } finally { setLoading(false); }
        };

        if (user) { fetchStudents(); fetchStats(); }
    }, [user, authLoading, router]);

    const handleViewStudent = (id: string) => {
        router.push(`/student-profile/${id}`);
    };

    // Derived data
    const highRiskStudents = useMemo(() =>
        students.filter(s => s.riskStatus === 'High').slice(0, 4),
        [students]
    );

    const deptPerf = useMemo(() => {
        const deptMap: Record<string, { total: number; count: number; attendance: number }> = {};
        students.forEach(s => {
            const dept = s.department || 'Other';
            if (!deptMap[dept]) deptMap[dept] = { total: 0, count: 0, attendance: 0 };
            deptMap[dept].total += s.academics?.gpa || 0;
            deptMap[dept].attendance += s.academics?.attendance || 0;
            deptMap[dept].count++;
        });
        return Object.entries(deptMap).map(([dept, d]) => ({
            dept,
            avgGpa: d.count > 0 ? (d.total / d.count) : 0,
            avgAtt: d.count > 0 ? (d.attendance / d.count) : 0,
            count: d.count,
        })).sort((a, b) => b.avgGpa - a.avgGpa).slice(0, 5);
    }, [students]);

    const overallAvgGpa = useMemo(() => {
        if (!students.length) return 0;
        return students.reduce((s, st) => s + (st.academics?.gpa || 0), 0) / students.length;
    }, [students]);

    const overallAvgAtt = useMemo(() => {
        if (!students.length) return 0;
        return students.reduce((s, st) => s + (st.academics?.attendance || 0), 0) / students.length;
    }, [students]);

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
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

    if (!mounted) return null;

    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const safeZonePct = stats?.totalStudents ? Math.round((stats.lowRisk / stats.totalStudents) * 100) : 0;
    const highRiskPct = stats?.totalStudents ? Math.round((stats.highRisk / stats.totalStudents) * 100) : 0;

    return (
        <div className="space-y-8 animate-slide-up">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                            Faculty Workspace
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                        Welcome back, {user?.name?.split(' ')[0] || 'Faculty'} 👋
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                        <Calendar size={13} className="text-slate-400" />
                        {today}
                    </p>
                </div>
            </div>

            {/* ── 4-Column KPI Row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <KPICard
                    title="Total Students"
                    value={stats?.totalStudents ?? 0}
                    icon={<Users size={22} />}
                    color="blue"
                    variant="centered"
                />
                <KPICard
                    title="Class Average"
                    value={`${overallAvgAtt.toFixed(0)}%`}
                    icon={<Activity size={22} />}
                    color="emerald"
                    variant="centered"
                />
                <KPICard
                    title="Active Today"
                    value={stats ? Math.round(stats.totalStudents * 0.85) : 0}
                    icon={<Star size={22} />}
                    color="purple"
                    variant="centered"
                />
                <KPICard
                    title="Avg Streak"
                    value={`${Math.round(overallAvgGpa)} days`}
                    icon={<TrendingUp size={22} />}
                    color="orange"
                    variant="centered"
                />
            </div>

            {/* ── 2x2 Layout Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Left: Subject Performance */}
                <div className="dashboard-card bg-white dark:bg-zinc-900 rounded-2xl p-6"
                    style={{ border: '1px solid var(--card-border)' }}>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6">Subject Performance</h3>
                    <div className="space-y-6">
                        {deptPerf.length > 0 ? deptPerf.map((d, i) => {
                            const val = Math.round((d.avgGpa / 10) * 100);
                            return (
                                <ProgressBar
                                    key={i}
                                    label={d.dept}
                                    value={val}
                                    max={100}
                                    color="#EAB308"
                                    right={`${val}%`}
                                />
                            );
                        }) : (
                            <>
                                <ProgressBar label="Data Structures" value={82} color="#EAB308" right="82%" />
                                <ProgressBar label="Operating Systems" value={76} color="#EAB308" right="76%" />
                                <ProgressBar label="Computer Networks" value={78} color="#EAB308" right="78%" />
                                <ProgressBar label="Database Systems" value={85} color="#EAB308" right="85%" />
                            </>
                        )}
                    </div>
                </div>

                {/* Top Right: Weekly Activity */}
                <div className="dashboard-card bg-white dark:bg-zinc-900 rounded-2xl p-6"
                    style={{ border: '1px solid var(--card-border)' }}>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6">Weekly Activity</h3>
                    <div className="w-full h-48 opacity-20 hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockWeeklyData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Bar dataKey="value" fill="#EAB308" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center mt-2 text-slate-400">Mockup for active engagement</p>
                </div>

                {/* Bottom Left: Top Performers */}
                <div className="dashboard-card bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden"
                    style={{ border: '1px solid var(--card-border)' }}>
                    <div className="px-6 py-4 flex items-center gap-2">
                        <Star className="text-amber-500 fill-amber-500" size={16} />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Top Performers</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {students.slice().sort((a,b) => (b.academics?.gpa || 0) - (a.academics?.gpa || 0)).slice(0, 5).map((s, i) => {
                            let icon = <Star className="text-amber-400 fill-amber-400" size={18} />;
                            if (i === 0) icon = <span className="text-xl">🥇</span>;
                            else if (i === 1) icon = <span className="text-xl">🥈</span>;
                            else if (i === 2) icon = <span className="text-xl">🥉</span>;
                            
                            return (
                                <div key={s._id} className="bg-[#F8FAF9] rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 flex justify-center">{icon}</div>
                                        <p className="text-sm font-bold text-slate-700">{s.name}</p>
                                    </div>
                                    <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md">
                                        {Math.round((s.academics?.gpa / 10) * 100)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Right: Needs Attention */}
                <div className="dashboard-card bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden"
                    style={{ border: '1px solid var(--card-border)' }}>
                    <div className="px-6 py-4 flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={16} />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Needs Attention</h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {highRiskStudents.length > 0 ? highRiskStudents.map(s => (
                            <AttentionCard key={s._id} student={s} onView={handleViewStudent} />
                        )) : (
                            <div className="py-8 text-center text-slate-400 text-sm">No critical students.</div>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                <NotificationSection />
            </div>
        </div>
    );
}
