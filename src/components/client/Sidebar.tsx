"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    User,
    CreditCard,
    LogOut,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const navigation = [
    { name: "Dashboard", href: "/client", icon: LayoutDashboard },
    { name: "My Bookings", href: "/client/bookings", icon: Calendar },
    { name: "Notifications", href: "/client/notifications", icon: Bell },
    { name: "Messages", href: "/client/messages", icon: MessageSquare },
    { name: "Profile", href: "/client/profile", icon: User },
    { name: "Payments", href: "/client/payments", icon: CreditCard },
    { name: "Support", href: "/client/support", icon: HelpCircle },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 hidden lg:block shadow-sm",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="flex items-center justify-center h-20 px-4 border-b border-gray-100">
                    {!collapsed ? (
                        <Link href="/" className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                            <span className="text-xl font-bold text-primary tracking-tight truncate">
                                Explore Marrakesh
                            </span>
                        </Link>
                    ) : (
                        <Link href="/" className="flex justify-center w-full">
                            <span className="text-2xl font-bold text-primary">E</span>
                        </Link>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto hide-scrollbar">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                                    isActive
                                        ? "bg-orange-50 text-primary font-bold shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                    collapsed ? "justify-center" : ""
                                )}
                                title={collapsed ? item.name : undefined}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                                    )}
                                />
                                {!collapsed && <span>{item.name}</span>}
                                {collapsed && isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle Button & User Profile */}
                <div className="border-t border-gray-100 bg-gray-50/50">
                    <div className={cn("flex items-center py-2", collapsed ? "justify-center" : "justify-end px-4")}>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className={cn(
                                "p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-orange-100 transition-colors outline-none focus:ring-2 focus:ring-primary/20",
                                collapsed ? "" : ""
                            )}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="p-4 pt-0">
                        <div className={cn("flex items-center gap-3 mb-4", collapsed ? "justify-center" : "px-2")}>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shrink-0">
                                {session?.user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            {!collapsed && (
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">
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
                            className={cn(
                                "w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors",
                                collapsed ? "justify-center px-0" : ""
                            )}
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            {!collapsed && "Sign Out"}
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
