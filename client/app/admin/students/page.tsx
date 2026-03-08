"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import StudentsTable from '@/components/StudentsTable';
import { Spinner } from "@heroui/react";
import { Button } from "@heroui/react";
import { Plus, Upload } from 'lucide-react';
import { useDisclosure } from "@heroui/use-disclosure";
import { AddStudentModal } from '@/components/AddStudentModal';
import { BulkUploadModal } from '@/components/BulkUploadModal';
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

export default function AdminStudentsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal controls
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
    const { isOpen: isUploadOpen, onOpen: onUploadOpen, onOpenChange: onUploadOpenChange } = useDisclosure();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
            return;
        }

        const fetchStudents = async () => {
            try {
                // Try fetching from API
                try {
                    const res = await api.get('/students');
                    setStudents(res.data);
                } catch (apiError) {
                    console.error("API Fetch Failed", apiError);
                    // Mock Data
                    setStudents([
                        { _id: '1', name: 'John Doe', rollNo: 'CS101', department: 'CSE', riskStatus: 'High', semester: 5, academics: { gpa: 6.5, attendance: 60 } },
                        { _id: '2', name: 'Jane Smith', rollNo: 'CS102', department: 'ECE', riskStatus: 'Low', semester: 3, academics: { gpa: 9.0, attendance: 95 } },
                        { _id: '3', name: 'Bob Johnson', rollNo: 'ME103', department: 'MECH', riskStatus: 'Medium', semester: 7, academics: { gpa: 7.2, attendance: 78 } },
                    ]);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        if (user) {
            fetchStudents();
        }
    }, [user, authLoading, router]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                // await api.delete(`/students/${id}`);
                setStudents(students.filter(s => s._id !== id));
                console.log("Deleted student", id);
            } catch (err) {
                console.error("Failed to delete", err);
            }
        }
    };

    const handleStudentAdded = () => {
        // Refresh list
        console.log("Student added, refreshing...");
    };

    if (authLoading || loading) {
        return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
    }

    return (
        <main className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">All Students</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage student records and risk analysis</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <ExportButton data={students} filename="Students_List" />
                    <Button variant="primary" onPress={onUploadOpen}>
                     <Upload size={18} />   Bulk Upload
                    </Button>
                    <Button variant="primary" onPress={onAddOpen}>
                       <Plus size={18} /> Add Student
                    </Button>
                </div>
            </div>

            <StudentsTable students={students} isAdmin={true} onDelete={handleDelete} />

            <AddStudentModal isOpen={isAddOpen} onOpenChange={onAddOpenChange} onSuccess={handleStudentAdded} />
            <BulkUploadModal isOpen={isUploadOpen} onOpenChange={onUploadOpenChange} onSuccess={handleStudentAdded} />
        </main>
    );
}
