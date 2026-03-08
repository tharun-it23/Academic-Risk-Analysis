"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Moon, Sun } from 'lucide-react';
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { Card } from "@heroui/react";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await login(username, password);
    if (res.success) {
      if (res.role === 'admin') router.push('/admin');
      else if (res.role === 'faculty') router.push('/faculty');
      else router.push('/student');
    } else {
      setError(res.msg || 'Login failed');
    }
  };
  /* Theme Toggle in top-right corner */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4 transition-colors duration-300 relative">

      <Card className="w-full max-w-md p-4">
        <Card.Header className="flex flex-col gap-3 items-center text-center">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 w-24 h-24 rounded-2xl flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400">
            <GraduationCap size={48} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Academic Risk Analysis</h1>
            <p className="text-slate-600 dark:text-slate-300">Sign in to continue</p>
          </div>
        </Card.Header>
        <Card.Content>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              aria-label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              aria-label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full font-semibold shadow-md"
              size="lg"
            >
              Sign In
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
