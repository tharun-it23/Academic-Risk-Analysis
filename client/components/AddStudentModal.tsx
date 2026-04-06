"use client";

import { useState } from 'react';
import {
    Modal,
    Button,
    Input,
    Label,
} from "@heroui/react";
import { UserPlus, ChevronDown } from 'lucide-react';
import api from '@/config/api';

interface AddStudentModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onSuccess?: () => void;
}

export const AddStudentModal = ({ isOpen, onOpenChange, onSuccess }: AddStudentModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        branch: '',
        year: '',
        email: '',
        phone: '',
        gpa: '',
        attendance: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (onClose: () => void) => {
        setLoading(true);
        try {
            await api.post('/students', formData);
            setLoading(false);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to add student:", error);
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop >
                <Modal.Container size='lg'>
                    <Modal.Dialog>
                        <Modal.Header className="flex flex-col gap-1">Add New Student</Modal.Header>
                        <Modal.Body className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    aria-label="Full Name"
                                    placeholder="Enter student name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Roll Number</Label>
                                <Input
                                    aria-label="Roll Number"
                                    placeholder="e.g. 21CSE101"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Department</Label>
                                <div className="relative">
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        className="w-full appearance-none px-3 py-2.5 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors cursor-pointer"
                                    >
                                        <option value="">Select department</option>
                                        {['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI&DS'].map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Year</Label>
                                <div className="relative">
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full appearance-none px-3 py-2.5 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors cursor-pointer"
                                    >
                                        <option value="">Select year</option>
                                        {['1', '2', '3', '4'].map((year) => (
                                            <option key={year} value={year}>{year} Year</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    aria-label="Email"
                                    placeholder="student@example.com"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    aria-label="Phone"
                                    placeholder="+91 98765 43210"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>CGPA</Label>
                                <Input
                                    aria-label="CGPA"
                                    placeholder="0.0 - 10.0"
                                    name="gpa"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Attendance (%)</Label>
                                <Input
                                    aria-label="Attendance (%)"
                                    placeholder="0 - 100"
                                    name="attendance"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.attendance}
                                    onChange={handleChange}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="w-full" slot="close" variant="secondary">
                                Close
                            </Button>
                            <Button slot="close" onPress={() => handleSubmit(close)} isPending={loading}>
                                <UserPlus size={18} />
                                Add Student
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};
