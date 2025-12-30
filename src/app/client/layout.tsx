"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    User,
    CreditCard,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const navigation = [
    { name: "Dashboard", href: "/client", icon: LayoutDashboard },
    { name: "My Bookings", href: "/client/bookings", icon: Calendar },
    { name: "Messages", href: "/client/messages", icon: MessageSquare },
    { name: "Profile", href: "/client/profile", icon: User },
    { name: "Payments", href: "/client/payments", icon: CreditCard },
];

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Load sidebar state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved !== null) {
            setSidebarCollapsed(JSON.parse(saved));
        }
    }, []);

    // Save sidebar state to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-100 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } ${
                    sidebarCollapsed ? "w-20" : "w-64"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo & Toggle */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                        {!sidebarCollapsed && (
                            <Link href="/" className="flex items-center gap-2 flex-1">
                                <span className="text-xl font-bold text-[#FF5F00] whitespace-nowrap">
                                    Explore Marrakesh
                                </span>
                            </Link>
                        )}
                        {sidebarCollapsed && (
                            <Link href="/" className="flex items-center justify-center w-full">
                                <span className="text-2xl font-bold text-[#FF5F00]">E</span>
                            </Link>
                        )}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                {sidebarCollapsed ? (
                                    <ChevronRight className="w-4 h-4" />
                                ) : (
                                    <ChevronLeft className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* User info */}
                    <div className={`px-4 py-4 border-b border-gray-200 ${sidebarCollapsed ? "px-2" : ""}`}>
                        <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}>
                            <div className="w-10 h-10 rounded-full bg-[#FF5F00] flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {session?.user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            {!sidebarCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {session?.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                                        sidebarCollapsed ? "justify-center px-2" : ""
                                    } ${
                                        isActive
                                            ? "bg-orange-50 text-[#FF5F00]"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                    title={sidebarCollapsed ? item.name : undefined}
                                >
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#FF5F00]" : ""}`} />
                                    {!sidebarCollapsed && (
                                        <span className="whitespace-nowrap">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className={`p-4 border-t border-gray-200 ${sidebarCollapsed ? "px-2" : ""}`}>
                        <Button
                            variant="ghost"
                            className={`w-full text-gray-700 hover:text-red-600 hover:bg-red-50 ${
                                sidebarCollapsed ? "justify-center px-2" : "justify-start"
                            }`}
                            onClick={() => signOut({ callbackUrl: "/" })}
                            title={sidebarCollapsed ? "Sign Out" : undefined}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!sidebarCollapsed && <span className="ml-3">Sign Out</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
                {/* Mobile header */}
                <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 text-lg font-semibold text-gray-900">
                        Client Dashboard
                    </span>
                </header>

                {/* Page content */}
                <main className="p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
