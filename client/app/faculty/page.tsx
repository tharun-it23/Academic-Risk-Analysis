"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import KPICard from '@/components/KPICard';
import StudentsTable from '@/components/StudentsTable';
import RiskDistributionWidget from '@/components/RiskDistributionWidget';
import NotificationSection from '@/components/NotificationSection';
import ActivityLog from '@/components/ActivityLog';
import {
    Users,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Search,
    Home,
    GraduationCap,
    Clock,
    Plus,
    Upload
} from 'lucide-react';
import { Spinner } from "@heroui/react";
import { useDisclosure } from "@heroui/use-disclosure";
import { AddStudentModal } from '@/components/AddStudentModal';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { EditStudentModal } from '@/components/EditStudentModal';
import ExportButton from '@/components/ExportButton';

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

export default function FacultyDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal controls
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
    const { isOpen: isUploadOpen, onOpen: onUploadOpen, onOpenChange: onUploadOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
            return;
        }

        const fetchStudents = async () => {
            try {
                const res = await api.get('/students');
                setStudents(res.data || []);
            } catch (err) {
                console.error("Fetch Students failed", err);
            }
        };

        const fetchStats = async () => {
            try {
                const res = await api.get('/students/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Fetch Stats failed", err);
                setStats({ totalStudents: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStudents();
            fetchStats();
        }
    }, [user, authLoading, router]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await api.delete(`/students/${id}`);
                setStudents(students.filter(s => s._id !== id));
                console.log("Deleted student", id);
            } catch (err) {
                console.error("Failed to delete", err);
            }
        }
    };

    const handleStudentAdded = () => {
        // Refresh list
        console.log("Student added/modified, refreshing...");
        window.location.reload();
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        onEditOpen();
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-sm text-slate-400 font-medium">Preparing your workspace...</p>
                </div>
            </div>
        );
    }

    if (!mounted) return null;

    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8 animate-slide-up">
            
            {/* ── Welcome Header ── */}
                
                {/* ── Welcome Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5 font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-[10px]">
                            Faculty Workspace
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                            Welcome, {user?.name || 'Faculty Member'}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                            <Calendar size={14} className="text-slate-400" />
                            {today}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <ExportButton data={students} filename="Faculty_Students_List" />
                        <button
                            onClick={onUploadOpen}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-700/40 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:shadow-md transition-all"
                        >
                            <Upload size={16} /> Bulk Upload
                        </button>
                        <button
                            onClick={onAddOpen}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:opacity-95 transition-all"
                        >
                            <Plus size={16} /> Add Student
                        </button>
                    </div>
                </div>

                {/* ── Stats & Alerts Row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2/3: Stats Cards */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <KPICard
                                    title="Total Students"
                                    value={stats.totalStudents}
                                    icon={<Users size={20} />}
                                    color="indigo"
                                    subtitle="Assigned students"
                                />
                                <KPICard
                                    title="High Risk"
                                    value={stats.highRisk}
                                    icon={<AlertTriangle size={20} />}
                                    color="red"
                                    subtitle="Immediate action"
                                />
                                <KPICard
                                    title="Safe Zone"
                                    value={stats.lowRisk}
                                    icon={<TrendingUp size={20} />}
                                    color="emerald"
                                    subtitle="Steady performance"
                                />
                            </div>
                        )}
                        
                        {/* Risk Chart & Alerts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RiskDistributionWidget stats={stats} />
                            <NotificationSection />
                        </div>
                    </div>

                    {/* Right 1/3: Shortcuts/Info */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Quick Insights</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Pending Actions</p>
                                        <p className="text-xs text-slate-400">{stats?.highRisk || 0} students at high risk</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Performance</p>
                                        <p className="text-xs text-slate-400">Total: {students.length} students</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => window.print()}
                                className="w-full mt-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                            >
                                Generate Report
                            </button>
                        </div>
                        <ActivityLog />
                    </div>
                </div>

                {/* ── Main Data Section ── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                             Detailed Student List
                             <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                                {students.length} AVAILABLE
                             </span>
                        </h2>
                    </div>
                    <StudentsTable students={students} isAdmin={true} onDelete={handleDelete} onEdit={handleEdit} />
                </div>

            <AddStudentModal isOpen={isAddOpen} onOpenChange={onAddOpenChange} onSuccess={handleStudentAdded} />
            <BulkUploadModal isOpen={isUploadOpen} onOpenChange={onUploadOpenChange} onSuccess={handleStudentAdded} />
            <EditStudentModal isOpen={isEditOpen} onOpenChange={onEditOpenChange} student={selectedStudent} onSuccess={handleStudentAdded} />
        </div>
    );
}
