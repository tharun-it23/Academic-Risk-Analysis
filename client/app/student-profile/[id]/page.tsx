"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card } from "@heroui/react";
import { Spinner } from "@heroui/react";
import { ArrowLeft, Mail, Phone, MapPin, BookOpen, AlertTriangle, Calendar } from 'lucide-react';
import { Chip } from "@heroui/react";
import InterventionTimeline from '@/components/InterventionTimeline';

interface Intervention {
    type: string;
    date: string;
    notes?: string;
    conductedBy?: string;
    performanceBefore?: number;
    performanceAfter?: number;
}

interface Student {
    _id: string;
    name: string;
    rollNo: string;
    department: string;
    email: string;
    phone: string;
    address: string;
    riskStatus: 'High' | 'Medium' | 'Low';
    academics: {
        gpa: number;
        attendance: number;
        backlogs: number;
    };
    interventions?: Intervention[];
}

export default function StudentProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                // In a real app, fetch by ID
                // const res = await api.get(`/students/${id}`);
                // setStudent(res.data);

                // Mock Data for demonstration
                // Simulating network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                setStudent({
                    _id: id as string,
                    name: "John Doe",
                    rollNo: "2021CSE001",
                    department: "CSE",
                    email: "john.doe@example.com",
                    phone: "+91 98765 43210",
                    address: "123 College Road, City",
                    riskStatus: "Medium",
                    academics: {
                        gpa: 7.5,
                        attendance: 72,
                        backlogs: 1
                    },
                    interventions: []
                });

            } catch (err) {
                console.error("Failed to fetch student", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudent();
        }
    }, [id]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;

    if (!student) return <div className="flex justify-center p-10">Student not found</div>;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Button
                variant="secondary"
                onPress={() => router.back()}
                className='mb-4'
            >
                <ArrowLeft size={18} /> Back
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="col-span-1">
                    <Card.Header className="flex flex-col items-center pt-8 pb-4">
                        <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl font-bold text-slate-500 mb-4">
                            {student.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold">{student.name}</h2>
                        <p className="text-slate-500">{student.rollNo}</p>
                        <Chip
                            className="mt-3 capitalize"
                            color={student.riskStatus === 'High' ? 'danger' : student.riskStatus === 'Medium' ? 'warning' : 'success'}
                            variant="secondary"
                        >
                            {student.riskStatus} Risk
                        </Chip>
                    </Card.Header>
                    <Card.Content className="px-6 py-4 space-y-4">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <Mail size={18} />
                            <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <Phone size={18} />
                            <span className="text-sm">{student.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <MapPin size={18} />
                            <span className="text-sm">{student.address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <BookOpen size={18} />
                            <span className="text-sm">{student.department} Dept</span>
                        </div>
                    </Card.Content>
                </Card>

                {/* Academic Stats */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-bold">Academic Performance</h3>
                        </Card.Header>
                        <Card.Content>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">GPA</p>
                                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{student.academics.gpa}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Attendance</p>
                                    <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{student.academics.attendance}%</p>
                                </div>
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400 mb-1">Backlogs</p>
                                    <p className="text-2xl font-bold text-red-800 dark:text-red-200">{student.academics.backlogs}</p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Interventions */}
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-bold">Intervention History</h3>
                        </Card.Header>
                        <Card.Content>
                            <InterventionTimeline interventions={student.interventions || []} />
                        </Card.Content>
                    </Card>
                </div>
            </div>
        </div>
    );
}
