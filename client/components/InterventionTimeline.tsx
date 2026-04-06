"use client";

import {
    ClipboardList,
    MessageCircle,
    BookOpen,
    UserCheck,
    Pin,
    Clock
} from 'lucide-react';
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
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                    <ClipboardList size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No interventions recorded</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Check back later for updates</p>
            </div>
        );
    }

    const getTypeIcon = (type: string) => {
        const icons: { [key: string]: JSX.Element } = {
            'counseling': <MessageCircle size={16} />,
            'remedial': <BookOpen size={16} />,
            'mentorship': <UserCheck size={16} />,
            'other': <Pin size={16} />
        };
        return icons[type] || <Pin size={16} />;
    };

    const getTypeConfig = (type: string) => {
        const configs: { [key: string]: { bg: string, dot: string, badge: string } } = {
            'counseling': { bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
            'remedial':   { bg: 'bg-blue-50 dark:bg-blue-900/20', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
            'mentorship': { bg: 'bg-emerald-50 dark:bg-emerald-900/20', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
            'other':      { bg: 'bg-slate-50 dark:bg-slate-800', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
        };
        return configs[type] || configs.other;
    };

    return (
        <div className="space-y-3">
            {interventions.slice().reverse().map((intervention, index) => {
                const config = getTypeConfig(intervention.type);
                return (
                    <div key={index} className="relative pl-7">
                        {/* Timeline line */}
                        {index < interventions.length - 1 && (
                            <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                        )}
                        {/* Timeline dot */}
                        <div className={`absolute left-0 top-2 w-6 h-6 rounded-full ${config.dot} border-[3px] border-white dark:border-slate-800 shadow-sm`}></div>

                        <div className={`${config.bg} rounded-xl p-4 border border-slate-200/40 dark:border-slate-700/40`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${config.badge}`}>
                                    {getTypeIcon(intervention.type)}
                                    {intervention.type}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock size={12} />
                                    {new Date(intervention.date).toLocaleDateString()}
                                </span>
                            </div>
                            {intervention.notes && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{intervention.notes}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                {intervention.conductedBy && (
                                    <span className="flex items-center gap-1">
                                        <UserCheck size={12} /> {intervention.conductedBy}
                                    </span>
                                )}
                                {intervention.performanceBefore !== undefined && (
                                    <span>Before: <strong>{intervention.performanceBefore.toFixed(2)}</strong></span>
                                )}
                                {intervention.performanceAfter !== undefined && (
                                    <span>
                                        After: <strong>{intervention.performanceAfter.toFixed(2)}</strong>
                                        {intervention.performanceBefore && (
                                            <span className={`ml-1 font-semibold ${intervention.performanceAfter > intervention.performanceBefore ? 'text-emerald-500' : 'text-red-500'}`}>
                                                ({intervention.performanceAfter > intervention.performanceBefore ? '↑' : '↓'} {Math.abs(intervention.performanceAfter - intervention.performanceBefore).toFixed(2)})
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InterventionTimeline;
