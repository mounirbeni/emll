"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { MobileNav } from "@/components/client/MobileNav";
import { Sidebar } from "@/components/client/Sidebar";
import { cn } from "@/lib/utils";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Load sidebar state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved !== null) {
            setSidebarCollapsed(JSON.parse(saved));
        }
    }, []);

    // Save sidebar state to localStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
        }
    }, [sidebarCollapsed, mounted]);

    // Prevent hydration mismatch for sidebar state
    if (!mounted) {
        return <div className="min-h-screen bg-gray-50" />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            {/* Main Content Area */}
            <div className={cn(
                "transition-all duration-300 min-h-screen",
                sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
            )}>
                {/* Mobile Sticky Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 lg:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs ring-2 ring-primary/20">
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">
                            {session?.user?.name?.split(" ")[0]}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/client/notifications" className="relative group">
                            <div className="p-2.5 rounded-full text-gray-500 bg-gray-50 hover:bg-orange-50 hover:text-primary transition-all">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8 animate-fade-in">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <MobileNav />
            </div>
        </div>
    );
}
