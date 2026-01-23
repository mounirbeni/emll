"use client"

import Link from "next/link"
import { ChevronRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserHubRowProps {
    icon: LucideIcon
    title: string
    subtitle?: string
    href?: string
    onClick?: () => void
    badge?: string | number
    className?: string
}

/**
 * TripAdvisor-style clickable row for User Hub
 * Features:
 * - Icon on left
 * - Title + optional subtitle
 * - Chevron right arrow
 * - Touch feedback
 * - Border bottom divider
 */
export function UserHubRow({
    icon: Icon,
    title,
    subtitle,
    href,
    onClick,
    badge,
    className
}: UserHubRowProps) {
    const content = (
        <div className="flex items-center gap-4 py-3 px-5 transition-colors duration-150 active:bg-gray-50 hover:bg-gray-50/50">
            {/* Icon */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-[20px] h-[20px] text-primary" />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-charcoal">
                    {title}
                </p>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Badge (optional) */}
            {badge && (
                <div className="flex-shrink-0">
                    <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {badge}
                    </span>
                </div>
            )}

            {/* Chevron */}
            <ChevronRight className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" />
        </div>
    )

    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    "block border-b border-gray-200 last:border-b-0",
                    className
                )}
            >
                {content}
            </Link>
        )
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left border-b border-gray-200 last:border-b-0",
                className
            )}
        >
            {content}
        </button>
    )
}
