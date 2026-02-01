"use client"

import { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MobileCardProps {
    children: ReactNode
    className?: string
    onClick?: () => void
    header?: ReactNode
    footer?: ReactNode
    noPadding?: boolean
}

/**
 * Reusable app-style card component for mobile
 * Features:
 * - 24px border radius
 * - Shadow elevation
 * - Touch feedback
 * - Optional header/footer
 * - Consistent padding system
 */
export function MobileCard({
    children,
    className,
    onClick,
    header,
    footer,
    noPadding = false
}: MobileCardProps) {
    const isInteractive = !!onClick

    return (
        <div
            className={cn(
                "bg-white rounded-[20px] shadow-md border border-gray-100",
                "transition-all duration-200",
                isInteractive && "active:scale-[0.98] cursor-pointer hover:shadow-lg",
                className
            )}
            onClick={onClick}
        >
            {header && (
                <div className="px-4 py-3 border-b border-gray-100">
                    {header}
                </div>
            )}

            <div className={cn(!noPadding && "p-4")}>
                {children}
            </div>

            {footer && (
                <div className="px-4 py-3 border-t border-gray-100">
                    {footer}
                </div>
            )}
        </div>
    )
}

/**
 * Compact card variant for lists
 */
export function MobileListCard({
    children,
    className,
    onClick
}: {
    children: ReactNode
    className?: string
    onClick?: () => void
}) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl shadow-sm border border-gray-100 p-4",
                "transition-all duration-200",
                onClick && "active:scale-[0.98] cursor-pointer hover:shadow-md",
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    )
}


