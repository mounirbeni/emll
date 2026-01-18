"use client"

import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileTopBarProps {
    title?: string
    showBack?: boolean
    actions?: React.ReactNode
}

export function MobileTopBar({ title, showBack = true, actions }: MobileTopBarProps) {
    const router = useRouter()
    const pathname = usePathname()

    // Don't show on admin pages or home page
    if (pathname?.startsWith('/admin') || pathname === '/') {
        return null
    }

    // Auto-detect if we should show back button
    const shouldShowBack = showBack && pathname !== '/'

    return (
        <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40 safe-top">
            <div className="flex items-center justify-between h-14 px-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {shouldShowBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full -ml-2"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <h1 className="text-lg font-semibold text-charcoal truncate">
                        {title || getPageTitle(pathname)}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            </div>
        </header>
    )
}

function getPageTitle(pathname: string | null): string {
    if (!pathname) return ''

    if (pathname.startsWith('/services/')) return 'Experience Details'
    if (pathname === '/services') return 'Explore'
    if (pathname === '/client/bookings') return 'My Trips'
    if (pathname === '/client/notifications') return 'Notifications'
    if (pathname === '/client/profile') return 'Profile'
    if (pathname === '/login') return 'Login'
    if (pathname === '/register') return 'Sign Up'
    if (pathname.startsWith('/booking/')) return 'Book Experience'

    return 'Explore Marrakesh'
}
