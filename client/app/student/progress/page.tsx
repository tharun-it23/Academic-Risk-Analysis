"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import {
    TrendingUp,
    TrendingDown,
    Activity,
    ChevronLeft,
    FileText,
    Flame,
    BarChart3,
} from 'lucide-react';
import { Spinner } from "@heroui/react";
import Link from 'next/link';

interface StudentData {
    name: string;
    rollNo: string;
    department: string;
    semester: number;
    riskStatus: 'High' | 'Medium' | 'Low';
    academics: {
        gpa: number;
        attendance: number;
    };
}

function SubjectProgressCard({ 
    label, 
    mastery, 
    lastScore, 
    trend, 
    comparison, 
    avg 
}: { 
    label: string, 
    mastery: number, 
    lastScore: number, 
    trend: 'up' | 'down' | 'stable', 
    comparison: string, 
    avg: number 
}) {
    const isUp = trend === 'up';
    const isDown = trend === 'down';
    const color = isDown ? '#eab308' : '#22c55e'; // Amber for Writing (down), Green for others

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-slate-800 dark:text-white">{label}</h4>
                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${
                    isUp ? 'text-emerald-600 bg-emerald-50' : 
                    isDown ? 'text-rose-600 bg-rose-50' : 
                    'text-blue-600 bg-blue-50'
                }`}>
                    {isUp && <TrendingUp size={12} />}
                    {isDown && <TrendingDown size={12} />}
                    {!isUp && !isDown && <Activity size={12} />}
                    {trend}
                </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-4">
                <div 
                    className="h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${mastery}%`, backgroundColor: color }} 
                />
            </div>

            <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-400">{mastery}% mastery</span>
                <span className="text-slate-600 dark:text-slate-200">Last score: {lastScore}%</span>
            </div>
            <p className={`text-[11px] font-bold ${isDown ? 'text-amber-600' : 'text-emerald-600'}`}>
                {comparison} vs class avg ({avg}%)
            </p>
        </div>
    );
}

export default function StudentProgressPage() {
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
                    name: user?.name || 'Emma Wilson',
                    rollNo: user?.username || 'RollNo',
                    department: 'CSE',
                    semester: 6,
                    riskStatus: 'Low',
                    academics: { gpa: 8.7, attendance: 92 },
                };
                setStudent(mockStudent);
            } finally { setLoading(false); }
        };

        if (user) fetchStudentData();
    }, [user, authLoading, router]);

    if (authLoading || loading || !student) {
        return <div className="flex h-[80vh] items-center justify-center"><Spinner size="lg" /></div>;
    }

    const overallScore = Math.round(((student.academics.gpa / 10) * 100 * 0.6) + (student.academics.attendance * 0.4));

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header / Back */}
            <div className="flex items-center justify-between">
                <Link href="/student" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-bold">
                    <ChevronLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Year 2023-24</span>
                </div>
            </div>

            {/* Profile Summary Hero */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden flex-shrink-0 bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
                        👩‍🎓
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-3">
                            {student.name}
                        </h1>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                                Grade: A-
                            </span>
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100 flex items-center gap-1">
                                <Flame size={12} fill="currentColor" /> 12 day streak
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                {overallScore}% Progress
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                   <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-slate-100 dark:text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
                            <circle className="text-indigo-600" strokeWidth="8" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - overallScore/100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
                        </svg>
                        <span className="absolute text-lg font-bold text-slate-800 dark:text-white">{overallScore}%</span>
                   </div>
                   <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-bold transition-all border border-indigo-100 shadow-sm h-fit">
                        <FileText size={14} /> Export PDF
                    </button>
                </div>
            </div>

            {/* Subject Progress Section */}
            <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-500" /> Subject Progress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SubjectProgressCard 
                        label="Math" 
                        mastery={92} 
                        lastScore={95} 
                        trend="up" 
                        comparison="+20%" 
                        avg={72} 
                    />
                    <SubjectProgressCard 
                        label="Reading" 
                        mastery={85} 
                        lastScore={82} 
                        trend="stable" 
                        comparison="+9%" 
                        avg={76} 
                    />
                    <SubjectProgressCard 
                        label="Science" 
                        mastery={88} 
                        lastScore={90} 
                        trend="up" 
                        comparison="+13%" 
                        avg={75} 
                    />
                    <SubjectProgressCard 
                        label="Writing" 
                        mastery={78} 
                        lastScore={75} 
                        trend="down" 
                        comparison="+7%" 
                        avg={71} 
                    />
                </div>
            </div>
        </div>
    );
}
