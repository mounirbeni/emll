"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MobileBookingCTAProps {
    price: number
    currency?: string
    onBook: () => void
    buttonText?: string
    priceLabel?: string
    className?: string
    additionalInfo?: ReactNode
}

/**
 * Sticky bottom action bar for booking
 * Features:
 * - Price display
 * - "Book Now" button
 * - Safe-area padding
 * - Blur backdrop
 * - Slide-up animation on scroll
 */
export function MobileBookingCTA({
    price,
    currency = "€",
    onBook,
    buttonText = "Book Now",
    priceLabel = "From",
    className,
    additionalInfo
}: MobileBookingCTAProps) {
    return (
        <div
            className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 z-40",
                "bg-white/95 backdrop-blur-lg border-t border-gray-100",
                "safe-bottom shadow-2xl",
                className
            )}
        >
            <div className="px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Price Section */}
                    <div className="flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-0.5">{priceLabel}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-primary">
                                {currency}{price}
                            </span>
                            <span className="text-sm text-gray-500">/person</span>
                        </div>
                        {additionalInfo && (
                            <div className="mt-1">{additionalInfo}</div>
                        )}
                    </div>

                    {/* Book Button */}
                    <button
                        onClick={onBook}
                        className="flex-1 h-[44px] bg-primary hover:bg-accent text-white font-semibold rounded-[14px] transition-all active:scale-[0.97] shadow-lg shadow-primary/20 text-[15px]"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}

/**
 * Variant with multiple options (e.g., Add to Wishlist + Book)
 */
export function MobileBookingCTAWithActions({
    price,
    currency = "€",
    onBook,
    onSecondaryAction,
    secondaryActionIcon,
    secondaryActionLabel = "Save",
    className
}: {
    price: number
    currency?: string
    onBook: () => void
    onSecondaryAction?: () => void
    secondaryActionIcon?: ReactNode
    secondaryActionLabel?: string
    className?: string
}) {
    return (
        <div
            className={cn(
                "md:hidden fixed bottom-0 left-0 right-0 z-40",
                "bg-white/95 backdrop-blur-lg border-t border-gray-100",
                "safe-bottom shadow-2xl",
                className
            )}
        >
            <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                    {/* Price */}
                    <div className="flex-shrink-0">
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-lg font-bold text-primary">
                            {currency}{price}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex-1 flex gap-2">
                        {onSecondaryAction && (
                            <button
                                onClick={onSecondaryAction}
                                className="w-[44px] h-[44px] rounded-[14px] border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-all active:scale-[0.97]"
                                aria-label={secondaryActionLabel}
                            >
                                {secondaryActionIcon}
                            </button>
                        )}
                        <button
                            onClick={onBook}
                            className="flex-1 h-[44px] bg-primary hover:bg-accent text-white font-semibold rounded-[14px] transition-all active:scale-[0.97] shadow-lg shadow-primary/20 text-[15px]"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
