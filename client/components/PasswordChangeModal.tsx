"use client";

import { useState } from 'react';
import { Button, Modal, Label } from "@heroui/react";
import { Input } from "@heroui/react";
import { Lock, Check } from 'lucide-react';
import api from '@/config/api';

interface PasswordChangeModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export const PasswordChangeModal = ({ isOpen, onOpenChange }: PasswordChangeModalProps) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (onClose: () => void) => {
        setError('');
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
            setLoading(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.msg || "Failed to change password. Please check your current password.");
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop />
            <Modal.Container>
                <Modal.Dialog>
                    {({ close }) => (
                        <>
                            <Modal.Header className="flex flex-col gap-1">Change Password</Modal.Header>
                            <Modal.Body>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Current Password</Label>
                                        <Input
                                            aria-label="Current Password"
                                            placeholder="Enter current password"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input
                                            aria-label="New Password"
                                            placeholder="Enter new password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm New Password</Label>
                                        <Input
                                            aria-label="Confirm New Password"
                                            placeholder="Confirm new password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {error && (
                                            <p className="text-sm text-red-500 mt-1">{error}</p>
                                        )}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="ghost" onPress={close}>
                                    Cancel
                                </Button>
                                <Button
                                    onPress={() => handleSubmit(close)}
                                    isPending={loading}
                                    isDisabled={!currentPassword || !newPassword || !confirmPassword}
                                >
                                    Update Password
                                </Button>
                            </Modal.Footer>
                        </> 
                    )}
                </Modal.Dialog>
            </Modal.Container>
        </Modal>
    );
};
