
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Settings,
    LogOut,
    HelpCircle,
    BarChart3,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
    { label: "Messages", href: "/admin/messages", icon: HelpCircle },
    { label: "Complaints", href: "/admin/complaints", icon: HelpCircle },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Test Email", href: "/admin/test-email", icon: Mail },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-background border-r min-h-screen flex flex-col p-4">
            <div className="mb-0 px-2 py-4">
                <h2 className="text-xl font-bold font-serif text-[var(--color-primary)]">Admin Panel</h2>
            </div>

            <nav className="flex-1 space-y-1 mt-6">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                isActive
                                    ? "bg-[var(--color-primary)] text-white font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}>
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t pt-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => signOut({ callbackUrl: '/' })}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
