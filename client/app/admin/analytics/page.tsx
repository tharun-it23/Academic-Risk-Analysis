"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import RiskDistributionWidget from '@/components/RiskDistributionWidget';
import MonthlyRiskAnalytics from '@/components/MonthlyRiskAnalytics';
import DepartmentComparisonWidget from '@/components/DepartmentComparisonWidget';
import { BarChart3 } from 'lucide-react';
import { Spinner } from "@heroui/react";

interface Stats {
    totalStudents: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    avgAttendance: number;
    avgCGPA: number;
}

export default function AdminAnalyticsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [statsRes, monthlyRes] = await Promise.all([
                    api.get('/students/stats'),
                    api.get('/students/stats/monthly')
                ]);
                setStats(statsRes.data);
                setMonthlyStats(monthlyRes.data.departments || []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch analytics data", err);
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
        <main className="container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl pt-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <BarChart3 size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Advanced Analytics</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Deep dive into risk distribution and department statistics</p>
                </div>
            </div>

            {/* Charts Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskDistributionWidget stats={stats} />
                <DepartmentComparisonWidget departmentStats={monthlyStats} />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <MonthlyRiskAnalytics />
            </div>
        </main>
    );
}
