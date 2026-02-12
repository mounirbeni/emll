"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, MessageSquare, User } from "lucide-react";

export function MobileNav() {
    const pathname = usePathname();

    const navigation = [
        { name: "Home", href: "/client", icon: LayoutDashboard },
        { name: "Bookings", href: "/client/bookings", icon: Calendar },
        { name: "Messages", href: "/client/messages", icon: MessageSquare },
        { name: "Profile", href: "/client/profile", icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 lg:hidden safe-bottom">
            <div className="grid h-16 grid-cols-4 mx-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/client" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group transition-colors ${isActive ? "text-primary" : "text-gray-500"
                                }`}
                        >
                            <item.icon
                                className={`w-6 h-6 mb-1 transition-colors ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                                    }`}
                            />
                            <span className="text-xs font-medium truncate">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
