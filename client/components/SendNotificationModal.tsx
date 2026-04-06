"use client";

import { useState } from 'react';
import {
    Modal,
    Button,
    Input,
    Label,
} from "@heroui/react";
import { Send, Bell, ChevronDown } from 'lucide-react';
import api from '@/config/api';

interface SendNotificationModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onSuccess?: () => void;
}

export const SendNotificationModal = ({ isOpen, onOpenChange, onSuccess }: SendNotificationModalProps) => {
    const [message, setMessage] = useState('');
    const [targetGroup, setTargetGroup] = useState('ALL_STUDENTS');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (onClose: () => void) => {
        if (!message) return;
        setLoading(true);
        try {
            await api.post('/notifications', { message, targetGroup });
            setLoading(false);
            setMessage('');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to send notification:", error);
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog>
                        <Modal.Header className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Bell className="text-indigo-500" size={20} />
                                <span>Send Targeted Notification</span>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Audience</Label>
                                <div className="relative">
                                    <select
                                        value={targetGroup}
                                        onChange={(e) => setTargetGroup(e.target.value)}
                                        className="w-full appearance-none px-3 py-2.5 pr-8 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors cursor-pointer"
                                    >
                                        <option value="ALL_STUDENTS">All Students</option>
                                        <option value="HIGH_RISK_STUDENTS">High-Risk Students Only</option>
                                        <option value="ALL_FACULTY">All Faculty Members</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Message Content</Label>
                                <textarea
                                    className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all min-h-[120px]"
                                    placeholder="Type your important update here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button slot="close" variant="secondary">
                                Cancel
                            </Button>
                            <Button
                                slot="close"
                                onPress={() => handleSubmit(() => onOpenChange())}
                                isPending={loading}
                            >
                                <Send size={16} />
                                Send Broadcast
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};
