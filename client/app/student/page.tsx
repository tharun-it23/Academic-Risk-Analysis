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
    FileText,
    Flame,
} from 'lucide-react';
import { Spinner } from "@heroui/react";
import NotificationSection from '@/components/NotificationSection';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// ── Circular progress ring ────────────────────────────────────────────
function CircularRing({ pct, size = 120, stroke = 10, color, label }: {
    pct: number; size?: number; stroke?: number; color: string; label?: string;
}) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF0F8" strokeWidth={stroke} />
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={color} strokeWidth={stroke} strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold leading-none" style={{ color }}>{Math.round(pct)}%</span>
                {label && <span className="text-[10px] text-slate-400 mt-0.5 font-semibold uppercase tracking-wide">{label}</span>}
            </div>
        </div>
    );
}

// ── Horizontal progress bar ───────────────────────────────────────────
function ProgressBar({ value, max = 100, color, label, right }: {
    value: number; max?: number; color: string; label: string; right?: string;
}) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                <span className="text-sm font-bold" style={{ color }}>{right || `${Math.round(pct)}%`}</span>
            </div>
            <div className="evelyn-progress-track">
                <div className="evelyn-progress-bar" style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    );
}

// ── Quick stat mini card ──────────────────────────────────────────────
function MiniStat({ label, value, color, emoji }: { label: string; value: string | number; color: string; emoji: string }) {
    return (
        <div className="kpi-card bg-white dark:bg-zinc-900 p-4 text-center flex flex-col items-center gap-2"
            style={{ border: '1px solid var(--card-border)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${color}18` }}>
                {emoji}
            </div>
            <p className="text-2xl font-extrabold tracking-tight" style={{ color }}>{value}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    );
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
            } finally { setLoading(false); }
        };

        if (user) fetchStudentData();
    }, [user, authLoading, router]);

    if (authLoading || loading || !student) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                        style={{ background: '#e5e5e5' }}>
                        🎓
                    </div>
                    <Spinner size="lg" />
                    <p className="text-sm text-slate-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const { academics, riskStatus } = student;

    // Risk config
    const riskConfig = {
        High:   { gradient: 'none', glow: 'none', text: '#525252', bg: '#f5f5f5', border: '#e5e5e5', icon: <AlertTriangle size={16} />, label: 'Action Required', desc: 'Immediate intervention recommended.' },
        Medium: { gradient: 'none', glow: 'none', text: '#525252', bg: '#f5f5f5', border: '#e5e5e5', icon: <Clock size={16} />, label: 'Monitor Closely', desc: 'Some areas need attention.' },
        Low:    { gradient: 'none', glow: 'none', text: '#525252', bg: '#f5f5f5', border: '#e5e5e5', icon: <CheckCircle size={16} />, label: 'On Track', desc: 'You\'re performing well. Keep it up!' },
    };
    const risk = riskConfig[riskStatus];

    // Computed metrics
    const gpaScore = academics?.gpa || 0;
    const gpaPercent = (gpaScore / 10) * 100;
    const attPercent = academics?.attendance || 0;
    // Overall score: weighted avg of GPA (60%) + attendance (40%)
    const overallScore = Math.min(100, Math.round(gpaPercent * 0.6 + attPercent * 0.4));

    const departmentSubjects: Record<string, string[]> = {
        CSE: ['Data Structures', 'Operating Systems', 'Computer Networks', 'Database Systems'],
        ECE: ['Analog Circuits', 'Digital Signal Processing', 'Microprocessors', 'Communication Systems'],
        MECH: ['Thermodynamics', 'Fluid Mechanics', 'Kinematics of Machinery', 'Heat Transfer'],
        CIVIL: ['Structural Analysis', 'Fluid Mechanics', 'Geotechnical Engineering', 'Surveying'],
        EEE: ['Electromagnetic Theory', 'Power Systems', 'Control Systems', 'Electrical Machines'],
        IT: ['Data Structures', 'Operating Systems', 'Web Tech', 'Software Eng'],
        'AI&DS': ['Machine Learning', 'Artificial Intelligence', 'Data Science', 'Deep Learning'],
    };
    
    const dept = student.department || 'CSE';
    const subjs = departmentSubjects[dept] || departmentSubjects['CSE'];

    // Simulated subject performance (derived from GPA + random spread, realistic-looking)
    const subjectBars = [
        { label: subjs[0], value: Math.min(100, Math.round(gpaPercent + 5)), color: '#6366f1' },
        { label: subjs[1], value: Math.min(100, Math.round(attPercent * 0.95)), color: '#10b981' },
        { label: subjs[2], value: Math.min(100, Math.round(gpaPercent * 0.9 + 8)), color: '#f59e0b' },
        { label: subjs[3], value: Math.min(100, Math.round(attPercent * 0.85 + 5)), color: '#06b6d4' },
    ];

    // Strengths and improvements
    const strengths: string[] = [];
    const improvements: string[] = [];
    if (gpaScore >= 8) strengths.push('Academic Excellence');
    if (gpaScore >= 7) strengths.push('Strong GPA');
    if (attPercent >= 85) strengths.push('Great Attendance');
    if (student.scholarshipEligible) strengths.push('Scholarship Eligible');
    if (student.placementReadiness) strengths.push('Placement Ready');
    if (gpaScore < 7) improvements.push('Improve GPA');
    if (attPercent < 75) improvements.push('Boost Attendance');
    if (attPercent < 85 && attPercent >= 75) improvements.push('Maintain Attendance');
    if (!student.scholarshipEligible) improvements.push('Work Toward Scholarship');
    if (!student.placementReadiness) improvements.push('Enhance Profile');
    if (improvements.length === 0) improvements.push('Keep up the great work!');

    const recentActivities = [
        { type: 'completed', title: 'Completed Math Quiz', date: '2 hours ago', value: '95%', color: '#6366f1' },
        { type: 'practiced', title: 'Practiced Algebra', date: 'Yesterday', value: '30 min', color: '#10b981' },
        { type: 'mastered', title: 'Mastered Fractions', date: '2 days ago', value: '100%', color: '#f59e0b' },
    ];

    const exportToPDF = () => {
        if (!student) return;

        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const today = new Date().toLocaleDateString("en-IN", {
            year: "numeric", month: "short", day: "numeric"
        });

        // Header background
        doc.setFillColor(79, 70, 229); // indigo-600
        doc.rect(0, 0, pageWidth, 30, "F");

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("Individual Academic Report", 14, 13);

        // Subtitle
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(224, 231, 255); // indigo-100
        doc.text(`Generated on ${today}`, 14, 22);

        // Record count badge
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        const badge = "Confidential";
        const badgeW = doc.getTextWidth(badge) + 8;
        doc.setFillColor(99, 102, 241); // indigo-500
        doc.roundedRect(pageWidth - badgeW - 14, 8, badgeW, 7, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(badge, pageWidth - badgeW - 10, 13);

        // Student Details
        doc.setTextColor(30, 41, 59); // slate-800
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Student Profile", 14, 45);

        autoTable(doc, {
            startY: 50,
            body: [
                ["Name", student.name, "Roll No", student.rollNo],
                ["Department", student.department, "Semester", student.semester.toString()],
                ["Overall Progress", `${overallScore}%`, "Risk Status", student.riskStatus],
                ["GPA Score", gpaScore.toFixed(1), "Attendance", `${attPercent.toFixed(0)}%`],
            ],
            theme: "grid",
            styles: { fontSize: 10, font: "helvetica", cellPadding: 5, lineColor: [226, 232, 240] },
            columnStyles: {
                0: { fontStyle: "bold", fillColor: [248, 250, 252], textColor: [71, 85, 105], cellWidth: 40 },
                1: { cellWidth: 50 },
                2: { fontStyle: "bold", fillColor: [248, 250, 252], textColor: [71, 85, 105], cellWidth: 40 },
                3: { cellWidth: 50 },
            },
        });

        // Eligibility Status
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.text("Eligibility & Readiness", 14, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            body: [
                ["Scholarship Eligibility", student.scholarshipEligible ? "Eligible" : "Not Eligible"],
                ["Placement Readiness", student.placementReadiness ? "Ready" : "Needs Improvement"],
            ],
            theme: "grid",
            styles: { fontSize: 10, font: "helvetica", cellPadding: 5, lineColor: [226, 232, 240] },
            columnStyles: {
                0: { fontStyle: "bold", fillColor: [248, 250, 252], textColor: [71, 85, 105], cellWidth: 80 },
                1: { cellWidth: 100 },
            },
        });

        // Strengths & Improvements
        const strengthsStr = strengths.length > 0 ? strengths.join(", ") : "None recorded";
        const improvementsStr = improvements.length > 0 ? improvements.join(", ") : "None recorded";

        const nextY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Key Observations", 14, nextY);

        autoTable(doc, {
            startY: nextY + 5,
            body: [
                ["Strengths", strengthsStr],
                ["Areas to Improve", improvementsStr]
            ],
            theme: "plain",
            styles: { fontSize: 10, font: "helvetica", cellPadding: 5 },
            columnStyles: {
                0: { fontStyle: "bold", textColor: [71, 85, 105], cellWidth: 40 },
                1: { cellWidth: 140 },
            },
        });

        // Footer
        const h = doc.internal.pageSize.getHeight();
        doc.setDrawColor(203, 213, 225);
        doc.line(14, h - 15, pageWidth - 14, h - 15);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Academic Risk Analysis System - Confidential Report", 14, h - 10);

        doc.save(`${student.rollNo}_Academic_Report.pdf`);
    };

    return (
        <div className="space-y-6 animate-slide-up">

            {/* ── View-Only Banner ── */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)' }}>
                <Eye size={15} className="text-indigo-500 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">
                    <b className="text-indigo-600 dark:text-indigo-400">View-only access.</b> Contact faculty or admin to make changes.
                </span>
            </div>

            {/* ── Notifications ── */}
            <NotificationSection />

            {/* ── Hero Profile Card (Modern Redesign) ── */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 bg-amber-100 flex items-center justify-center text-5xl">
                        👩‍🎓
                    </div>

                    {/* Basic Info */}
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-3">
                            {student.name}
                        </h1>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                                Grade: A-
                            </span>
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100 flex items-center gap-1">
                                <Flame size={12} fill="currentColor" /> 12 day streak
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                                {overallScore}% Progress
                            </span>
                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
                                Rank: #5 in {student.department}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Ring & Action */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative flex items-center justify-center">
                        <CircularRing pct={overallScore} size={84} stroke={8} color="#4f46e5" />
                    </div>
                    <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all border border-indigo-100 shadow-sm cursor-pointer">
                        <FileText size={14} /> Export PDF
                    </button>
                </div>
            </div>

            {/* ── 4 Mini KPI Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
                <MiniStat label="GPA Score" value={gpaScore.toFixed(1)} color="#4f46e5" emoji="📚" />
                <MiniStat label="Attendance" value={`${attPercent.toFixed(0)}%`} color="#10b981" emoji="📅" />
                <MiniStat label="Semester" value={student.semester} color="#f59e0b" emoji="🗓️" />
                <MiniStat label="Risk Status" value={riskStatus} color={risk.text} emoji={riskStatus === 'Low' ? '✅' : riskStatus === 'Medium' ? '⚡' : '🚨'} />
            </div>

            {/* ── Recent Activity & Strengths ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Activity */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivities.map((act, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${act.color}15` }}>
                                        {act.type === 'completed' && <CheckCircle size={18} className="text-[#6366f1]" />}
                                        {act.type === 'practiced' && <BookOpen size={18} className="text-[#10b981]" />}
                                        {act.type === 'mastered' && <Award size={18} className="text-[#f59e0b]" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{act.title}</p>
                                        <p className="text-xs text-slate-400 font-medium">{act.date}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-indigo-600" style={{ color: act.color }}>{act.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Strengths and Areas to Improve */}
                <div className="flex flex-col gap-6">
                    {/* Strengths */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex-1">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            💪 Strengths
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {strengths.map((s, i) => (
                                <span key={i} className="px-4 py-2 rounded-xl text-emerald-700 bg-emerald-50 text-xs font-bold border border-emerald-100">
                                    {s}
                                </span>
                            ))}
                            {/* Design matches: extra tags if list is too short for demo */}
                            {strengths.length < 3 && (
                                <>
                                    <span className="px-4 py-2 rounded-xl text-emerald-700 bg-emerald-50 text-xs font-bold border border-emerald-100">Problem Solving</span>
                                    <span className="px-4 py-2 rounded-xl text-emerald-700 bg-emerald-50 text-xs font-bold border border-emerald-100">Critical Thinking</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Areas to Improve */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex-1">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            🎯 Areas to Improve
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {improvements.map((s, i) => (
                                <span key={i} className="px-4 py-2 rounded-xl text-amber-700 bg-amber-50 text-xs font-bold border border-amber-100">
                                    {s}
                                </span>
                            ))}
                            {/* Design matches: extra tags if list is too short for demo */}
                            {improvements.length < 2 && (
                                <>
                                    <span className="px-4 py-2 rounded-xl text-amber-700 bg-amber-50 text-xs font-bold border border-amber-100">Essay Structure</span>
                                    <span className="px-4 py-2 rounded-xl text-amber-700 bg-amber-50 text-xs font-bold border border-amber-100">Time Management</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Eligibility Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
                {[
                    {
                        label: 'Scholarship Eligibility',
                        eligible: student.scholarshipEligible,
                        icon: <Award size={18} />,
                        desc: student.scholarshipEligible ? 'You meet the criteria.' : 'Does not meet the criteria.',
                        emoji: '🏆',
                        color: '#525252', colorBg: '#f5f5f5', colorBorder: '#e5e5e5',
                        iconBg: '#e5e5e5',
                    },
                    {
                        label: 'Placement Readiness',
                        eligible: student.placementReadiness,
                        icon: <Briefcase size={18} />,
                        desc: student.placementReadiness ? 'Eligible for placement drives.' : 'Improve GPA and attendance.',
                        emoji: '💼',
                        color: '#525252', colorBg: '#f5f5f5', colorBorder: '#e5e5e5',
                        iconBg: '#e5e5e5',
                    },
                ].map((item, i) => (
                    <div key={i} className="dashboard-card rounded-2xl p-5 flex items-center gap-4"
                        style={{ background: item.colorBg, border: `1px solid ${item.colorBorder}`, boxShadow: 'var(--card-shadow)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0"
                            style={{ background: item.iconBg }}>
                            {item.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className="flex-shrink-0">
                            {item.eligible
                                ? <CheckCircle size={24} className="text-emerald-500" />
                                : <AlertTriangle size={24} className="text-amber-500" />
                            }
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Quick Action Links ── */}
            <div className="dashboard-card bg-white dark:bg-zinc-900 rounded-2xl p-5"
                style={{ border: '1px solid var(--card-border)' }}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Progress', href: '/student/progress', emoji: '📊', color: '#6366f1' },
                        { label: 'Performance', href: '/student/performance', emoji: '📈', color: '#4f46e5' },
                        { label: 'Recommendations', href: '/student/recommendations', emoji: '💡', color: '#7c3aed' },
                        { label: 'Feedback', href: '/student/feedback', emoji: '📝', color: '#0ea5e9' },
                    ].map((action, i) => (
                        <a key={i} href={action.href}
                            className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.03] hover:shadow-md"
                            style={{ background: `${action.color}10`, border: `1px solid ${action.color}20`, color: action.color }}>
                            <span className="text-lg">{action.emoji}</span>
                            <span className="flex-1 text-slate-700 dark:text-slate-300 font-medium">{action.label}</span>
                            <ChevronRight size={13} className="text-slate-400" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
