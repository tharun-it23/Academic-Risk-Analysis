"use client";

import { DashboardNavbar } from "@/components/DashboardNavbar";
import {
    Home,
    Users,
} from 'lucide-react';

export default function FacultyLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const menuItems = [
        { icon: <Home size={18} />, label: 'Dashboard', path: '/faculty' },
        { icon: <Users size={18} />, label: 'My Students', path: '/faculty/students' },
    ];

    return (
        <DashboardNavbar title="Faculty Dashboard" menuItems={menuItems}>
            {children}
        </DashboardNavbar>
    );
}
