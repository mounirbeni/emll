'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Settings, LogOut, Package, MessageSquare, Users, Shield, ClipboardList, BarChart3, Mail, Compass, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        description: 'Overview & stats',
    },
    {
        title: 'Bookings',
        href: '/admin/bookings',
        icon: ClipboardList,
        description: 'Manage reservations',
    },
    {
        title: 'Calendar',
        href: '/admin/calendar',
        icon: Calendar,
        description: 'Schedule view',
    },
    {
        title: 'Services',
        href: '/admin/services',
        icon: Package,
        description: 'Experience listings',
    },
    {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users,
        description: 'User management',
    },
    {
        title: 'Messages',
        href: '/admin/complaints',
        icon: MessageSquare,
        description: 'Support requests',
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        description: 'Performance data',
    },
    {
        title: 'Email Testing',
        href: '/admin/test-email',
        icon: Mail,
        description: 'Test notifications',
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        description: 'Configuration',
    },
]

interface AdminSidebarProps {
    onClose?: () => void
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-full flex-col bg-white">
            {/* Premium Header with Gradient */}
            <div className="p-4 border-b border-border">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                        <Compass className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-base text-foreground">Explore Marrakesh</h1>
                        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || 
                            (item.href !== '/admin' && pathname?.startsWith(item.href))
                        return (
                            <Link key={item.href} href={item.href} onClick={onClose}>
                                <div
                                    className={cn(
                                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                                        isActive 
                                            ? "bg-primary text-white shadow-md shadow-primary/30" 
                                            : "bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                    )}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm font-medium truncate",
                                            isActive ? "text-primary" : "text-foreground"
                                        )}>
                                            {item.title}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <ChevronRight className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-3 space-y-2">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-3 mb-2">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">Admin Access</p>
                            <p className="text-[10px] text-muted-foreground">Full permissions</p>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all duration-200 h-10 px-3"
                    onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' })
                        window.location.href = '/admin/login'
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
