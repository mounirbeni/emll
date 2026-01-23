"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface UserHubSectionProps {
    title: string
    children: ReactNode
    className?: string
}

/**
 * Section wrapper for User Hub
 * Features:
 * - Section title styling
 * - White card container
 * - Rounded corners (20px)
 * - Soft shadow
 * - Proper spacing
 */
export function UserHubSection({
    title,
    children,
    className
}: UserHubSectionProps) {
    return (
        <div className={cn("mt-6", className)}>
            {/* Section Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2 px-4">
                {title}
            </h2>

            {/* Card Container */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {children}
            </div>
        </div>
    )
}
