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
        { icon: <Users size={18} />, label: 'Students', path: '/admin/students' },
        { icon: <Activity size={18} />, label: 'Analytics', path: '/admin/analytics' },
        { icon: <Mail size={18} />, label: 'Tools', path: '/admin/tools' },
    ];

    return (
        <DashboardNavbar
            title="Admin Dashboard"
            menuItems={menuItems}
        >
            {children}
        </DashboardNavbar>
    );
}
