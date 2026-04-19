"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../config/api';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    username: string;
    role: 'admin' | 'faculty' | 'student';
    name?: string;
    email?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; role?: string; msg?: string }>;
    googleLogin: (credential: string) => Promise<{ success: boolean; role?: string; msg?: string }>;
    register: (username: string, password: string, name?: string) => Promise<{ success: boolean; msg?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            return { success: true, role: res.data.user.role };
        } catch (err: any) {
            return { success: false, msg: err.response?.data?.msg || 'Login failed' };
        }
    };

    const googleLogin = async (credential: string) => {
        try {
            const res = await api.post('/auth/google', { credential });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            return { success: true, role: res.data.user.role };
        } catch (err: any) {
            return { success: false, msg: err.response?.data?.msg || 'Google login failed' };
        }
    };

    const register = async (username: string, password: string, name?: string) => {
        try {
            await api.post('/auth/register', { username, password, name });
            return await login(username, password);
        } catch (err: any) {
            return { success: false, msg: err.response?.data?.msg || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
