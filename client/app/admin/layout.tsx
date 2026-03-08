"use client";

import { DashboardNavbar } from "@/components/DashboardNavbar";
import {
    Home,
    Users,
    Activity,
    Lock,
    FileText,
    Plus,
    Upload,
    Mail,
    Download,
    Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const menuItems = [
        { icon: <Home size={18} />, label: 'Dashboard', path: '/admin' },
    ];

    const dropdownMenus = [
        {
            label: 'Students',
            icon: <Users size={18} />,
            items: [
                { icon: <FileText size={16} />, label: 'View All Students', description: 'Browse list', path: '/admin/students' },
                { icon: <Plus size={16} />, label: 'Add Student', description: 'Add new', path: '/admin/students' },
                { icon: <Upload size={16} />, label: 'Bulk Upload', description: 'CSV/Excel', onClick: () => console.log('Bulk Upload') },
            ]
        },
        {
            label: 'Analytics',
            icon: <Activity size={18} />,
            items: [
                { icon: <Activity size={16} />, label: 'Risk Distribution', description: 'View breakdowns', path: '/admin/analytics' },
                { icon: <Building size={16} />, label: 'Department Stats', description: 'Compare depts', path: '/admin/analytics' },
            ]
        },
        {
            label: 'Tools',
            icon: <Lock size={18} />,
            items: [
                { icon: <Mail size={16} />, label: 'Notifications', description: 'Send alerts', path: '/admin/tools' },
                { icon: <Download size={16} />, label: 'Export Data', description: 'Download Excel', path: '/admin/students' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <DashboardNavbar
                title="Admin Dashboard"
                menuItems={menuItems}
                dropdownMenus={dropdownMenus}
            />
            {children}
        </div>
    );
}
