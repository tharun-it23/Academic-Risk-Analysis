"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import StudentsTable from '@/components/StudentsTable';
import { AddStudentModal } from '@/components/AddStudentModal';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { EditStudentModal } from '@/components/EditStudentModal';
import { AddMarksModal } from '@/components/AddMarksModal';
import ExportButton from '@/components/ExportButton';
import { useDisclosure } from '@heroui/use-disclosure';
import { Spinner } from '@heroui/react';
import {
    Users,
    AlertTriangle,
    TrendingUp,
    ShieldCheck,
    Plus,
    Upload,
    GraduationCap,
} from 'lucide-react';

interface Student {
    _id: string;
    name: string;
    rollNo: string;
    department: string;
    riskStatus: 'High' | 'Medium' | 'Low';
    semester: number;
    academics: { gpa: number; attendance: number };
    [key: string]: any;
}

interface Stats {
    totalStudents: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
}

export default function FacultyStudentsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [students, setStudents] = useState<Student[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
    const { isOpen: isUploadOpen, onOpen: onUploadOpen, onOpenChange: onUploadOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const { isOpen: isMarksOpen, onOpen: onMarksOpen, onOpenChange: onMarksOpenChange } = useDisclosure();

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/'); return; }
        if (!user) return;

        const fetchData = async () => {
            try {
                const [studRes, statsRes] = await Promise.all([
                    api.get('/students'),
                    api.get('/students/stats'),
                ]);
                setStudents(studRes.data || []);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Failed to fetch students data', err);
                setStats({ totalStudents: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, authLoading, router]);

    const handleStudentAdded = () => window.location.reload();

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/students/${id}`);
            setStudents(prev => prev.filter(s => s._id !== id));
        } catch (err) {
            console.error('Failed to delete student', err);
        }
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        onEditOpen();
    };

    const handleAddMarks = (student: Student) => {
        setSelectedStudent(student);
        onMarksOpen();
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Spinner size="lg" />
                    <p className="text-sm text-slate-400 font-medium">Loading students...</p>
                </div>
            </div>
        );
    }

    if (!mounted) return null;

    const kpiCards = [
        {
            label: 'Total Students',
            value: stats?.totalStudents ?? 0,
            icon: <Users size={20} />,
            bg: 'rgba(79,70,229,0.08)',
            iconColor: '#4f46e5',
            badge: null,
        },
        {
            label: 'High Risk',
            value: stats?.highRisk ?? 0,
            icon: <AlertTriangle size={20} />,
            bg: 'rgba(239,68,68,0.08)',
            iconColor: '#ef4444',
            badge: stats?.highRisk ? 'Needs Attention' : null,
        },
        {
            label: 'Medium Risk',
            value: stats?.mediumRisk ?? 0,
            icon: <ShieldCheck size={20} />,
            bg: 'rgba(245,158,11,0.08)',
            iconColor: '#f59e0b',
            badge: null,
        },
        {
            label: 'Low Risk / Safe',
            value: stats?.lowRisk ?? 0,
            icon: <TrendingUp size={20} />,
            bg: 'rgba(16,185,129,0.08)',
            iconColor: '#10b981',
            badge: null,
        },
    ];

    return (
        <div className="space-y-8 animate-slide-up">

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5 font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-[10px]">
                        <GraduationCap size={12} /> Student Management
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                        My Students
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage, monitor and support your assigned students
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <ExportButton data={students} filename="Faculty_Students_List" />
                    <button
                        id="bulk-upload-btn"
                        onClick={onUploadOpen}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-700/40 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:shadow-md transition-all"
                    >
                        <Upload size={16} /> Bulk Upload
                    </button>
                    <button
                        id="add-student-btn"
                        onClick={onAddOpen}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:opacity-95 transition-all"
                    >
                        <Plus size={16} /> Add Student
                    </button>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                {card.label}
                            </p>
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: card.bg, color: card.iconColor }}
                            >
                                {card.icon}
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">
                                {card.value}
                            </span>
                            {card.badge && (
                                <span className="mb-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                    {card.badge}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Students Table ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        👨‍🎓 My Students
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                            {students.length} TOTAL
                        </span>
                    </h2>
                </div>
                <StudentsTable
                    students={students}
                    isAdmin={true}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onAddMarks={handleAddMarks}
                />
            </div>

            {/* ── Modals ── */}
            <AddStudentModal isOpen={isAddOpen} onOpenChange={onAddOpenChange} onSuccess={handleStudentAdded} />
            <BulkUploadModal isOpen={isUploadOpen} onOpenChange={onUploadOpenChange} onSuccess={handleStudentAdded} />
            <EditStudentModal isOpen={isEditOpen} onOpenChange={onEditOpenChange} student={selectedStudent} onSuccess={handleStudentAdded} />
            <AddMarksModal isOpen={isMarksOpen} onOpenChange={onMarksOpenChange} student={selectedStudent} onSuccess={handleStudentAdded} />
        </div>
    );
}
