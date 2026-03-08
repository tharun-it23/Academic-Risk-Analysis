"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import KPICard from '@/components/KPICard';
import StudentsTable from '@/components/StudentsTable';
import {
    Users,
    AlertTriangle,
    TrendingUp,
    Search,
    Home
} from 'lucide-react';
import { Spinner } from "@heroui/react";

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

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
            return;
        }
        if (user?.role !== 'faculty' && user?.role !== 'admin') {
            // router.push('/'); 
        }

        const fetchData = async () => {
            try {
                try {
                    const [studentsRes, statsRes] = await Promise.all([
                        api.get('/students'),
                        api.get('/students/stats')
                    ]);
                    setStudents(studentsRes.data);
                    setStats(statsRes.data);
                } catch (apiError) {
                    console.error("API Fetch Failed", apiError);
                    // Mock Data
                    setStudents([
                        { _id: '1', name: 'John Doe', rollNo: 'CS101', department: 'CSE', riskStatus: 'High', semester: 5, academics: { gpa: 6.5, attendance: 60 } },
                        { _id: '2', name: 'Jane Smith', rollNo: 'CS102', department: 'ECE', riskStatus: 'Low', semester: 3, academics: { gpa: 9.0, attendance: 95 } },
                    ]);
                    setStats({ totalStudents: 120, highRisk: 15, mediumRisk: 30, lowRisk: 75 });
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
    }

    const menuItems = [
        { icon: <Home size={18} />, label: 'Dashboard', onClick: () => router.push('/faculty') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <DashboardNavbar title="Faculty Dashboard" menuItems={menuItems} />

            <main className="container mx-auto p-6 space-y-8">
                {/* Header & Stats */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Student Overview</h1>
                        <p className="text-slate-600 dark:text-slate-400">Monitor student performance and risks</p>
                    </div>

                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <KPICard
                                title="Total Students"
                                value={stats.totalStudents}
                                icon={<Users />}
                                color="blue"
                            />
                            <KPICard
                                title="High Risk Students"
                                value={stats.highRisk}
                                icon={<AlertTriangle />}
                                color="red"
                                subtitle="Needs immediate attention"
                            />
                            <KPICard
                                title="Safe Zone"
                                value={stats.lowRisk}
                                icon={<TrendingUp />}
                                color="emerald"
                            />
                        </div>
                    )}
                </div>

                {/* Filters & Table */}
                <StudentsTable students={students} />
            </main>
        </div>
    );
}
