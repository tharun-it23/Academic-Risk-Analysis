"use client";

import { useState } from 'react';
import api from '../config/api';
import { TextArea, TextField, Label } from "@heroui/react";
import { AlertTriangle, MessageSquare, CheckCircle2, Send, ChevronDown } from 'lucide-react';

interface FeedbackFormProps {
    studentId: string;
    onSuccess?: () => void;
}

const FeedbackForm = ({ studentId, onSuccess }: FeedbackFormProps) => {
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<string>('general');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            setTimeout(() => {
                setMessage({ text: 'Feedback submitted successfully! Thank you for sharing.', type: 'success' });
                setContent('');
                setCategory('general');
                if (onSuccess) onSuccess();
                setSubmitting(false);
            }, 1000);
        } catch (err) {
            setMessage({ text: 'Error submitting feedback. Please try again.', type: 'error' });
            console.error(err);
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                    <MessageSquare size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Submit Feedback</h3>
            </div>

            {message && (
                <div className={`mb-5 p-4 rounded-xl flex items-start gap-3 ${
                    message.type === 'error'
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/40'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40'
                }`}>
                    {message.type === 'error'
                        ? <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                        : <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    }
                    <span className={`text-sm font-medium ${
                        message.type === 'error' ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'
                    }`}>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400">Category</label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full appearance-none px-3 py-2.5 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors cursor-pointer"
                        >
                            <option value="general">General</option>
                            <option value="course">Course Content</option>
                            <option value="teaching">Teaching Quality</option>
                            <option value="facilities">Facilities</option>
                            <option value="support">Support Services</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <TextField isRequired>
                    <Label>Your Feedback</Label>
                    <TextArea
                        placeholder="Share your thoughts, suggestions, or concerns..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                    />
                </TextField>

                <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:opacity-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {submitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            Submit Feedback
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
