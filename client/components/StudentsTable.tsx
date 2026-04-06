"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    Pagination,
    Chip,
    Button,
    Input,
} from "@heroui/react";
import { Search, AlertTriangle, Eye, Edit, Trash2, ChevronDown, MessageSquare } from 'lucide-react';

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
    onEdit?: (student: Student) => void;
}

const statusColorMap: Record<string, "danger" | "warning" | "success"> = {
    High: "danger",
    Medium: "warning",
    Low: "success",
};

const StudentsTable = ({ students, isAdmin = false, onDelete, onEdit }: StudentsTableProps) => {
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
                    <div className="relative w-full md:w-40">
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="w-full appearance-none px-3 py-2 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors cursor-pointer"
                        >
                            <option value="">All Depts</option>
                            {['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI&DS'].map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative w-full md:w-40">
                        <select
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                            className="w-full appearance-none px-3 py-2 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors cursor-pointer"
                        >
                            <option value="">Risk Level</option>
                            {['High', 'Medium', 'Low'].map((risk) => (
                                <option key={risk} value={risk}>{risk}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <Table aria-label="Student List">
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>NAME</Table.Column>
                            <Table.Column>ROLL NO</Table.Column>
                            <Table.Column>DEPT</Table.Column>
                            <Table.Column>PHONE</Table.Column>
                            <Table.Column>GPA</Table.Column>
                            <Table.Column>ATTENDANCE</Table.Column>
                            <Table.Column>RISK STATUS</Table.Column>
                            <Table.Column>ALERT</Table.Column>
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
                                    <Table.Cell>{item.phone || 'N/A'}</Table.Cell>
                                    <Table.Cell>{item.academics?.gpa}</Table.Cell>
                                    <Table.Cell>{item.academics?.attendance}%</Table.Cell>
                                    <Table.Cell>
                                        <Chip 
                                            className={item.riskStatus === 'High' ? "bg-red-100 text-red-700" : item.riskStatus === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"} 
                                            variant="soft"
                                        >
                                            {item.riskStatus}
                                        </Chip>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            variant="primary"
                                            isDisabled={!item.phone}
                                            onPress={() => item.phone && window.open(`sms:${item.phone}?body=Academic Alert: You have been identified with a ${item.riskStatus} risk status. Please contact your mentor immediately.`)}
                                            aria-label="Send SMS Alert"
                                        >
                                            <MessageSquare size={16} />
                                        </Button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" onPress={() => router.push(`/student-profile/${item._id}`)} aria-label="View Profile">
                                                <Eye size={18} className="text-slate-500" />
                                            </Button>
                                            {isAdmin && (
                                                <>
                                                    <Button variant="ghost" onPress={() => onEdit && onEdit(item)} aria-label="Edit Student">
                                                        <Edit size={18} />
                                                    </Button>
                                                    <Button variant="danger" onPress={() => onDelete && onDelete(item._id)} aria-label="Delete Student">
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
                            <Pagination>
                                <Pagination.Content>
                                    <Pagination.Item>
                                        <Pagination.Previous 
                                            isDisabled={page === 1} 
                                            onPress={() => setPage(page - 1)}
                                        >
                                            <Pagination.PreviousIcon />
                                        </Pagination.Previous>
                                    </Pagination.Item>
                                    
                                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                                        <Pagination.Item key={p}>
                                            <Pagination.Link 
                                                isActive={p === page} 
                                                onPress={() => setPage(p)}
                                            >
                                                {p}
                                            </Pagination.Link>
                                        </Pagination.Item>
                                    ))}

                                    <Pagination.Item>
                                        <Pagination.Next 
                                            isDisabled={page === pages} 
                                            onPress={() => setPage(page + 1)}
                                        >
                                            <Pagination.NextIcon />
                                        </Pagination.Next>
                                    </Pagination.Item>
                                </Pagination.Content>
                            </Pagination>
                        </div>
                    </Table.Footer>
                )}
            </Table>
        </div>
    );
};

export default StudentsTable;
