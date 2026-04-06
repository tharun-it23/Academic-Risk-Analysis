"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { Lightbulb, Award, Briefcase, Target, BookOpen, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Spinner } from "@heroui/react";

export default function StudentRecommendationsPage() {
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

    const gpa = student.academics?.gpa || 0;
    const attendance = student.academics?.attendance || 0;
    const backlogs = student.academics?.backlogs || 0;

    const scholarshipEligible = gpa >= 8.5 && attendance >= 85;
    const placementReadiness = gpa >= 7.0 && attendance >= 75 && backlogs === 0;

    const recommendations = [];
    if (student.riskStatus === 'High') {
        recommendations.push({
            icon: <Target size={20} />,
            title: 'Immediate Intervention Required',
            desc: 'Your attendance or GPA is critically low. Meet with your Head of Department and enroll in remedial classes.',
            color: 'red'
        });
    } else if (student.riskStatus === 'Medium') {
        recommendations.push({
            icon: <Target size={20} />,
            title: gpa < 7 ? 'Improve Your Grades' : 'Improve Your Attendance',
            desc: 'Maintain a strict study schedule and ensure you do not miss any more lectures.',
            color: 'amber'
        });
    }
    if (gpa >= 8.0) {
        recommendations.push({
            icon: <BookOpen size={20} />,
            title: 'Advanced Placement Prep',
            desc: 'Start preparing for advanced placement interviews or competitive exams.',
            color: 'indigo'
        });
    }
    if (attendance >= 90) {
        recommendations.push({
            icon: <CheckCircle2 size={20} />,
            title: 'Excellent Attendance',
            desc: 'Your attendance is outstanding. Keep maintaining this consistency.',
            color: 'emerald'
        });
    }
    if (backlogs > 0) {
        recommendations.push({
            icon: <XCircle size={20} />,
            title: `Clear ${backlogs} Backlog${backlogs > 1 ? 's' : ''}`,
            desc: 'Focus on clearing your backlog subjects to improve placement readiness.',
            color: 'red'
        });
    }

    const colorMap: Record<string, {bg: string, icon: string, border: string}> = {
        red: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-500', border: 'border-red-200/60 dark:border-red-800/40' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-500', border: 'border-amber-200/60 dark:border-amber-800/40' },
        indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-500', border: 'border-indigo-200/60 dark:border-indigo-800/40' },
        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-500', border: 'border-emerald-200/60 dark:border-emerald-800/40' },
    };

    return (
        <main className="container mx-auto p-4 sm:p-6 space-y-6 max-w-5xl pt-4">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Lightbulb size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Recommendations & Eligibility</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">AI-driven insights based on your academic profile</p>
                </div>
            </div>

            {/* Eligibility Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Scholarship */}
                <div className={`rounded-2xl p-5 border transition-shadow hover:shadow-md ${scholarshipEligible ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10 border-amber-200/60 dark:border-amber-700/40' : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scholarshipEligible ? 'bg-amber-100 dark:bg-amber-800/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                <Award size={20} className={scholarshipEligible ? 'text-amber-600' : 'text-slate-400'} />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-white">Scholarship</p>
                                <p className="text-xs text-slate-500">GPA ≥ 8.5 & Attendance ≥ 85%</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${scholarshipEligible ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                            {scholarshipEligible ? '✓ Eligible' : '✗ Not Eligible'}
                        </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <span className={`${gpa >= 8.5 ? 'text-emerald-600' : 'text-red-500'}`}>GPA: {gpa.toFixed(1)}/8.5</span>
                        <span className={`${attendance >= 85 ? 'text-emerald-600' : 'text-red-500'}`}>Att: {attendance.toFixed(0)}%/85%</span>
                    </div>
                </div>

                {/* Placement */}
                <div className={`rounded-2xl p-5 border transition-shadow hover:shadow-md ${placementReadiness ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 border-blue-200/60 dark:border-blue-700/40' : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${placementReadiness ? 'bg-blue-100 dark:bg-blue-800/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                <Briefcase size={20} className={placementReadiness ? 'text-blue-600' : 'text-slate-400'} />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-white">Placement</p>
                                <p className="text-xs text-slate-500">GPA ≥ 7.0, Att ≥ 75%, 0 Backlogs</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${placementReadiness ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                            {placementReadiness ? '✓ Ready' : '✗ Not Ready'}
                        </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <span className={`${gpa >= 7 ? 'text-emerald-600' : 'text-red-500'}`}>GPA: {gpa.toFixed(1)}/7.0</span>
                        <span className={`${attendance >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>Att: {attendance.toFixed(0)}%/75%</span>
                        <span className={`${backlogs === 0 ? 'text-emerald-600' : 'text-red-500'}`}>Backlogs: {backlogs}</span>
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={18} className="text-amber-500" />
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">AI Recommendations</h2>
                </div>
                <div className="space-y-3">
                    {recommendations.map((rec, i) => {
                        const c = colorMap[rec.color] || colorMap.indigo;
                        return (
                            <div key={i} className={`${c.bg} border ${c.border} rounded-2xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                                    <span className={c.icon}>{rec.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{rec.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{rec.desc}</p>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 flex-shrink-0 mt-1" />
                            </div>
                        );
                    })}
                    {recommendations.length === 0 && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-6 text-center">
                            <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                            <p className="font-semibold text-emerald-700 dark:text-emerald-400">You're doing great!</p>
                            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">No critical recommendations at this time.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
