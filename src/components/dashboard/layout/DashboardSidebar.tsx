"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    MessageSquare,
    Bell,
    Settings,
    HelpCircle,
    CreditCard,
    User,
    LogOut,
    ChevronRight,
    Sparkles,
    Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    showLogo?: boolean;
}

const menuItems = [
    // ... existing items ...
    {
        title: "Overview",
        label: "Main",
        items: [
            {
                title: "Dashboard",
                href: "/client",
                icon: LayoutDashboard,
            },
            {
                title: "My Bookings",
                href: "/client/bookings",
                icon: ShoppingBag,
            },
            {
                title: "Wishlist",
                href: "/client/wishlist",
                icon: Heart,
            },
            {
                title: "Messages",
                href: "/client/messages",
                icon: MessageSquare,
            },
        ],
    },
    {
        title: "Account",
        label: "Settings",
        items: [
            {
                title: "Profile",
                href: "/client/profile",
                icon: User,
            },
            {
                title: "Notifications",
                href: "/client/notifications",
                icon: Bell,
            },
            {
                title: "Payments",
                href: "/client/payments",
                icon: CreditCard,
            },
            {
                title: "Settings",
                href: "/client/settings",
                icon: Settings,
            },
        ],
    },
    {
        title: "Support",
        label: "Help",
        items: [
            {
                title: "Help Center",
                href: "/client/support",
                icon: HelpCircle,
            },
        ],
    },
];

export function DashboardSidebar({ className, showLogo = true }: SidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <div className={cn("pb-12 h-full flex flex-col bg-white border-r border-gray-100 shadow-sm", className)}>
            {showLogo && (
                <div className="p-6 pb-0">
                    <Link href="/" className="flex items-center gap-2">
                        <Compass className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold text-primary">
                            Explore Marrakesh
                        </span>
                    </Link>
                </div>
            )}
            <div className="space-y-6 py-6 flex-1">
                {/* User Profile Card */}
                <div className="px-6">
                    <div className="bg-white border border-gray-100 p-5 rounded-3xl flex items-center gap-4 hover:shadow-md transition-all shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-orange-500/20 z-10">
                            <span className="font-bold text-xl">{session?.user?.name?.[0]?.toUpperCase() || 'T'}</span>
                        </div>
                        <div className="flex flex-col overflow-hidden z-10">
                            <span className="font-semibold text-sm truncate text-gray-900">{session?.user?.name || 'Traveler'}</span>
                            <div className="flex items-center gap-1 mt-1">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-[10px] text-primary uppercase tracking-wider font-bold">Premium Member</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4">
                    {menuItems.map((group, i) => (
                        <div key={i} className="mb-8">
                            <h2 className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                {group.label}
                            </h2>
                            <div className="space-y-1.5">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                                isActive
                                                    ? "text-primary bg-orange-50 shadow-sm"
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full" />
                                            )}
                                            <item.icon className={cn(
                                                "mr-4 h-5 w-5 transition-colors duration-200",
                                                isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                                            )} />
                                            <span className="flex-1 relative z-10">{item.title}</span>

                                            {isActive && <ChevronRight className="ml-2 h-4 w-4 text-primary opacity-100" />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 mt-auto pt-6 pb-6 border-t border-gray-50">
                <Button
                    variant="ghost"
                    className="w-full justify-start rounded-2xl text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium transition-all duration-200 h-12"
                    onClick={() => signOut({ callbackUrl: '/' })}
                >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-red-100 flex items-center justify-center mr-3 transition-colors">
                        <LogOut className="h-4 w-4" />
                    </div>
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
