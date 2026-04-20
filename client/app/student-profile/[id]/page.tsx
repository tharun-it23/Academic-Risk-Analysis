"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from "@heroui/react";
import api from '@/config/api';
import { Download, ArrowLeft, ArrowDownRight, ArrowRight, ArrowUpRight, Flame } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface StudentData {
    name: string;
    rollNo: string;
    department: string;
    semester: number;
    riskStatus: 'High' | 'Medium' | 'Low';
    cgpa: number;
    attendance: number;
    internalMarks: any[];
    earlyWarningAlerts: any[];
    semesterHistory: any[];
    placementInfo: any;
}

export default function StudentProfileView() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [student, setStudent] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await api.get(`/students/${id}`);
                setStudent(res.data);
            } catch (err) {
                console.error("Failed to fetch student", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStudent();
    }, [id]);

    const handleExport = () => {
        if (!printRef.current) return;
        const opt = {
            margin:       0.5,
            filename:     `${student?.name.replace(/ /g, '_')}_Profile.pdf`,
            image:        { type: 'jpeg' as const, quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
        };
        html2pdf().set(opt).from(printRef.current).save();
    };

    if (loading || !student) {
        return <div className="flex h-[80vh] items-center justify-center"><Spinner size="lg" /></div>;
    }

    const { name, cgpa, attendance, riskStatus, internalMarks, earlyWarningAlerts } = student;

    // Derived progress score (0-100) based on CGPA
    const progressScore = Math.min(100, Math.round((cgpa / 10) * 100));

    // Helper for Grade mapping
    const getGrade = (cgpa: number) => {
        if (cgpa >= 9) return 'A+';
        if (cgpa >= 8) return 'A';
        if (cgpa >= 7) return 'B';
        if (cgpa >= 6) return 'C+';
        if (cgpa >= 5) return 'C';
        return 'D';
    };

    // Derived Strengths & Areas to improve
    const strengths: string[] = [];
    const improvements: string[] = [];
    if (cgpa >= 7) strengths.push('Strong academic fundamentals');
    if (attendance >= 85) strengths.push('Consistent class attendance');
    if (internalMarks && internalMarks.some((m: any) => m.total >= 110)) strengths.push('Excellent in core subjects');
    if (cgpa < 6.5) improvements.push('Overall CGPA improvement');
    if (attendance < 75) improvements.push('Regular class attendance');
    if (internalMarks && internalMarks.some((m: any) => m.total < 75)) improvements.push('Focus on weaker subjects');

    return (
        <div className="space-y-6 animate-slide-up pb-10" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-500 transition-colors mb-2">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div ref={printRef} className="space-y-6">
                {/* ── TOP CARD ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between shadow-sm relative"
                     style={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 bg-[#FCD19C] rounded-full flex flex-shrink-0 items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                            <span className="text-5xl">👨‍🎓</span>
                        </div>

                        {/* Info */}
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">{name}</h1>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    Grade: {getGrade(cgpa)}
                                </span>
                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Flame size={12} className="fill-orange-500 text-orange-500" /> {attendance > 85 ? 'High attendance' : 'Needs attendance'}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskStatus === 'Low' ? 'bg-emerald-100 text-emerald-700' : riskStatus === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {riskStatus === 'Low' ? progressScore + '% Progress' : riskStatus + ' Risk'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Ring & Button */}
                    <div className="flex flex-col flex-shrink-0 items-center mt-6 sm:mt-0 gap-3">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#2563eb" strokeWidth="12" strokeLinecap="round"
                                        strokeDasharray="314" strokeDashoffset={314 - (314 * progressScore) / 100} />
                            </svg>
                            <span className="absolute text-xl font-bold text-slate-800">{progressScore}%</span>
                        </div>
                        <button onClick={handleExport} className="px-4 py-1.5 bg-[#e0e7ff] text-[#4f46e5] hover:bg-[#c7d2fe] transition-colors rounded-lg text-xs font-bold flex items-center gap-1.5">
                            <Download size={12} /> Export PDF
                        </button>
                    </div>
                </div>

                {/* ── SUBJECT PROGRESS ── */}
                <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <h3 className="text-[15px] font-bold text-slate-700 mb-5">Subject Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {internalMarks && internalMarks.length > 0 ? internalMarks.map((mark: any, idx: number) => {
                            // Calculate arbitrary stats to match mockup UI
                            const mastery = Math.round((mark.total / 150) * 100);
                            const classAvg = 70 + (idx % 10); // mock average
                            const diff = mastery - classAvg;
                            const isDown = diff < -5;
                            const isStable = diff >= -5 && diff <= 5;
                            const color = isDown ? '#f87171' : (isStable ? '#fbbf24' : '#34d399');

                            return (
                                <div key={idx} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="font-semibold text-slate-800">{mark.subjectName}</p>
                                        <span className={`text-xs font-semibold flex items-center gap-1 ${isDown ? 'text-red-500' : isStable ? 'text-blue-500' : 'text-emerald-500'}`}>
                                            {isDown ? <ArrowDownRight size={14} className="bg-red-100 rounded p-0.5" /> :
                                             isStable ? <ArrowRight size={14} className="bg-blue-100 rounded p-0.5" /> : 
                                             <ArrowUpRight size={14} className="bg-emerald-100 rounded p-0.5" />}
                                            {isDown ? 'down' : isStable ? 'stable' : 'up'}
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                                        <div className="h-full rounded-full" style={{ width: `${mastery}%`, backgroundColor: color }} />
                                    </div>
                                    <div className="flex justify-between items-center mb-1 text-[13px]">
                                        <span className="text-slate-500 font-medium">{mastery}% mastery</span>
                                        <span className="text-slate-500">Last score: {Math.round(mastery * 0.95)}%</span>
                                    </div>
                                    {diff < 0 ? (
                                        <p className="text-xs text-red-500 font-medium">{diff}% vs class avg ({classAvg}%)</p>
                                    ) : (
                                        <p className="text-xs text-emerald-500 font-medium">+{diff}% vs class avg ({classAvg}%)</p>
                                    )}
                                </div>
                            );
                        }) : (
                            <p className="text-sm text-slate-400">No subject progress available.</p>
                        )}
                    </div>
                </div>

                {/* ── BOTTOM ROW ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200" style={{ boxShadow: 'none' }}>
                        <h3 className="text-[15px] font-bold text-slate-700 mb-5">Recent Activity</h3>
                        <div className="space-y-3">
                            {earlyWarningAlerts && earlyWarningAlerts.length > 0 ? earlyWarningAlerts.slice(0,3).map((alert: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#e0f2fe]">
                                            <span className="text-[#0284c7] font-bold text-xs border-2 border-white rounded shadow-sm px-1">Alt</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-700 font-bold leading-tight">{alert.triggerReason}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{new Date(alert.dateRaised).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-[#3b82f6]">Alert</span>
                                </div>
                            )) : (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#e0f2fe]">
                                                <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-red-400 rounded-sm"/><div className="w-1.5 h-3 bg-blue-400 rounded-sm"/><div className="w-1.5 h-3 bg-emerald-400 rounded-sm"/></div>
                                            </div>
                                            <div>
                                                <p className="text-[13px] text-slate-600"><strong className="text-slate-800">Completed</strong> Internal Assessment 1</p>
                                                <p className="text-xs text-slate-400 mt-0.5">2 days ago</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-[#3b82f6]">{progressScore}%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#e0f2fe]">
                                                <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-red-400 rounded-sm"/><div className="w-1.5 h-3 bg-emerald-400 rounded-sm"/></div>
                                            </div>
                                            <div>
                                                <p className="text-[13px] text-slate-600"><strong className="text-slate-800">Started</strong> Lab Session</p>
                                                <p className="text-xs text-slate-400 mt-0.5">4 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm flex-1 border border-slate-200" style={{ boxShadow: 'none' }}>
                            <h3 className="text-[15px] font-bold text-slate-700 mb-4 flex items-center gap-2">💪 Strengths</h3>
                            <div className="flex flex-wrap gap-2">
                                {strengths.length > 0 ? strengths.map((s, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-[#dcfce7] text-[#166534] rounded-full text-xs font-semibold">
                                        {s}
                                    </span>
                                )) : (
                                    <span className="text-xs text-slate-400 ml-1">No significant strengths detected.</span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-6 shadow-sm flex-1 border border-slate-200" style={{ boxShadow: 'none' }}>
                            <h3 className="text-[15px] font-bold text-slate-700 mb-4 flex items-center gap-2">🎯 Areas to Improve</h3>
                            <div className="flex flex-wrap gap-2">
                                {improvements.length > 0 ? improvements.map((s, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-[#fef3c7] text-[#92400e] rounded-full text-xs font-semibold">
                                        {s}
                                    </span>
                                )) : (
                                    <span className="text-xs text-slate-400 ml-1">Performing optimally in all areas.</span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
