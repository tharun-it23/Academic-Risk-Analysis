"use client";

import { useState, useEffect } from 'react';
import {
    Modal,
    Button,
    Input,
    Label,
} from "@heroui/react";
import { BookOpen, ChevronDown } from 'lucide-react';
import api from '@/config/api';

interface AddMarksModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    student: any | null;
    onSuccess?: () => void;
}

export const AddMarksModal = ({ isOpen, onOpenChange, student, onSuccess }: AddMarksModalProps) => {
    const [formData, setFormData] = useState({
        semesterNo: '',
        subjectCode: '',
        subjectName: '',
        ia1: '',
        ia2: '',
        ia3: '',
        assignment: ''
    });

    // Reset when modal opens for a new student
    useEffect(() => {
        if (student) {
            setFormData({
                semesterNo: student.semester?.toString() || '1',
                subjectCode: '',
                subjectName: '',
                ia1: '',
                ia2: '',
                ia3: '',
                assignment: ''
            });
        }
    }, [student, isOpen]);

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (onClose: () => void) => {
        if (!student?._id) return;
        setLoading(true);
        try {
            await api.post(`/students/${student._id}/marks`, formData);
            setLoading(false);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to add marks:", error);
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop >
                <Modal.Container size="lg">
                    <Modal.Dialog>
                        <Modal.Header className="flex flex-col gap-1">Add internal marks for {student?.name}</Modal.Header>
                        <Modal.Body className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Semester Number</Label>
                                <div className="relative">
                                    <select
                                        name="semesterNo"
                                        value={formData.semesterNo}
                                        onChange={handleChange}
                                        className="w-full appearance-none px-3 py-2.5 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors cursor-pointer"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Subject Code</Label>
                                <Input
                                    aria-label="Subject Code"
                                    placeholder="e.g. CS8591"
                                    name="subjectCode"
                                    value={formData.subjectCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Subject Name</Label>
                                <Input
                                    aria-label="Subject Name"
                                    placeholder="e.g. Computer Networks"
                                    name="subjectName"
                                    value={formData.subjectName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Internal Assessment 1 (IA1)</Label>
                                <Input
                                    aria-label="IA1"
                                    placeholder="0 - 50"
                                    name="ia1"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="50"
                                    value={formData.ia1}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Internal Assessment 2 (IA2)</Label>
                                <Input
                                    aria-label="IA2"
                                    placeholder="0 - 50"
                                    name="ia2"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="50"
                                    value={formData.ia2}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Internal Assessment 3 (IA3)</Label>
                                <Input
                                    aria-label="IA3"
                                    placeholder="0 - 50"
                                    name="ia3"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="50"
                                    value={formData.ia3}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Assignment Score</Label>
                                <Input
                                    aria-label="Assignment"
                                    placeholder="0 - 10"
                                    name="assignment"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={formData.assignment}
                                    onChange={handleChange}
                                />
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="w-full" slot="close" variant="secondary">
                                Close
                            </Button>
                            <Button slot="close" onPress={() => handleSubmit(close)} isPending={loading}>
                                <BookOpen size={18} />
                                Add Marks
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};
