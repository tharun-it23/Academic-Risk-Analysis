"use client";

import { useState, FormEvent } from 'react';
import { Input } from "@heroui/react";
import { Mail, AlertCircle, CheckCircle2, Send, Users, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminToolsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [audience, setAudience] = useState("all");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);

    if (!authLoading && !user) {
        router.push('/');
        return null;
    }

    const handleSendNotification = (e: FormEvent) => {
        e.preventDefault();
        if (!subject || !message) return;

        setIsSending(true);
        // Mock a network request to send notifications
        setTimeout(() => {
            setIsSending(false);
            setSendSuccess(true);
            setSubject("");
            setMessage("");

            // Clear success message after 5 seconds
            setTimeout(() => setSendSuccess(false), 5000);
        }, 1500);
    };

    return (
        <main className="container mx-auto p-4 sm:p-6 space-y-6 max-w-5xl pt-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Mail size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tools & Notifications</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Send system-wide alerts and emails to students or faculty</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm lg:col-span-2">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Compose Notification</h2>
                        
                        {sendSuccess && (
                            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-900/20 dark:border-emerald-800/40 flex items-start gap-3">
                                <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Notification Sent Successfully</h4>
                                    <p className="text-sm text-green-600 dark:text-green-400">The notification has been queued for delivery to the selected audience.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSendNotification} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Target Audience</label>
                                <div className="relative">
                                    <select
                                        value={audience}
                                        onChange={(e) => setAudience(e.target.value)}
                                        className="w-full appearance-none px-3 py-2.5 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors cursor-pointer"
                                    >
                                        <option value="all">All Students</option>
                                        <option value="high_risk">⚠ High Risk Students</option>
                                        <option value="faculty">All Faculty</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Subject Line</label>
                                <Input
                                    placeholder="Enter notification subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2 flex flex-col">
                                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Message Content</label>
                                <textarea
                                    className="w-full min-h-[150px] p-3 rounded-xl border border-default-200 bg-default-100 dark:bg-default-50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSending || !subject || !message}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    {isSending ? (
                                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</>
                                    ) : (
                                        <><Send size={16} /> Send Broadcast</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Tips & Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                    <AlertCircle size={16} className="text-amber-500" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-800 dark:text-white">Best Practices</h3>
                            </div>
                        </div>
                        <div className="p-4 space-y-2.5">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100/60 dark:border-blue-800/30">
                                <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">1</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Keep subject lines <span className="font-semibold text-slate-700 dark:text-slate-300">concise and actionable</span> (e.g., &quot;Action Required: Academic Advising&quot;).
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100/60 dark:border-amber-800/30">
                                <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">2</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    When messaging <span className="font-semibold text-slate-700 dark:text-slate-300">High Risk Students</span>, include links to support resources or scheduling tools.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/60 dark:bg-rose-900/10 border border-rose-100/60 dark:border-rose-800/30">
                                <div className="w-6 h-6 rounded-md bg-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">3</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Emails are delivered <span className="font-semibold text-slate-700 dark:text-slate-300">immediately</span>. Ensure content is finalized before sending.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg shadow-blue-500/20 overflow-hidden relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full"></div>
                        <div className="p-6 space-y-4 relative z-10">
                            <div className="p-3 bg-white/20 w-max rounded-lg">
                                <Users size={24} />
                            </div>
                            <h3 className="text-lg font-bold">Reach Your Students</h3>
                            <p className="text-sm text-blue-100">
                                Did you know? Targeted notifications increase student engagement with support services by up to 45%.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
