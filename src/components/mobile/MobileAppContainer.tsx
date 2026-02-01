"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MobileAppContainerProps {
    children: ReactNode
    className?: string
    noPadding?: boolean
    fullHeight?: boolean
}

/**
 * Universal mobile app container that provides:
 * - Safe-area inset handling (iOS notch, Android navbar)
 * - Full viewport height management
 * - Consistent app-level styling
 * - Scroll behavior control
 */
export function MobileAppContainer({
    children,
    className,
    noPadding = false,
    fullHeight = true
}: MobileAppContainerProps) {
    return (
        <div
            className={cn(
                "md:hidden w-full bg-beige-50",
                fullHeight && "min-h-screen",
                "safe-top safe-bottom",
                !noPadding && "pb-16", // Space for bottom nav
                className
            )}
        >
            {children}
        </div>
    )
}

/**
 * Page wrapper for individual mobile app pages
 */
export function MobilePageWrapper({
    children,
    className,
    hasTopBar = true,
    hasBottomNav = true
}: {
    children: ReactNode
    className?: string
    hasTopBar?: boolean
    hasBottomNav?: boolean
}) {
    return (
        <div
            className={cn(
                "md:hidden w-full min-h-screen bg-beige-50",
                hasTopBar && "pt-14", // Space for top bar
                hasBottomNav && "pb-16", // Space for bottom nav
                "safe-top safe-bottom",
                className
            )}
        >
            {children}
        </div>
    )
}

/**
 * Fullscreen modal wrapper for mobile
 */
export function MobileModalContainer({
    children,
    className,
    onClose
}: {
    children: ReactNode
    className?: string
    onClose?: () => void
}) {
    return (
        <div
            className={cn(
                "md:hidden fixed inset-0 z-50 bg-white",
                "safe-top safe-bottom",
                "flex flex-col",
                className
            )}
        >
            {children}
        </div>
    )
}
