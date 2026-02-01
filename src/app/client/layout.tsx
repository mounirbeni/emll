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
    ChevronLeft,
    ChevronRight,
    Search,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const navigation = [
    { name: "Dashboard", href: "/client", icon: LayoutDashboard },
    { name: "My Bookings", href: "/client/bookings", icon: Calendar },
    { name: "Notifications", href: "/client/notifications", icon: Bell },
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
        <div className="min-h-screen bg-cream">
            {/* Desktop Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 hidden lg:block ${sidebarCollapsed ? "w-20" : "w-64"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-20 px-4 border-b border-gray-100">
                        {!sidebarCollapsed ? (
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-xl font-bold text-primary tracking-tight">
                                    Explore Marrakesh
                                </span>
                            </Link>
                        ) : (
                            <Link href="/" className="flex justify-center w-full">
                                <span className="text-2xl font-bold text-primary">E</span>
                            </Link>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive
                                        ? "bg-primary/5 text-primary font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        } ${sidebarCollapsed ? "justify-center" : ""}`}
                                    title={sidebarCollapsed ? item.name : undefined}
                                >
                                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`} />
                                    {!sidebarCollapsed && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <div className={`flex items-center gap-3 mb-4 ${sidebarCollapsed ? "justify-center" : "px-2"}`}>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {session?.user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            {!sidebarCollapsed && (
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {session?.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            {!sidebarCollapsed && "Sign Out"}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`transition-all duration-300 lg:pl-${sidebarCollapsed ? "20" : "64"}`}>
                {/* Mobile Sticky Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 lg:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-semibold text-gray-900">
                            {session?.user?.name?.split(" ")[0]}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/client/notifications">
                            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-4rem)] lg:min-h-screen pb-20 lg:pb-8 p-4 lg:p-8">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Mobile Bottom Navigation */}
                {/* <MobileNav /> // Removed for v12.0 - Profile tab in bottom nav leads to User Hub */}
            </div>
        </div>
    );
}
