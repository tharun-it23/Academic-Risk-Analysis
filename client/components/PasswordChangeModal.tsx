"use client";

import { useState } from 'react';
import { Button, Modal } from "@heroui/react";
import { Input } from "@heroui/react";
import { Lock, Check } from 'lucide-react';

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
        // Simulate API call
        setTimeout(() => {
            console.log("Password changed");
            setLoading(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
            <Modal.Container>
                {(onClose: () => void) => (
                    <>
                        <Modal.Header className="flex flex-col gap-1">Change Password</Modal.Header>
                        <Modal.Content>
                            <Input
                                label="Current Password"
                                placeholder="Enter current password"
                                type="password"
                                value={currentPassword}
                                onValueChange={setCurrentPassword}
                                startContent={<Lock size={16} className="text-slate-400" />}
                            />
                            <Input
                                label="New Password"
                                placeholder="Enter new password"
                                type="password"
                                value={newPassword}
                                onValueChange={setNewPassword}
                                startContent={<Lock size={16} className="text-slate-400" />}
                            />
                            <Input
                                label="Confirm New Password"
                                placeholder="Confirm new password"
                                type="password"
                                value={confirmPassword}
                                onValueChange={setConfirmPassword}
                                errorMessage={error}
                                isInvalid={!!error}
                                startContent={<Lock size={16} className="text-slate-400" />}
                            />
                        </Modal.Content>
                        <Modal.Footer>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => handleSubmit(onClose)}
                                isLoading={loading}
                                isDisabled={!currentPassword || !newPassword || !confirmPassword}
                            >
                                Update Password
                            </Button>
                        </Modal.Footer>
                    </> 
                )}
            </Modal.Container>
        </Modal>
    );
};
