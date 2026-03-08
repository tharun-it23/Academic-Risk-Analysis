"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import KPICard from '@/components/KPICard';
import RiskDistributionWidget from '@/components/RiskDistributionWidget';
import MonthlyRiskAnalytics from '@/components/MonthlyRiskAnalytics';
import DepartmentComparisonWidget from '@/components/DepartmentComparisonWidget';
import ActivityLog from '@/components/ActivityLog';
import {
    Users,
    AlertTriangle,
    GraduationCap,
    Plus,
} from 'lucide-react';
import { Button } from "@heroui/react";
import { Spinner } from "@heroui/react";

interface Student {
    _id: string;
    name: string;
    rollNo: string;
    department: string;
    riskStatus: 'high' | 'medium' | 'low';
    cgpa: number;
    attendance: number;
}

interface Stats {
    totalStudents: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    avgAttendance: number;
    avgCGPA: number;
}

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                try {
                    const [statsRes] = await Promise.all([
                        api.get('/students/stats')
                    ]);
                    setStats(statsRes.data);
                } catch (apiError) {
                    console.error("API Fetch Failed, using fallback?", apiError);
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

    return (
        <main className="container mx-auto p-6 space-y-8">
            {/* Welcome Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
                    <p className="text-slate-600 dark:text-slate-400">Welcome back, Administrator</p>
                </div>
                <Button >
                    <Plus size={18} />  Add New Student
                </Button>
            </div>

            {/* KPI Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={<Users />}
                        color="blue"
                        subtitle="Registered in system"
                    />
                    <KPICard
                        title="High Risk"
                        value={stats.highRisk}
                        icon={<AlertTriangle />}
                        color="red"
                        trend="up"
                        trendValue="+5%"
                    />
                    <KPICard
                        title="Avg Attendance"
                        value={`${stats.avgAttendance?.toFixed(1)}%`}
                        icon={<Users />}
                        color="emerald"
                    />
                    <KPICard
                        title="Avg CGPA"
                        value={stats.avgCGPA?.toFixed(2)}
                        icon={<GraduationCap />}
                        color="purple"
                    />
                </div>
            )}

            {/* Recent Activity / Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskDistributionWidget stats={stats} />
                <ActivityLog />

                <DepartmentComparisonWidget departmentStats={[
                    { _id: 'CSE', total: 120, highRisk: 15, avgRiskScore: 3.5 },
                    { _id: 'ECE', total: 100, highRisk: 10, avgRiskScore: 2.8 },
                    { _id: 'MECH', total: 90, highRisk: 20, avgRiskScore: 4.2 },
                    { _id: 'CIVIL', total: 80, highRisk: 8, avgRiskScore: 2.5 },
                    { _id: 'EEE', total: 70, highRisk: 12, avgRiskScore: 3.8 }
                ]} />
                <MonthlyRiskAnalytics />
            </div>
        </main>
    );
}
