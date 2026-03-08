"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import InterventionTimeline from '@/components/InterventionTimeline';
import CalendarView from '@/components/CalendarView';
import FeedbackForm from '@/components/FeedbackForm';
import {
    Home,
    BarChart2,
    Lightbulb,
    MessageSquare,
    GraduationCap,
    Eye,
    TrendingUp,
    Award,
    Briefcase,
    Activity
} from 'lucide-react';
import { Card } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        if (!authLoading && !user) {
            router.push('/');
            return;
        }

        const fetchStudentData = async () => {
            try {
                // Mock Data for now
                const mockStudent: StudentData = {
                    name: user?.name || 'Student Name',
                    rollNo: user?.username || 'RollNo',
                    department: 'CSE',
                    semester: 6,
                    riskStatus: 'Low',
                    scholarshipEligible: true,
                    placementReadiness: true,
                    academics: { gpa: 8.5, attendance: 92 },
                    interventions: [
                        { type: 'mentorship', date: '2023-10-15', notes: 'Discussed career paths', conductedBy: 'Prof. Smith' }
                    ]
                };
                setStudent(mockStudent);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (user) {
            fetchStudentData();
        }
    }, [user, authLoading, router]);

    if (authLoading || loading || !student) {
        return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
    }

    const { academics, riskStatus, scholarshipEligible, placementReadiness } = student;

    // Sample trend data
    const performanceTrend = [
        { month: 'Jan', cgpa: 7.2, attendance: 78 },
        { month: 'Feb', cgpa: 7.5, attendance: 82 },
        { month: 'Mar', cgpa: 7.8, attendance: 85 },
        { month: 'Apr', cgpa: 8.0, attendance: 88 },
        { month: 'May', cgpa: academics?.gpa || 8.2, attendance: academics?.attendance || 90 },
    ];

    const getRiskColor = () => {
        if (riskStatus === 'High') return 'bg-gradient-to-br from-red-500 to-red-600';
        if (riskStatus === 'Medium') return 'bg-gradient-to-br from-amber-500 to-amber-600';
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600';
    };

    const menuItems = [
        { icon: <Home size={18} />, label: 'Dashboard', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { icon: <BarChart2 size={18} />, label: 'Performance', onClick: () => document.getElementById('performance-section')?.scrollIntoView({ behavior: 'smooth' }) },
        { icon: <Lightbulb size={18} />, label: 'Recommendations', onClick: () => document.getElementById('recommendations-section')?.scrollIntoView({ behavior: 'smooth' }) },
        { icon: <MessageSquare size={18} />, label: 'Feedback', onClick: () => document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth' }) },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            <DashboardNavbar title="Student Dashboard" menuItems={menuItems} />

            <main className="container mx-auto p-4 sm:p-6 space-y-6">

                {/* Read-Only Access Banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3">
                    <Eye size={24} className="text-blue-600 dark:text-blue-400" />
                    <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-300">View-Only Access</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">You can view your academic data but cannot make changes. Contact faculty or admin for updates.</p>
                    </div>
                </div>

                {/* Profile Card */}
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none shadow-xl">
                    <Card.Content className="flex flex-col md:flex-row items-center gap-8 p-8">
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl border border-white/30">
                                <GraduationCap size={48} />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold">{student.name}</h2>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-blue-100">
                                <span className="flex items-center gap-1"><span className="font-semibold">Roll No:</span> {student.rollNo}</span>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-1"><span className="font-semibold">Dept:</span> {student.department}</span>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-1"><span className="font-semibold">Sem:</span> {student.semester}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <p className="text-xs uppercase tracking-wider text-blue-100 mb-1">GPA</p>
                                <p className="text-2xl font-bold">{academics?.gpa}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                                <p className="text-xs uppercase tracking-wider text-blue-100 mb-1">Attendance</p>
                                <p className="text-2xl font-bold">{academics?.attendance}%</p>
                            </div>
                            <div className={`p-4 rounded-xl border border-white/20 ${getRiskColor()}`}>
                                <p className="text-xs uppercase tracking-wider text-white/90 mb-1">Risk Status</p>
                                <p className="text-2xl font-bold flex items-center justify-center gap-2">
                                    {riskStatus}
                                </p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Performance Section */}
                    <div className="lg:col-span-2 space-y-6" id="performance-section">
                        <Card className="shadow-sm">
                            <Card.Header className="flex gap-2">
                                <TrendingUp className="text-indigo-600" />
                                <h3 className="text-lg font-bold">Performance Trend</h3>
                            </Card.Header>
                            <Card.Content className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" />
                                        <YAxis yAxisId="left" stroke="#3b82f6" domain={[0, 10]} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[0, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                                        <Line yAxisId="left" type="monotone" dataKey="cgpa" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="GPA" />
                                        <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Attendance %" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card.Content>
                        </Card>

                        <CalendarView />

                        <InterventionTimeline interventions={student.interventions} />
                    </div>

                    {/* Sidebar / Recommendations */}
                    <div className="space-y-6" id="recommendations-section">
                        {/* Eligibility Cards */}
                        <Card className="shadow-sm">
                            <Card.Header><h3 className="text-lg font-bold">Eligibility Status</h3></Card.Header>
                            <Card.Content className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Award className={`${scholarshipEligible ? 'text-amber-500' : 'text-slate-400'}`} />
                                        <span className="font-medium">Scholarship</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${scholarshipEligible ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {scholarshipEligible ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Briefcase className={`${placementReadiness ? 'text-blue-500' : 'text-slate-400'}`} />
                                        <span className="font-medium">Placement</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${placementReadiness ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {placementReadiness ? 'Ready' : 'Not Ready'}
                                    </span>
                                </div>
                            </Card.Content>
                        </Card>

                        {/* Recommendations */}
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                            <Card.Header className="flex gap-2">
                                <Lightbulb className="text-yellow-300" />
                                <h3 className="text-lg font-bold">AI Recommendations</h3>
                            </Card.Header>
                            <Card.Content className="space-y-3">
                                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-sm">
                                    <p>🎯 <strong>Focus Area:</strong> Improve attendance in Core Java to boost overall score.</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg text-sm">
                                    <p>📚 <strong>Suggested:</strong> Attend the upcoming remedial session on Data Structures.</p>
                                </div>
                            </Card.Content>
                        </Card>

                        <div id="feedback-section">
                            <FeedbackForm studentId={user?._id || ''} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
