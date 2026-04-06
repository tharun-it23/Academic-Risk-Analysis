"use client";

import { useEffect, useState } from 'react';
import { Activity, User, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import api from '@/config/api';

interface ActivityItem {
    id: string;
    type: 'login' | 'update' | 'alert' | 'report';
    description: string;
    timestamp: string;
    user: string;
}

const ActivityLog = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get('/activity-log?limit=15');
                setActivities(res.data || []);
            } catch (err) {
                console.error('Failed to fetch activity log:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, []);

    const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
        login:  { icon: <User size={14} />,          color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
        update: { icon: <FileText size={14} />,       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        alert:  { icon: <AlertTriangle size={14} />,  color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
        report: { icon: <CheckCircle size={14} />,    color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    };

    const formatTimestamp = (timestamp: string) => {
        if (!timestamp) return '';
        try {
            const date = new Date(timestamp + 'Z');
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMin = Math.floor(diffMs / 60000);
            const diffHrs = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            if (diffMin < 1) return 'Just now';
            if (diffMin < 60) return `${diffMin}m ago`;
            if (diffHrs < 24) return `${diffHrs}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        } catch {
            return timestamp;
        }
    };

    return (
        <div className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', maxHeight: '400px' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0"
                style={{ borderBottom: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(99,102,241,0.1)' }}>
                        <Activity size={15} className="text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Recent Activity</h3>
                        <p className="text-xs text-slate-400">Live updates</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-3 py-3 scrollbar-hide">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-5 h-5 border-2 rounded-full animate-spin-slow"
                            style={{ borderColor: 'rgba(99,102,241,0.2)', borderTopColor: '#6366f1' }} />
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-10">
                        <Activity size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-sm text-slate-400">No activity recorded yet.</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {activities.map((activity) => {
                            const cfg = typeConfig[activity.type] || { icon: <Activity size={14} />, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
                            return (
                                <div key={activity.id}
                                    className="flex gap-3 items-start p-3 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                                    <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                                        style={{ background: cfg.bg, color: cfg.color }}>
                                        {cfg.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate leading-relaxed">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-0.5 gap-2">
                                            <span className="text-[11px] text-slate-400 font-medium truncate">{activity.user}</span>
                                            <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                                                <Clock size={10} /> {formatTimestamp(activity.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
