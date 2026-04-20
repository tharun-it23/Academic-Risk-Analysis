"use client";

import { DashboardNavbar } from "@/components/DashboardNavbar";
import {
    Home,
    BarChart2,
    Lightbulb,
    MessageSquare,
    ClipboardCheck,
} from 'lucide-react';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const menuItems = [
        { icon: <Home size={18} />, label: 'Dashboard', path: '/student' },
        { icon: <ClipboardCheck size={18} />, label: 'Progress', path: '/student/progress' },
        { icon: <BarChart2 size={18} />, label: 'Performance', path: '/student/performance' },
        { icon: <Lightbulb size={18} />, label: 'Recommendations', path: '/student/recommendations' },
        { icon: <MessageSquare size={18} />, label: 'Feedback', path: '/student/feedback' },
    ];

    return (
        <DashboardNavbar title="Student Dashboard" menuItems={menuItems}>
            {children}
        </DashboardNavbar>
    );
}
