"use client";

import { useEffect, useState } from 'react';
import { Dropdown } from '@heroui/react';
import { Bell, Info, AlertTriangle, Clock } from 'lucide-react';
import api from '@/config/api';
import NextLink from 'next/link';

interface Notification {
    id: number;
    message: string;
    targetGroup: string;
    senderName: string;
    createdAt: string;
}

export const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchNotifications();
        // Refresh every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.length;

    return (
        <Dropdown>
            <Dropdown.Trigger className="outline-none cursor-pointer">
                <div className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    )}
                </div>
            </Dropdown.Trigger>
            <Dropdown.Popover>
                <div className="w-[320px] sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Notifications</h3>
                            <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                {unreadCount} NEW
                            </span>
                        </div>
                        <button className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                            Mark all read
                        </button>
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50">
                        {loading ? (
                            <div className="p-12 flex flex-col items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[11px] text-slate-400">Checking for alerts...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                                    <Bell size={24} />
                                </div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">All caught up!</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No new notifications at the moment.</p>
                            </div>
                        ) : (
                            notifications.slice(0, 8).map((notif) => (
                                <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
                                    <div className="flex gap-4">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                            notif.targetGroup === 'HIGH_RISK_STUDENTS' 
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-sm' 
                                            : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        }`}>
                                            {notif.targetGroup === 'HIGH_RISK_STUDENTS' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0 py-0.5">
                                            <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-[1.4] line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 uppercase tracking-tight">
                                                    <Clock size={10} />
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </span>
                                                {notif.targetGroup === 'HIGH_RISK_STUDENTS' && (
                                                    <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-tighter">
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

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                         <NextLink href="#" className="flex items-center justify-center gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors py-1 group">
                            View All Activity
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                         </NextLink>
                    </div>
                </div>
            </Dropdown.Popover>
        </Dropdown>
    );
};
