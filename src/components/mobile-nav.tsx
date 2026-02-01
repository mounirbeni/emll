"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Bell, MessageSquare, User } from "lucide-react";

export function MobileNav() {
    const pathname = usePathname();

    const navigation = [
        { name: "Home", href: "/client", icon: LayoutDashboard },
        { name: "Trips", href: "/client/bookings", icon: Calendar },
        { name: "Alerts", href: "/client/notifications", icon: Bell },
        { name: "Messages", href: "/client/messages", icon: MessageSquare },
        { name: "Profile", href: "/client/profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden pb-safe">
            <div className="flex items-center justify-around h-16">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/client");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? "fill-current/10" : ""}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
