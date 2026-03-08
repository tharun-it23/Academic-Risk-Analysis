"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Dropdown, Label, Button, Link, Avatar } from "@heroui/react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, LogOut, Lock } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordChangeModal } from "./PasswordChangeModal";
import { useDisclosure } from "@heroui/use-disclosure";

interface MenuItem {
    label: string;
    path?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

interface DropdownMenuConfig {
    label: string;
    icon?: React.ReactNode;
    items: {
        label: string;
        description?: string;
        path?: string;
        icon?: React.ReactNode;
        onClick?: () => void;
    }[];
}

interface DashboardNavbarProps {
    title: string;
    menuItems?: MenuItem[];
    dropdownMenus?: DropdownMenuConfig[];
}

export const DashboardNavbar = ({ title, menuItems = [], dropdownMenus = [] }: DashboardNavbarProps) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const passwordModal = useDisclosure();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" className="bg-background py-4 border-b z-50" classNames={{
            item: [
                "flex",
                "relative",
                "h-full",
                "items-center",
                "data-[active=true]:after:content-['']",
                "data-[active=true]:after:absolute",
                "data-[active=true]:after:bottom-0",
                "data-[active=true]:after:left-0",
                "data-[active=true]:after:right-0",
                "data-[active=true]:after:h-[2px]",
                "data-[active=true]:after:rounded-[2px]",
                "data-[active=true]:after:bg-primary",
            ],
            wrapper: "px-4 sm:px-6",
            brand: "text-foreground"
        }}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden text-foreground"
                />
                <NavbarBrand>
                    <p className="font-bold text-inherit">{title}</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {menuItems.map((item, index) => (
                    <NavbarItem key={index}>
                        <Button
                            variant="secondary"
                            className="hover:bg-slate-200 dark:hover:bg-slate-800"
                            onPress={() => item.onClick ? item.onClick() : router.push(item.path!)}
                        >
                          {item.icon}  {item.label}
                        </Button>
                    </NavbarItem>
                ))}

                {dropdownMenus.map((dropdown, index) => (
                    <Dropdown key={index}>
                        <NavbarItem>
                            <Dropdown.Trigger
                                className="inline-flex items-center justify-center rounded-medium px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-220 dark:hover:bg-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-primary gap-2"
                            >
                                {dropdown.icon} {dropdown.label} <ChevronDown size={16} />
                            </Dropdown.Trigger>
                        </NavbarItem>
                        <Dropdown.Popover>
                            <Dropdown.Menu
                                aria-label={dropdown.label}
                                className="w-[340px] text-foreground"
                            >
                                {dropdown.items.map((item, itemIdx) => (
                                    <Dropdown.Item
                                        key={itemIdx}
                                        id={String(itemIdx)}
                                        textValue={item.label}
                                        onPress={() => item.onClick ? item.onClick() : router.push(item.path!)}
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                {item.icon}
                                                <Label>{item.label}</Label>
                                            </div>
                                            {item.description && <span className="text-tiny text-default-400">{item.description}</span>}
                                        </div>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                <Dropdown>
                    <Dropdown.Trigger className="transition-transform outline-none cursor-pointer">
                        <Avatar size="sm" color="primary">
                            <Avatar.Image src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`} alt={user?.username || 'User'} />
                            <Avatar.Fallback>{user?.username?.substring(0, 2).toUpperCase() || 'U'}</Avatar.Fallback>
                        </Avatar>
                    </Dropdown.Trigger>
                    <Dropdown.Popover>
                        <Dropdown.Menu aria-label="User Actions" className="text-foreground">
                            <Dropdown.Item key="settings" id="settings" textValue="Change Password" onPress={passwordModal.onOpen}>
                                <div className="flex items-center gap-2">
                                    <Lock size={16} />
                                    <Label>Change Password</Label>
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item key="logout" id="logout" textValue="Log Out" variant="danger" onPress={handleLogout}>
                                <div className="flex items-center gap-2">
                                    <LogOut size={16} />
                                    <Label>Log Out</Label>
                                </div>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            </NavbarContent>

            <PasswordChangeModal isOpen={passwordModal.isOpen} onOpenChange={passwordModal.onOpenChange} />

            <NavbarMenu className="bg-slate-800 pt-6">
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link
                            className="w-full text-white"
                            href="#"
                            onPress={() => item.onClick ? item.onClick() : router.push(item.path!)}
                        >
                            {item.icon} <span className="ml-2">{item.label}</span>
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
};
