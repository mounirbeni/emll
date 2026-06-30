"use client"

import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, Search, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface MobileTopBarProps {
    title?: string
    showBack?: boolean
    actions?: React.ReactNode
    transparent?: boolean
    blurOnScroll?: boolean
}

export function MobileTopBar({
    title,
    showBack = true,
    actions,
    transparent = false,
    blurOnScroll = false
}: MobileTopBarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll for blur effect - MUST be before early return
    useEffect(() => {
        if (!blurOnScroll) return

        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [blurOnScroll])

    // Don't show on admin pages or home page
    if (pathname?.startsWith('/admin') || pathname === '/') {
        return null
    }

    // Auto-detect if we should show back button
    const shouldShowBack = showBack && pathname !== '/'

    // Determine styling based on mode
    const isTransparent = transparent && !scrolled
    const shouldBlur = blurOnScroll && scrolled

    return (
        <header
            className={cn(
                "md:hidden fixed top-0 left-0 right-0 z-40 safe-top transition-all duration-300",
                isTransparent
                    ? "bg-transparent border-transparent"
                    : shouldBlur
                        ? "bg-white/80 backdrop-blur-lg border-b border-gray-100/50"
                        : "bg-white border-b border-gray-100"
            )}
        >
            <div className="flex items-center justify-between h-[52px] px-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {shouldShowBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-11 w-11 rounded-full -ml-2 transition-colors",
                                isTransparent
                                    ? "bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm"
                                    : "hover:bg-gray-100"
                            )}
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-[22px] w-[22px]" />
                        </Button>
                    )}
                    {!isTransparent && (
                        <h1 className="text-lg font-semibold text-charcoal truncate">
                            {title || getPageTitle(pathname)}
                        </h1>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            </div>
        </header>
    )
}

/**
 * Preset top bar for detail pages with transparent hero
 */
export function MobileDetailTopBar({
    onShare,
    onFavorite,
    isFavorited = false
}: {
    onShare?: () => void
    onFavorite?: () => void
    isFavorited?: boolean
}) {
    return (
        <MobileTopBar
            transparent
            blurOnScroll
            showBack
            actions={
                <div className="flex items-center gap-1">
                    {onShare && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 rounded-full bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm"
                            onClick={onShare}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    )}
                    {onFavorite && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 rounded-full bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm"
                            onClick={onFavorite}
                        >
                            <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
                        </Button>
                    )}
                </div>
            }
        />
    )
}

/**
 * Preset top bar for search/explore pages
 */
export function MobileSearchTopBar({ onSearchClick }: { onSearchClick?: () => void }) {
    return (
        <MobileTopBar
            title="Explore"
            showBack={false}
            actions={
                onSearchClick && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={onSearchClick}
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                )
            }
        />
    )
}

function getPageTitle(pathname: string | null): string {
    if (!pathname) return ''

    if (pathname === '/client/bookings') return 'My Trips'
    if (pathname === '/client/notifications') return 'Notifications'
    if (pathname === '/client/profile') return 'Profile'
    if (pathname === '/login') return 'Login'
    if (pathname === '/register') return 'Sign Up'
    if (pathname.startsWith('/booking/')) return 'Book Experience'

    return 'Explore Marrakesh'
}
