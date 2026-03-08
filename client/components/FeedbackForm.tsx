"use client";

import { useState } from 'react';
import api from '../config/api';
import { Card, Input, TextArea, TextField, Button, Select, Label, ListBox } from "@heroui/react";
import { AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';

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
            // Mock API call for now if endpoint not ready
            // await api.post('/analytics/feedback', { studentId, content, category });

            // Simulating success
            setTimeout(() => {
                setMessage({ text: 'Feedback submitted successfully!', type: 'success' });
                setContent('');
                setCategory('general');
                if (onSuccess) onSuccess();
                setSubmitting(false);
            }, 1000);

        } catch (err) {
            setMessage({ text: 'Error submitting feedback', type: 'error' });
            console.error(err);
            setSubmitting(false);
        }
    };

    return (
        <Card className="shadow-sm h-full">
            <Card.Header className="flex gap-2">
                <MessageSquare size={20} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Submit Feedback</h3>
            </Card.Header>
            <Card.Content>
                {message && (
                    <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                        {message.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                        <span className="text-sm">{message.text}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        selectedKey={category}
                        onSelectionChange={(key) => setCategory(key as string || "general")}
                    >
                        <Label>Category</Label>
                        <Select.Trigger>
                            <Select.Value>{category.charAt(0).toUpperCase() + category.slice(1)}</Select.Value>
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                <ListBox.Item id="general" textValue="General">General</ListBox.Item>
                                <ListBox.Item id="course" textValue="Course Content">Course Content</ListBox.Item>
                                <ListBox.Item id="teaching" textValue="Teaching Quality">Teaching Quality</ListBox.Item>
                                <ListBox.Item id="facilities" textValue="Facilities">Facilities</ListBox.Item>
                                <ListBox.Item id="support" textValue="Support Services">Support Services</ListBox.Item>
                            </ListBox>
                        </Select.Popover>
                    </Select>

                    <TextField isRequired>
                        <Label>Your Feedback</Label>
                        <TextArea
                            placeholder="Share your thoughts, suggestions, or concerns..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                        />
                    </TextField>

                    <Button
                        type="submit"
                        color="primary"
                        isLoading={submitting}
                        className="w-full"
                    >
                        Submit Feedback
                    </Button>
                </form>
            </Card.Content>
        </Card>
    );
};

export default FeedbackForm;
