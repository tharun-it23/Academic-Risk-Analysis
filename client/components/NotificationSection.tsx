"use client";

import { useEffect, useState } from 'react';
import api from '@/config/api';
import { Bell, Info, AlertTriangle, User, Calendar } from 'lucide-react';

interface Notification {
    id: number;
    message: string;
    targetGroup: string;
    senderName: string;
    createdAt: string;
}

export default function NotificationSection() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data || []);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) {
        return (
            <div className="rounded-2xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-64 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-400">Loading alerts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Bell size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight text-sm">Targeted Alerts</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {notifications.length} NEW
                </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px] divide-y divide-slate-50 dark:divide-slate-700/50">
                {notifications.length === 0 ? (
                    <div className="p-10 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-3">
                            <Info size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No new notifications</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Updates from the admin will appear here.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <div className="flex gap-3">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                    notif.targetGroup === 'HIGH_RISK_STUDENTS' 
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                                    : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                }`}>
                                    {notif.targetGroup === 'HIGH_RISK_STUDENTS' ? <AlertTriangle size={20} /> : <Info size={20} />}
                                </div>
                                <div className="space-y-1 py-0.5">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                                        {notif.message}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1.5">
                                        <span className="flex items-center gap-1">
                                            <User size={10} />
                                            {notif.senderName}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} />
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </span>
                                        {notif.targetGroup === 'HIGH_RISK_STUDENTS' && (
                                            <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold uppercase tracking-tighter">
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700">
                <button className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Clear all <ChevronRight size={12} />
                </button>
            </div>
        </div>
    );
}

function ChevronRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="m9 18 6-6-6-6"/>
        </svg>
    );
}
