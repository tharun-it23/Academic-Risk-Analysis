"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input, Label } from "@heroui/react";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [error, setError] = useState('');
  const [view, setView] = useState<'login' | 'register'>('login');
  const { login, register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const res = await login(username, password);
    setIsLoading(false);
    if (res.success) {
      if (res.role === 'admin') router.push('/admin');
      else if (res.role === 'faculty') router.push('/faculty');
      else router.push('/student');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const res = await register(username, password, name);
    setIsLoading(false);
    if (res.success) {
      router.push('/student');
    } else {
      setError(res.msg || 'Registration failed. Please try again.');
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>

      <div className="w-full max-w-[380px] animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}>
            <GraduationCap size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Academic Risk System
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Intelligence Platform</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7 shadow-lg"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>

          {/* ── Login View ── */}
          {view === 'login' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Sign In</h2>
                <p className="text-sm text-slate-400 mt-0.5">Enter your credentials to continue</p>
              </div>

              {error && (
                <div className="animate-shake mb-4 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    placeholder="e.g. 21CSE001"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    placeholder="••••••••"
                    type={isVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    Remember me
                  </label>
                  <button type="button" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" /> Signing in...</>
                  ) : (
                    <>Sign In <ArrowRight size={15} /></>
                  )}
                </button>
              </form>

              <p className="text-xs text-center text-slate-400 mt-5">
                Need an account?{' '}
                <button onClick={() => { setView('register'); setError(''); }}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                  Request access
                </button>
              </p>
            </div>
          )}

          {/* ── Register View ── */}
          {view === 'register' && (
            <div>
              <button
                type="button"
                onClick={() => { setView('login'); setError(''); }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-5 flex items-center gap-1 transition-colors"
              >
                ← Back to Sign In
              </button>

              <div className="mb-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Request Access</h2>
                <p className="text-sm text-slate-400 mt-0.5">Submit a registration request</p>
              </div>

              <div className="mb-4 px-3 py-2.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400"
                style={{ background: 'rgba(79,70,229,0.07)', border: '1px solid rgba(79,70,229,0.18)' }}>
                Create a new account to access the platform.
              </div>

              {error && (
                <div className="animate-shake mb-4 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input placeholder="e.g. 21CSE001" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input placeholder="••••••••" type={isVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" /> Registering...</>
                  ) : (
                    <>Create Account <ArrowRight size={15} /></>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          © 2026 Academic Risk Analysis System
        </p>
      </div>
    </div>
  );
}
