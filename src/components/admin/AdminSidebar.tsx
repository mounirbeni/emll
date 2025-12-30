'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Settings, LogOut, Package, MessageSquare, Users, Shield, ClipboardList, BarChart3, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
// removed import

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Bookings',
        href: '/admin/bookings',
        icon: ClipboardList,
    },
    {
        title: 'Calendar',
        href: '/admin/calendar',
        icon: Calendar,
    },
    {
        title: 'Services',
        href: '/admin/services',
        icon: Package,
    },
    {
        title: 'Complaints',
        href: '/admin/complaints',
        icon: MessageSquare,
    },
    {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users,
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
    },
    {
        title: 'Test Email',
        href: '/admin/test-email',
        icon: Mail,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
]

interface AdminSidebarProps {
    onClose?: () => void
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-full flex-col border-r bg-card/50 backdrop-blur-xl">
            {/* Header */}
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Shield className="h-5 w-5" />
                    </div>
                    <span>AdminPanel</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="space-y-1.5">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href} onClick={onClose}>
                                <div
                                    className={cn(
                                        'group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 outline-none hover:bg-muted',
                                        isActive
                                            ? 'bg-primary/10 text-primary hover:bg-primary/15'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    <item.icon className={cn(
                                        "mr-3 h-5 w-5 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )} />
                                    {item.title}
                                    {isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-4">
// removed theme toggle

                <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors h-11 px-4"
                    onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' })
                        window.location.href = '/admin/login'
                    }}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
