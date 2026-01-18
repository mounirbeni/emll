"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Calendar, Bell, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
    const pathname = usePathname()
    const { data: session } = useSession()

    // Don't show on admin pages
    if (pathname?.startsWith('/admin')) {
        return null
    }

    const navItems = session ? [
        { href: "/", icon: Home, label: "Home" },
        { href: "/services", icon: Compass, label: "Explore" },
        { href: "/client/bookings", icon: Calendar, label: "Trips" },
        { href: "/client/notifications", icon: Bell, label: "Alerts" },
        { href: "/client/profile", icon: User, label: "Profile" },
    ] : [
        { href: "/", icon: Home, label: "Home" },
        { href: "/services", icon: Compass, label: "Explore" },
        { href: "/login", icon: User, label: "Login" },
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                                isActive
                                    ? "text-orange-500"
                                    : "text-gray-500 active:text-orange-400"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-orange-100")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
