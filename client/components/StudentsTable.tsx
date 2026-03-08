"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    Pagination,
    Chip,
    Button,
    Input,
    Select,
    Label,
    ListBox
} from "@heroui/react";
import { Search, AlertTriangle, Eye, Edit, Trash2 } from 'lucide-react';

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

interface StudentsTableProps {
    students: Student[];
    isAdmin?: boolean;
    onDelete?: (id: string) => void;
}

const statusColorMap: Record<string, "danger" | "warning" | "success"> = {
    High: "danger",
    Medium: "warning",
    Low: "success",
};

const StudentsTable = ({ students, isAdmin = false, onDelete }: StudentsTableProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterRisk, setFilterRisk] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = searchTerm === '' ||
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesDepartment = filterDepartment === '' || student.department === filterDepartment;
            const matchesRisk = filterRisk === '' || student.riskStatus === filterRisk;

            return matchesSearch && matchesDepartment && matchesRisk;
        });
    }, [students, searchTerm, filterDepartment, filterRisk]);

    const pages = Math.ceil(filteredStudents.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredStudents.slice(start, end).map(s => ({ ...s, id: s._id }));
    }, [page, filteredStudents]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="text-default-300" size={18} />
                    </div>
                    <Input
                        className="w-full pl-10"
                        placeholder="Search by name or roll no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select className="w-full md:w-40" placeholder="All Depts">
                        <Label>Department</Label>
                        <Select.Trigger>
                            <Select.Value>{filterDepartment || "All Depts"}</Select.Value>
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox
                                selectionMode="single"
                                selectedKeys={filterDepartment ? new Set([filterDepartment]) : new Set([])}
                                onSelectionChange={(keys) => setFilterDepartment(Array.from(keys)[0] as string || "")}
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

                    <Select className="w-full md:w-40" placeholder="Risk Level">
                        <Label>Risk Level</Label>
                        <Select.Trigger>
                            <Select.Value>{filterRisk || "Risk Level"}</Select.Value>
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox
                                selectionMode="single"
                                selectedKeys={filterRisk ? new Set([filterRisk]) : new Set([])}
                                onSelectionChange={(keys) => setFilterRisk(Array.from(keys)[0] as string || "")}
                            >
                                {['High', 'Medium', 'Low'].map((risk) => (
                                    <ListBox.Item key={risk} id={risk} textValue={risk}>
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={14} />
                                            {risk}
                                        </div>
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>
            </div>

            <Table aria-label="Student List">
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>NAME</Table.Column>
                            <Table.Column>ROLL NO</Table.Column>
                            <Table.Column>DEPT</Table.Column>
                            <Table.Column>GPA</Table.Column>
                            <Table.Column>ATTENDANCE</Table.Column>
                            <Table.Column>RISK STATUS</Table.Column>
                            <Table.Column>ACTIONS</Table.Column>
                        </Table.Header>
                        <Table.Body 
                            items={items} 
                            renderEmptyState={() => (
                                <div className="flex justify-center p-4">No students found</div>
                            )}
                        >
                            {(item: Student) => (
                                <Table.Row id={item._id}>
                                    <Table.Cell>{item.name}</Table.Cell>
                                    <Table.Cell>{item.rollNo}</Table.Cell>
                                    <Table.Cell>{item.department}</Table.Cell>
                                    <Table.Cell>{item.academics?.gpa}</Table.Cell>
                                    <Table.Cell>{item.academics?.attendance}%</Table.Cell>
                                    <Table.Cell>
                                        <Chip className="capitalize" variant="soft" color={statusColorMap[item.riskStatus]}>
                                            {item.riskStatus}
                                        </Chip>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <Button isIconOnly size="sm" variant="ghost" onPress={() => router.push(`/student-profile/${item._id}`)} aria-label="View Profile">
                                                <Eye size={18} className="text-slate-500" />
                                            </Button>
                                            {isAdmin && (
                                                <>
                                                    <Button isIconOnly size="sm" variant="ghost" onPress={() => console.log('Edit', item._id)} aria-label="Edit Student">
                                                        <Edit size={18} />
                                                    </Button>
                                                    <Button isIconOnly size="sm" variant="danger" onPress={() => onDelete && onDelete(item._id)} aria-label="Delete Student">
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
                {pages > 1 && (
                    <Table.Footer>
                        <div className="flex w-full justify-center">
                            <Pagination
                                page={page}
                                total={pages}
                                onChange={(p: number) => setPage(p)}
                            />
                        </div>
                    </Table.Footer>
                )}
            </Table>
        </div>
    );
};

export default StudentsTable;
