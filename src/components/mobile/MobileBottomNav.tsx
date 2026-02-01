"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Bell, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function MobileBottomNav() {
    const pathname = usePathname()
    const { data: session } = useSession()

    // Don't show on admin pages
    if (pathname?.startsWith('/admin')) {
        return null
    }

    const navItems = session ? [
        { href: "/", icon: Home, label: "Home" },
        { href: "/client/bookings", icon: Calendar, label: "Trips" },
        { href: "/client/notifications", icon: Bell, label: "Alerts" },
        { href: "/client/profile", icon: User, label: "Profile" },
    ] : [
        { href: "/", icon: Home, label: "Home" },
        { href: "/login", icon: User, label: "Login" },
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-50 safe-bottom shadow-lg">
            <div className="flex items-center justify-around h-[58px] px-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname?.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200",
                                "min-w-[60px] rounded-xl",
                                isActive
                                    ? "text-primary"
                                    : "text-gray-500 active:text-primary active:scale-95"
                            )}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/5 rounded-xl"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }}
                                />
                            )}

                            {/* Icon with animation */}
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    y: isActive ? -2 : 0
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 17
                                }}
                                className="relative z-10"
                            >
                                <Icon
                                    className={cn(
                                        "h-[22px] w-[22px] transition-all duration-200",
                                        isActive && "fill-primary/10"
                                    )}
                                />
                            </motion.div>

                            {/* Label */}
                            <span
                                className={cn(
                                    "text-[10px] font-medium relative z-10 transition-all duration-200",
                                    isActive ? "font-semibold" : "font-normal"
                                )}
                            >
                                {item.label}
                            </span>

                            {/* Notification badge (example for Alerts tab) */}
                            {item.label === "Alerts" && session && (
                                <div className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
