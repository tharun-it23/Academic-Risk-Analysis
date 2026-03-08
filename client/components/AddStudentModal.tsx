"use client";

import { useState } from 'react';
import { 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    Input, 
    Select, 
    Label, 
    ListBox
} from "@heroui/react";
import { UserPlus } from 'lucide-react';

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
        // Simulate API call
        setTimeout(() => {
            console.log("Student Added:", formData);
            setLoading(false);
            if (onSuccess) onSuccess();
            onClose();
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Container>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add New Student</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                
                                <Select className="w-full" placeholder="Select department">
                                    <Label>Department</Label>
                                    <Select.Trigger>
                                        <Select.Value>{formData.branch || "Select department"}</Select.Value>
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox 
                                            selectionMode="single" 
                                            selectedKeys={formData.branch ? new Set([formData.branch]) : new Set()}
                                            onSelectionChange={(keys) => handleSelectChange('branch', Array.from(keys)[0] as string || "")}
                                        >
                                            {['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI&DS'].map((dept) => (
                                                <ListBox.Item key={dept} id={dept} textValue={dept}>
                                                    {dept}
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>

                                <Select className="w-full" placeholder="Select year">
                                    <Label>Year</Label>
                                    <Select.Trigger>
                                        <Select.Value>{formData.year ? `${formData.year} Year` : "Select year"}</Select.Value>
                                        <Select.Indicator />
                                    </Select.Trigger>
                                    <Select.Popover>
                                        <ListBox 
                                            selectionMode="single" 
                                            selectedKeys={formData.year ? new Set([formData.year]) : new Set()}
                                            onSelectionChange={(keys) => handleSelectChange('year', Array.from(keys)[0] as string || "")}
                                        >
                                            {['1', '2', '3', '4'].map((year) => (
                                                <ListBox.Item key={year} id={year} textValue={`${year} Year`}>
                                                    {year} Year
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>

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
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button onPress={() => handleSubmit(onClose)} isPending={loading} startContent={<UserPlus size={18} />}>
                                Add Student
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </Modal.Container>
        </Modal>
    );
};
