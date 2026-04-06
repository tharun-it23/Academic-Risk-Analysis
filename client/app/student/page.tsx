"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import {
    GraduationCap,
    Eye,
    BookOpen,
    Calendar,
    TrendingUp,
    Shield,
    Award,
    Briefcase,
    ChevronRight,
    AlertTriangle,
    CheckCircle,
    Clock,
    Bell,
} from 'lucide-react';
import { Spinner } from "@heroui/react";
import NotificationSection from '@/components/NotificationSection';

interface StudentData {
    name: string;
    rollNo: string;
    department: string;
    semester: number;
    riskStatus: 'High' | 'Medium' | 'Low';
    scholarshipEligible: boolean;
    placementReadiness: boolean;
    academics: {
        gpa: number;
        attendance: number;
    };
    interventions: any[];
}

export default function StudentDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [student, setStudent] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/'); return; }

        const fetchStudentData = async () => {
            try {
                if (!user?.username) throw new Error("No username/rollNo");
                const response = await api.get(`/students/roll/${user.username}`);
                setStudent(response.data);
            } catch (err) {
                const mockStudent: StudentData = {
                    name: user?.name || 'Student Name',
                    rollNo: user?.username || 'RollNo',
                    department: 'CSE',
                    semester: 6,
                    riskStatus: 'Low',
                    scholarshipEligible: true,
                    placementReadiness: true,
                    academics: { gpa: 8.5, attendance: 92 },
                    interventions: []
                };
                setStudent(mockStudent);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchStudentData();
    }, [user, authLoading, router]);

    if (authLoading || loading || !student) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-sm text-slate-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const { academics, riskStatus } = student;

    const riskConfig = {
        High:   { gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: 'rgba(239,68,68,0.3)', text: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: <AlertTriangle size={16} />, label: 'Action Required', desc: 'Immediate intervention recommended.' },
        Medium: { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: 'rgba(245,158,11,0.3)', text: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: <Clock size={16} />, label: 'Monitor Closely', desc: 'Some areas need attention.' },
        Low:    { gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.3)', text: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: <CheckCircle size={16} />, label: 'On Track', desc: 'You\'re performing well. Keep it up!' },
    };
    const risk = riskConfig[riskStatus];

    return (
        <div className="space-y-6 animate-slide-up">

            {/* ── View-Only Banner ── */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
                style={{
                    background: 'rgba(79,70,229,0.06)',
                    border: '1px solid rgba(79,70,229,0.15)',
                }}>
                <Eye size={16} className="text-indigo-500 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">
                    <b className="text-indigo-600 dark:text-indigo-400">View-only access.</b> Contact faculty or admin to make changes.
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <NotificationSection />
            </div>

            {/* ── Hero Profile ── */}
            <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white"
                style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}>
                {/* Decorative */}
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #a5b4fc, transparent)' }} />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
                <div className="absolute top-0 left-0 w-full h-full opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-white/20 flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                        <GraduationCap size={36} className="text-white/90" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-1">Student Profile</p>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">{student.name}</h1>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-sm text-indigo-200/80">
                            <span className="flex items-center gap-1.5"><BookOpen size={13} /> {student.rollNo}</span>
                            <span className="flex items-center gap-1.5"><Shield size={13} /> {student.department}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={13} /> Semester {student.semester}</span>
                        </div>
                    </div>
                    {/* Risk Badge */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-center"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Risk Status</p>
                        <p className="text-2xl font-bold text-white">{riskStatus}</p>
                        <p className="text-[11px] text-indigo-300/70">{risk.label}</p>
                    </div>
                </div>
            </div>

            {/* ── Stats & Eligibility Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* GPA Card */}
                <div className="dashboard-card rounded-2xl p-5"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                                <TrendingUp size={17} className="text-white" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">GPA</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--foreground)' }}>
                        {academics?.gpa?.toFixed(1) || '—'}
                    </p>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.1)' }}>
                        <div className="h-full rounded-full progress-bar"
                            style={{ width: `${(academics?.gpa / 10) * 100}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">out of 10.0</p>
                </div>

                {/* Attendance Card */}
                <div className="dashboard-card rounded-2xl p-5"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                                <Calendar size={17} className="text-white" />
                            </div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Attendance</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--foreground)' }}>
                        {academics?.attendance?.toFixed(0) || '—'}%
                    </p>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(16,185,129,0.1)' }}>
                        <div className="h-full rounded-full progress-bar"
                            style={{ width: `${academics?.attendance}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                        {academics?.attendance >= 75 ? 'Above required minimum' : 'Below required 75%'}
                    </p>
                </div>

                {/* Risk Status Card */}
                <div className="dashboard-card rounded-2xl p-5"
                    style={{ background: risk.bg, border: `1px solid ${risk.border}` }}>
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                            style={{ background: risk.gradient, boxShadow: `0 4px 12px ${risk.glow}` }}>
                            {risk.icon}
                        </div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Risk Level</span>
                    </div>
                    <p className="text-3xl font-bold tracking-tight mb-1" style={{ color: risk.text }}>{riskStatus}</p>
                    <p className="text-xs" style={{ color: risk.text, opacity: 0.7 }}>{risk.desc}</p>
                </div>
            </div>

            {/* ── Eligibility Section ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    {
                        label: 'Scholarship Eligibility',
                        eligible: student.scholarshipEligible,
                        icon: <Award size={18} />,
                        desc: student.scholarshipEligible ? 'You meet the criteria for scholarship.' : 'Does not currently meet the criteria.',
                        color: 'rgba(245,158,11,0.08)',
                        border: 'rgba(245,158,11,0.2)',
                        iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        iconGlow: 'rgba(245,158,11,0.3)',
                    },
                    {
                        label: 'Placement Readiness',
                        eligible: student.placementReadiness,
                        icon: <Briefcase size={18} />,
                        desc: student.placementReadiness ? 'Eligible for placement drives.' : 'Work on improving GPA and attendance.',
                        color: 'rgba(99,102,241,0.08)',
                        border: 'rgba(99,102,241,0.2)',
                        iconBg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        iconGlow: 'rgba(99,102,241,0.3)',
                    },
                ].map((item, i) => (
                    <div key={i} className="dashboard-card rounded-2xl p-5 flex items-center gap-4"
                        style={{ background: item.color, border: `1px solid ${item.border}` }}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                            style={{ background: item.iconBg, boxShadow: `0 4px 14px ${item.iconGlow}` }}>
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className="flex-shrink-0">
                            {item.eligible
                                ? <CheckCircle size={22} className="text-emerald-500" />
                                : <AlertTriangle size={22} className="text-amber-500" />
                            }
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Quick Links ── */}
            <div className="rounded-2xl p-5"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Performance', href: '/student/performance', icon: <TrendingUp size={16} />, color: '#4f46e5' },
                        { label: 'Recommendations', href: '/student/recommendations', icon: <Award size={16} />, color: '#7c3aed' },
                        { label: 'Feedback', href: '/student/feedback', icon: <BookOpen size={16} />, color: '#0ea5e9' },
                        { label: 'Calendar', href: '#', icon: <Calendar size={16} />, color: '#10b981' },
                    ].map((action, i) => (
                        <a key={i} href={action.href}
                            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                            style={{
                                background: `${action.color}10`,
                                border: `1px solid ${action.color}20`,
                                color: action.color,
                            }}>
                            {action.icon}
                            <span className="flex-1 text-slate-700 dark:text-slate-300">{action.label}</span>
                            <ChevronRight size={13} className="text-slate-400" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
