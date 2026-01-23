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

/**
 * Service/Experience card for mobile
 */
export function MobileServiceCard({
    image,
    title,
    category,
    rating,
    reviews,
    price,
    duration,
    onClick
}: {
    image: string
    title: string
    category: string
    rating: number
    reviews: number
    price: number
    duration?: string
    onClick?: () => void
}) {
    return (
        <div
            className="bg-white rounded-3xl shadow-md overflow-hidden active:scale-[0.98] transition-all duration-200 cursor-pointer"
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-charcoal text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-base text-charcoal mb-2 line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                        <span className="text-primary text-sm font-bold">★</span>
                        <span className="text-sm font-semibold text-charcoal">
                            {rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({reviews})
                        </span>
                    </div>
                    {duration && (
                        <span className="text-xs text-gray-500">{duration}</span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-xs text-gray-500">From</span>
                        <p className="text-xl font-bold text-primary">€{price}</p>
                    </div>
                    <button className="bg-primary hover:bg-accent text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow-md shadow-primary/20 transition-colors">
                        Book
                    </button>
                </div>
            </div>
        </div>
    )
}
