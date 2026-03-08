"use client";

import {
    ClipboardList,
    MessageCircle,
    BookOpen,
    UserCheck,
    Pin
} from 'lucide-react';
import { Card } from "@heroui/react";
import { JSX } from 'react';

interface Intervention {
    type: string;
    date: string;
    notes?: string;
    conductedBy?: string;
    performanceBefore?: number;
    performanceAfter?: number;
}

interface InterventionTimelineProps {
    interventions: Intervention[];
}

const InterventionTimeline = ({ interventions }: InterventionTimelineProps) => {
    if (!interventions || interventions.length === 0) {
        return (
            <Card className="shadow-sm">
                <Card.Header className="flex gap-2">
                    <ClipboardList size={20} className="text-default-500" />
                    <h3 className="text-lg font-bold text-default-700">Intervention History</h3>
                </Card.Header>
                <Card.Content>
                    <p className="text-default-500">No interventions recorded yet.</p>
                </Card.Content>
            </Card>
        );
    }

    const getTypeIcon = (type: string) => {
        const icons: { [key: string]: JSX.Element } = {
            'counseling': <MessageCircle size={20} />,
            'remedial': <BookOpen size={20} />,
            'mentorship': <UserCheck size={20} />,
            'other': <Pin size={20} />
        };
        return icons[type] || <Pin size={20} />;
    };

    const getTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            'counseling': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
            'remedial': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
            'mentorship': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
            'other': 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
        };
        return colors[type] || colors.other;
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="flex gap-2">
                <ClipboardList size={24} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Intervention History</h3>
            </Card.Header>
            <Card.Content>
                <div className="space-y-4">
                    {interventions.slice().reverse().map((intervention, index) => (
                        <div key={index} className="relative pl-8 pb-4 border-l-2 border-default-300 last:border-l-0">
                            <div className="absolute left-0 top-0 -ml-[9px] w-4 h-4 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-800"></div>
                            <div className={`p-4 rounded-lg border ${getTypeColor(intervention.type)}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-current opacity-80">{getTypeIcon(intervention.type)}</span>
                                        <span className="font-bold text-sm uppercase">{intervention.type}</span>
                                    </div>
                                    <span className="text-xs opacity-70">
                                        {new Date(intervention.date).toLocaleDateString()}
                                    </span>
                                </div>
                                {intervention.notes && (
                                    <p className="text-sm mb-2 opacity-90">{intervention.notes}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 text-xs opacity-80">
                                    {intervention.conductedBy && (
                                        <span>
                                            <strong>By:</strong> {intervention.conductedBy}
                                        </span>
                                    )}
                                    {intervention.performanceBefore !== undefined && (
                                        <span>
                                            <strong>Before:</strong> {intervention.performanceBefore.toFixed(2)}
                                        </span>
                                    )}
                                    {intervention.performanceAfter !== undefined && (
                                        <span>
                                            <strong>After:</strong> {intervention.performanceAfter.toFixed(2)}
                                            {intervention.performanceBefore && (
                                                <span className={`ml-1 ${intervention.performanceAfter > intervention.performanceBefore ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    ({intervention.performanceAfter > intervention.performanceBefore ? '↑' : '↓'} {Math.abs(intervention.performanceAfter - intervention.performanceBefore).toFixed(2)})
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card.Content>
        </Card>
    );
};

export default InterventionTimeline;
