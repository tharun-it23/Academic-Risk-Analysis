"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ShieldCheck, BookOpen, ArrowRight, ArrowLeft, Lock, User } from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type LoginRole = 'admin' | 'faculty' | 'student';
type ViewMode = 'role-select' | 'login' | 'register';

const ROLE_CONFIG = {
  admin: {
    label: 'Admin Portal',
    description: 'System administration & oversight',
    icon: ShieldCheck,
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    shadow: 'rgba(79,70,229,0.35)',
    accent: '#4f46e5',
    accentLight: 'rgba(79,70,229,0.1)',
    accentBorder: 'rgba(79,70,229,0.25)',
    placeholder: 'e.g. admin',
    tagline: 'Manage the academic risk platform',
    badge: 'Administrator',
    badgeBg: 'rgba(79,70,229,0.12)',
    badgeColor: '#6366f1',
  },
  student: {
    label: 'Student Portal',
    description: 'Access your academic dashboard',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #0d9488, #059669)',
    shadow: 'rgba(13,148,136,0.35)',
    accent: '#0d9488',
    accentLight: 'rgba(13,148,136,0.1)',
    accentBorder: 'rgba(13,148,136,0.25)',
    placeholder: 'e.g. 21CSE001',
    tagline: 'Track your academic progress & risk',
    badge: 'Student',
    badgeBg: 'rgba(13,148,136,0.12)',
    badgeColor: '#0d9488',
  },
  faculty: {
    label: 'Faculty Portal',
    description: 'Manage students & academic risk',
    icon: BookOpen,
    gradient: 'linear-gradient(135deg, #d97706, #b45309)',
    shadow: 'rgba(217,119,6,0.35)',
    accent: '#d97706',
    accentLight: 'rgba(217,119,6,0.1)',
    accentBorder: 'rgba(217,119,6,0.25)',
    placeholder: 'e.g. faculty01',
    tagline: 'Monitor and support at-risk students',
    badge: 'Faculty',
    badgeBg: 'rgba(217,119,6,0.12)',
    badgeColor: '#d97706',
  },
} as const;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberMeError, setRememberMeError] = useState(false);
  const [view, setView] = useState<ViewMode>('role-select');
  const [selectedRole, setSelectedRole] = useState<LoginRole | null>(null);
  const { login, googleLogin, register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<LoginRole | null>(null);
  const googleInitialized = useRef(false);

  // Register-specific state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regRememberMe, setRegRememberMe] = useState(false);
  const [regRememberMeError, setRegRememberMeError] = useState(false);
  const [regPasswordVisible, setRegPasswordVisible] = useState(false);
  const [regSuccess, setRegSuccess] = useState('');

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleCredential = useCallback(async (response: { credential: string }) => {
    setError('');
    setGoogleLoading(true);
    const res = await googleLogin(response.credential);
    setGoogleLoading(false);
    if (res.success) {
      if (res.role === 'admin') router.push('/admin');
      else if (res.role === 'faculty') router.push('/faculty');
      else router.push('/student');
    } else {
      setError(res.msg || 'Google sign-in failed. Please try again.');
    }
  }, [googleLogin, router]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !clientId || view === 'role-select' || !selectedRole) return;

    const initGoogle = () => {
      if (!window.google) return;

      // Only call initialize() once per login session to avoid multiple-init warnings
      if (!googleInitialized.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
          auto_select: false,
        });
        googleInitialized.current = true;
      }

      const btn = document.getElementById('google-signin-btn');
      if (btn) {
        // GSI requires a pixel number for width, not a percentage string
        const btnWidth = Math.min(btn.offsetWidth || 360, 400);
        window.google.accounts.id.renderButton(btn, {
          theme: 'outline',
          size: 'large',
          width: btnWidth,
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      // Avoid duplicate script tags
      if (!document.querySelector('script[src*="accounts.google.com/gsi"]')) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.head.appendChild(script);
      } else {
        // Script already loading, poll for google object
        const interval = setInterval(() => {
          if (window.google) {
            clearInterval(interval);
            initGoogle();
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
  }, [mounted, clientId, view, selectedRole, handleGoogleCredential]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rememberMe) {
      setRememberMeError(true);
      setError('Please check "Remember me" to continue.');
      return;
    }

    setRememberMeError(false);
    setIsLoading(true);
    const res = await login(username, password);
    setIsLoading(false);
    if (res.success) {
      if (res.role === 'admin') router.push('/admin');
      else if (res.role === 'faculty') router.push('/faculty');
      else router.push('/student');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleRoleSelect = (role: LoginRole) => {
    setSelectedRole(role);
    setError('');
    setUsername('');
    setPassword('');
    setView('login');
  };

  const handleBack = () => {
    setView('role-select');
    setSelectedRole(null);
    setError('');
    setUsername('');
    setPassword('');
    setRememberMe(false);
    setRememberMeError(false);
    googleInitialized.current = false; // allow re-init on next login view
  };

  const handleGoRegister = () => {
    setView('register');
    setError('');
    setRegName('');
    setRegUsername('');
    setRegPassword('');
    setRegConfirm('');
    setRegRememberMe(false);
    setRegRememberMeError(false);
    setRegSuccess('');
  };

  const handleGoLogin = () => {
    setView('login');
    setError('');
    setRegSuccess('');
    setUsername('');
    setPassword('');
    setRememberMe(false);
    setRememberMeError(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRegSuccess('');

    if (!regRememberMe) {
      setRegRememberMeError(true);
      setError('Please check "Remember me" to continue.');
      return;
    }
    setRegRememberMeError(false);

    if (regPassword !== regConfirm) {
      setError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const res = await register(regUsername, regPassword, regName || regUsername);
    setIsLoading(false);

    if (res.success) {
      // Redirect based on role after register+auto-login
      if ((res as any).role === 'admin') router.push('/admin');
      else if ((res as any).role === 'faculty') router.push('/faculty');
      else router.push('/student');
    } else {
      setError(res.msg || 'Registration failed. Please try again.');
    }
  };

  if (!mounted) return null;

  const cfg = selectedRole ? ROLE_CONFIG[selectedRole] : null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '-12%', left: '-8%', width: '520px', height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.09) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-10%', width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '55%', width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }} />
      </div>

      <div className="w-full max-w-[440px] animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: cfg ? cfg.gradient : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: `0 8px 28px ${cfg ? cfg.shadow : 'rgba(79,70,229,0.3)'}`,
              transition: 'background 0.4s, box-shadow 0.4s',
            }}
          >
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Academic Risk System
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Intelligence Platform</p>
        </div>

        {/* ── Card ── */}
        <div
          className="rounded-2xl shadow-xl"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            overflow: 'hidden',
          }}
        >
          {/* ── Role Selection View ── */}
          {view === 'role-select' && (
            <div className="p-7">
              <div className="mb-7 text-center">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Welcome Back
                </h2>
                <p className="text-sm text-slate-400 mt-1">Choose your portal to continue</p>
              </div>

              <div className="flex flex-col gap-4">
                {(['admin', 'faculty', 'student'] as LoginRole[]).map((role) => {
                  const rc = ROLE_CONFIG[role];
                  const Icon = rc.icon;
                  const isHovered = hoveredRole === role;
                  return (
                    <button
                      key={role}
                      id={`role-${role}-btn`}
                      onClick={() => handleRoleSelect(role)}
                      onMouseEnter={() => setHoveredRole(role)}
                      onMouseLeave={() => setHoveredRole(null)}
                      className="group w-full text-left rounded-xl p-5 transition-all duration-200"
                      style={{
                        border: isHovered
                          ? `1.5px solid ${rc.accent}`
                          : '1.5px solid var(--card-border)',
                        background: isHovered ? rc.accentLight : 'transparent',
                        cursor: 'pointer',
                        transform: isHovered ? 'translateY(-2px)' : 'none',
                        boxShadow: isHovered ? `0 8px 24px ${rc.shadow}` : 'none',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isHovered ? rc.gradient : rc.accentLight,
                            transition: 'background 0.2s',
                          }}
                        >
                          <Icon
                            size={22}
                            style={{ color: isHovered ? '#fff' : rc.accent }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                              {rc.label}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: rc.badgeBg, color: rc.badgeColor }}
                            >
                              {rc.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{rc.tagline}</p>
                        </div>
                        <div style={{ color: isHovered ? rc.accent : 'var(--card-border)', transition: 'color 0.2s' }}>
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-center text-slate-400 mt-6">
                Secure, role-based access control
              </p>
            </div>
          )}

          {/* ── Login Form View ── */}
          {view === 'login' && cfg && (
            <div>
              {/* Colored header strip */}
              <div
                className="px-7 py-5"
                style={{
                  background: cfg.gradient,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative circle */}
                <div style={{
                  position: 'absolute', right: '-30px', top: '-30px',
                  width: '120px', height: '120px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{
                  position: 'absolute', right: '20px', bottom: '-40px',
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                }} />

                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white mb-4 transition-colors"
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <ArrowLeft size={14} /> Back to portal selection
                </button>

                <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.18)' }}
                  >
                    {selectedRole === 'admin'
                      ? <ShieldCheck size={20} className="text-white" />
                      : selectedRole === 'faculty'
                      ? <BookOpen size={20} className="text-white" />
                      : <GraduationCap size={20} className="text-white" />
                    }
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">{cfg.label}</h2>
                    <p className="text-xs text-white/65">{cfg.description}</p>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div className="px-7 py-6">
                {error && (
                  <div
                    className="animate-shake mb-4 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
                  >
                    {error}
                  </div>
                )}

                {/* Google Sign-In — all portals */}
                {clientId && cfg && (
                  <div className="mb-5">
                    {googleLoading ? (
                      <div
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium border"
                        style={{ borderColor: cfg.accentBorder, color: 'var(--foreground)', background: cfg.accentLight }}
                      >
                        <span
                          className="w-4 h-4 border-2 rounded-full animate-spin"
                          style={{ borderColor: `${cfg.accent}40`, borderTopColor: cfg.accent }}
                        />
                        Continuing with Google...
                      </div>
                    ) : (
                      <div id="google-signin-btn" className="w-full flex justify-center" />
                    )}
                    <div className="flex items-center gap-3 mt-4 mb-1">
                      <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
                      <span className="text-xs text-slate-400 font-medium">or use credentials</span>
                      <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username field */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--foreground)', opacity: 0.6 }}
                    >
                      Username
                    </label>
                    <div className="relative">
                      <div
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: cfg.accent }}
                      >
                        <User size={16} />
                      </div>
                      <input
                        id="username-input"
                        type="text"
                        placeholder={cfg.placeholder}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--background)',
                          border: `1.5px solid var(--card-border)`,
                          color: 'var(--foreground)',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = cfg.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.accentLight}`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--foreground)', opacity: 0.6 }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: cfg.accent }}
                      >
                        <Lock size={16} />
                      </div>
                      <input
                        id="password-input"
                        type={isVisible ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-12 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: 'var(--background)',
                          border: '1.5px solid var(--card-border)',
                          color: 'var(--foreground)',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = cfg.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.accentLight}`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                      >
                        {isVisible ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {/* Remember / Forgot */}
                  <div className="flex items-center justify-between text-xs">
                    <label
                      className="flex items-center gap-2 cursor-pointer select-none"
                      style={{ color: rememberMeError ? '#ef4444' : 'rgb(100 116 139)' }}
                    >
                      <input
                        id="remember-me-checkbox"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => {
                          setRememberMe(e.target.checked);
                          if (e.target.checked) {
                            setRememberMeError(false);
                            setError('');
                          }
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300"
                        style={{ accentColor: cfg.accent }}
                      />
                      <span style={{
                        fontWeight: rememberMeError ? 600 : 400,
                        transition: 'color 0.2s',
                      }}>
                        Remember me
                        {rememberMeError && ' ← required'}
                      </span>
                    </label>
                    <button type="button" className="font-medium hover:underline" style={{ color: cfg.accent }}>
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                    id="sign-in-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: cfg.gradient,
                      boxShadow: `0 4px 18px ${cfg.shadow}`,
                    }}
                  >
                    {isLoading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                    ) : (
                      <>Sign in as {cfg.badge} <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>

                {/* Info note */}
                <div
                  className="mt-5 px-3 py-2.5 rounded-lg text-xs"
                  style={{ background: cfg.accentLight, border: `1px solid ${cfg.accentBorder}`, color: cfg.accent }}
                >
                  <span className="font-medium">
                    {selectedRole === 'admin'
                      ? '🛡 Admin credentials are required for system access.'
                      : selectedRole === 'faculty'
                      ? '📚 Use your assigned faculty username to sign in.'
                      : '🎓 Use your student ID as username.'}
                  </span>
                </div>

                {/* Create account link — student & faculty only */}
                {selectedRole !== 'admin' && (
                  <p className="text-center text-xs text-slate-400 mt-5">
                    Don&apos;t have an account?{' '}
                    <button
                      id="go-register-btn"
                      type="button"
                      onClick={handleGoRegister}
                      className="font-semibold hover:underline"
                      style={{ color: cfg.accent }}
                    >
                      Create Account
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Register Form View ── */}
          {view === 'register' && cfg && selectedRole !== 'admin' && (
            <div>
              {/* Colored header strip */}
              <div
                className="px-7 py-5"
                style={{ background: cfg.gradient, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', right: '20px', bottom: '-40px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                <button
                  onClick={handleGoLogin}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white mb-4 transition-colors"
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <ArrowLeft size={14} /> Back to sign in
                </button>

                <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    {selectedRole === 'faculty' ? <BookOpen size={20} className="text-white" /> : <GraduationCap size={20} className="text-white" />}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Create {cfg.badge} Account</h2>
                    <p className="text-xs text-white/65">Register to access {cfg.label}</p>
                  </div>
                </div>
              </div>

              {/* Register form body */}
              <div className="px-7 py-6">
                {error && (
                  <div
                    className="animate-shake mb-4 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
                  >
                    {error}
                  </div>
                )}
                {regSuccess && (
                  <div
                    className="mb-4 px-4 py-2.5 rounded-lg text-sm font-medium"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', color: '#059669' }}
                  >
                    {regSuccess}
                  </div>
                )}

                {/* Google Sign-In — all portals */}
                {clientId && cfg && (
                  <div className="mb-5">
                    {googleLoading ? (
                      <div
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium border"
                        style={{ borderColor: cfg.accentBorder, color: 'var(--foreground)', background: cfg.accentLight }}
                      >
                        <span
                          className="w-4 h-4 border-2 rounded-full animate-spin"
                          style={{ borderColor: `${cfg.accent}40`, borderTopColor: cfg.accent }}
                        />
                        Continuing with Google...
                      </div>
                    ) : (
                      <div id="google-signin-btn" className="w-full flex justify-center" />
                    )}
                    <div className="flex items-center gap-3 mt-4 mb-1">
                      <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
                      <span className="text-xs text-slate-400 font-medium">or register manually</span>
                      <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} />
                    </div>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Full Name</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: cfg.accent }}><User size={16} /></div>
                      <input
                        id="reg-name-input"
                        type="text"
                        placeholder="Your full name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ background: 'var(--background)', border: '1.5px solid var(--card-border)', color: 'var(--foreground)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = cfg.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.accentLight}`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Username</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: cfg.accent }}><User size={16} /></div>
                      <input
                        id="reg-username-input"
                        type="text"
                        placeholder={cfg.placeholder}
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ background: 'var(--background)', border: '1.5px solid var(--card-border)', color: 'var(--foreground)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = cfg.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.accentLight}`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Password</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: cfg.accent }}><Lock size={16} /></div>
                      <input
                        id="reg-password-input"
                        type={regPasswordVisible ? 'text' : 'password'}
                        placeholder="Min. 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-12 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ background: 'var(--background)', border: '1.5px solid var(--card-border)', color: 'var(--foreground)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = cfg.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.accentLight}`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                      <button type="button" onClick={() => setRegPasswordVisible(!regPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
                        {regPasswordVisible ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Confirm Password</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: cfg.accent }}><Lock size={16} /></div>
                      <input
                        id="reg-confirm-input"
                        type={regPasswordVisible ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ background: 'var(--background)', border: '1.5px solid var(--card-border)', color: 'var(--foreground)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = cfg.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.accentLight}`; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center text-xs">
                    <label
                      className="flex items-center gap-2 cursor-pointer select-none"
                      style={{ color: regRememberMeError ? '#ef4444' : 'rgb(100 116 139)' }}
                    >
                      <input
                        id="reg-remember-me"
                        type="checkbox"
                        checked={regRememberMe}
                        onChange={(e) => {
                          setRegRememberMe(e.target.checked);
                          if (e.target.checked) { setRegRememberMeError(false); setError(''); }
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300"
                        style={{ accentColor: cfg.accent }}
                      />
                      <span style={{ fontWeight: regRememberMeError ? 600 : 400, transition: 'color 0.2s' }}>
                        Remember me{regRememberMeError && ' ← required'}
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    id="create-account-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: cfg.gradient, boxShadow: `0 4px 18px ${cfg.shadow}` }}
                  >
                    {isLoading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                    ) : (
                      <>Create {cfg.badge} Account <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>

                {/* Already have account */}
                <p className="text-center text-xs text-slate-400 mt-5">
                  Already have an account?{' '}
                  <button
                    id="go-signin-btn"
                    type="button"
                    onClick={handleGoLogin}
                    className="font-semibold hover:underline"
                    style={{ color: cfg.accent }}
                  >
                    Sign in
                  </button>
                </p>
              </div>
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
