"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Dropdown, Label, Avatar } from "@heroui/react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Lock, ChevronRight, Bell } from 'lucide-react';
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { PasswordChangeModal } from "./PasswordChangeModal";
import { ThemeSwitch } from "./ThemeSwitch";
import { NotificationBell } from "./NotificationBell";
import { useDisclosure } from "@heroui/use-disclosure";
import NextLink from "next/link";
import clsx from "clsx";

interface MenuItem {
    label: string;
    path?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

interface DashboardNavbarProps {
    title: string;
    menuItems?: MenuItem[];
    children?: React.ReactNode;
}

export const DashboardNavbar = ({ title, menuItems = [], children }: DashboardNavbarProps) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const passwordModal = useDisclosure();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const isActive = (itemPath?: string) => {
        if (!itemPath) return false;
        if (itemPath === '/student' || itemPath === '/admin' || itemPath === '/faculty') {
            return pathname === itemPath;
        }
        return pathname === itemPath || pathname.startsWith(itemPath + '/');
    };

    const initials = (user?.name || user?.username || 'U').substring(0, 2).toUpperCase();
    const displayName = user?.name || user?.username || 'User';
    const role = user?.role || 'Member';

    return (
        <div className="flex h-[100dvh] overflow-hidden" style={{ background: 'var(--background)' }}>

            {/* ── Desktop Sidebar ── */}
            <aside className="hidden sm:flex flex-col w-[240px] lg:w-[260px] shrink-0 z-20"
                style={{
                    background: 'var(--sidebar-bg)',
                    borderRight: '1px solid var(--sidebar-border)',
                }}>

                {/* Brand */}
                <div className="h-[60px] flex items-center px-5 shrink-0" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                            style={{ background: '#e5e5e5' }}>
                            <span className="text-white text-xs font-bold">{title.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>
                                {title}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate capitalize">{role} Portal</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-hide">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-2">
                        Navigation
                    </p>
                    {menuItems.map((item, index) => {
                        const active = isActive(item.path);
                        return (
                            <NextLink
                                key={index}
                                href={item.path || '#'}
                                className={clsx(
                                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                                    active
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                                )}
                                style={active ? {
                                    background: 'rgba(79, 70, 229, 0.08)',
                                } : undefined}
                                onClick={item.onClick ? (e) => {
                                    if (!item.path) e.preventDefault();
                                    item.onClick!();
                                } : undefined}
                            >
                                {active && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-indigo-500" />
                                )}
                                <span className={clsx(
                                    "transition-colors flex-shrink-0",
                                    active
                                        ? "text-indigo-500 dark:text-indigo-400"
                                        : "text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400"
                                )}>
                                    {item.icon}
                                </span>
                                <span className="flex-1">{item.label}</span>
                                {active && <ChevronRight size={14} className="text-indigo-400 opacity-60" />}
                            </NextLink>
                        );
                    })}
                </nav>

                {/* User Footer */}
                <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1"
                        style={{ background: 'rgba(79, 70, 229, 0.05)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: '#e5e5e5' }}>
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{displayName}</p>
                            <p className="text-xs text-slate-400 capitalize truncate">{role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-500 dark:hover:text-red-400 w-full text-left transition-colors group"
                        style={undefined}
                    >
                        <LogOut size={15} className="group-hover:scale-105 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Bar */}
                <Navbar
                    onMenuOpenChange={setIsMenuOpen}
                    maxWidth="full"
                    className="h-[60px] shrink-0"
                    style={{
                        background: 'var(--sidebar-bg)',
                        borderBottom: '1px solid var(--sidebar-border)',
                        zIndex: 50,
                        position: 'sticky',
                        top: 0,
                    }}
                    classNames={{ wrapper: "px-4 sm:px-6 h-[60px] max-w-none" }}
                >
                    {/* Mobile toggle */}
                    <NavbarContent className="gap-3 sm:hidden">
                        <NavbarMenuToggle
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="text-slate-500 dark:text-slate-400"
                        />
                        <NavbarBrand className="gap-2">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center"
                                style={{ background: '#e5e5e5' }}>
                                <span className="text-white text-xs font-bold">{title.charAt(0)}</span>
                            </div>
                            <p className="font-semibold text-sm text-slate-800 dark:text-white truncate max-w-[140px]">{title}</p>
                        </NavbarBrand>
                    </NavbarContent>

                    {/* Desktop: breadcrumb / page info area */}
                    <NavbarContent className="hidden sm:flex" justify="start">
                        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                            <span className="text-slate-800 dark:text-slate-200 font-medium">
                                {menuItems.find(m => isActive(m.path))?.label || 'Dashboard'}
                            </span>
                        </div>
                    </NavbarContent>

                    <NavbarContent justify="end">
                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <NotificationBell />
                            <ThemeSwitch />
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
                            <Dropdown>
                                <Dropdown.Trigger className="outline-none cursor-pointer">
                                    <div className="flex items-center gap-2.5 pl-1">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                            style={{ background: '#e5e5e5' }}>
                                            {initials}
                                        </div>
                                        <div className="hidden sm:flex flex-col items-start max-w-[120px]">
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
                                                {displayName}
                                            </span>
                                            <span className="text-xs text-slate-400 capitalize leading-tight">{role}</span>
                                        </div>
                                        <ChevronRight size={14} className="hidden sm:block text-slate-400 rotate-90" />
                                    </div>
                                </Dropdown.Trigger>
                                <Dropdown.Popover>
                                    <Dropdown.Menu aria-label="User Actions" className="text-foreground">
                                        <Dropdown.Item key="settings" id="settings" textValue="Change Password" onPress={passwordModal.onOpen}>
                                            <div className="flex items-center gap-2">
                                                <Lock size={15} />
                                                <Label>Change Password</Label>
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item key="logout" id="logout" textValue="Log Out" variant="danger" onPress={handleLogout}>
                                            <div className="flex items-center gap-2">
                                                <LogOut size={15} />
                                                <Label>Sign Out</Label>
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </div>
                    </NavbarContent>

                    {/* Mobile Menu */}
                    <NavbarMenu className="backdrop-blur-xl pt-4 pb-8"
                        style={{
                            background: 'var(--sidebar-bg)',
                            borderTop: '1px solid var(--sidebar-border)',
                        }}>
                        <div className="flex flex-col gap-1 px-2">
                            {menuItems.map((item, index) => {
                                const active = isActive(item.path);
                                return (
                                    <NavbarMenuItem key={index}>
                                        <NextLink
                                            className={clsx(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                                active
                                                    ? "text-indigo-600 dark:text-indigo-400"
                                                    : "text-slate-600 dark:text-slate-400"
                                            )}
                                            style={active ? { background: 'rgba(79, 70, 229, 0.08)' } : undefined}
                                            href={item.path || '#'}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <span className={active ? "text-indigo-500" : "text-slate-400"}>{item.icon}</span>
                                            {item.label}
                                            {active && <span className="ml-auto w-2 h-2 rounded-full bg-indigo-500" />}
                                        </NextLink>
                                    </NavbarMenuItem>
                                );
                            })}
                        </div>
                        <div className="mt-4 mx-4 pt-4" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 w-full text-left font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut size={17} />
                                Sign Out
                            </button>
                        </div>
                    </NavbarMenu>
                </Navbar>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
                    style={{ background: 'var(--background)' }}>
                    <div className="w-full max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <PasswordChangeModal isOpen={passwordModal.isOpen} onOpenChange={passwordModal.onOpenChange} />
            </div>
        </div>
    );
};
