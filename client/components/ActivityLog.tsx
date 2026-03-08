"use client";

import { Card} from "@heroui/react";
import { Activity, User, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'login' | 'update' | 'alert' | 'report';
    description: string;
    timestamp: string;
    user: string;
}

interface ActivityLogProps {
    activities?: ActivityItem[];
}

const ActivityLog = ({ activities = [] }: ActivityLogProps) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'login': return <User size={16} className="text-blue-500" />;
            case 'update': return <FileText size={16} className="text-amber-500" />;
            case 'alert': return <AlertTriangle size={16} className="text-red-500" />;
            case 'report': return <CheckCircle size={16} className="text-emerald-500" />;
            default: return <Activity size={16} className="text-slate-500" />;
        }
    };

    // Mock data if none provided
    const displayActivities = activities.length > 0 ? activities : [
        { id: '1', type: 'login', description: 'Admin logged in', timestamp: 'Just now', user: 'Admin' },
        { id: '2', type: 'update', description: 'Updated student records', timestamp: '2 hours ago', user: 'Faculty' },
        { id: '3', type: 'alert', description: 'High risk alert for Roll No 123', timestamp: '5 hours ago', user: 'System' },
        { id: '4', type: 'report', description: 'Generated monthly report', timestamp: '1 day ago', user: 'Admin' },
    ] as ActivityItem[];

    return (
        <Card className="h-full max-h-[400px]">
            <Card.Header className="flex gap-2 pb-2">
                <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
            </Card.Header>
            <Card.Content className="overflow-y-auto pr-2">
                <div className="space-y-4">
                    {displayActivities.map((activity) => (
                        <div key={activity.id} className="flex gap-3 items-start pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                            <div className="mt-1 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                {getIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{activity.description}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{activity.user}</span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">{activity.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card.Content>
        </Card>
    );
};

export default ActivityLog;
