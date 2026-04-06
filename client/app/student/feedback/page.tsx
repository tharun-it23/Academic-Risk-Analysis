"use client";

import { useAuth } from '@/context/AuthContext';
import FeedbackForm from '@/components/FeedbackForm';
import { MessageSquare, HelpCircle, ShieldCheck } from 'lucide-react';

export default function StudentFeedbackPage() {
    const { user } = useAuth();

    return (
        <main className="container mx-auto p-4 sm:p-6 space-y-6 max-w-3xl pt-4">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <MessageSquare size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Feedback & Support</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Submit requests, feedback, or report issues</p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HelpCircle size={16} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-white">Need Help?</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Use the form below to report academic issues or request meetings with faculty.</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldCheck size={16} className="text-emerald-500" />
                    </div>
                    <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-white">Anonymous Option</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">You can submit feedback anonymously. Your identity will not be disclosed.</p>
                    </div>
                </div>
            </div>

            {/* Feedback Form in a Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm p-5 sm:p-6">
                <FeedbackForm studentId={user?._id || ''} />
            </div>
        </main>
    );
}
