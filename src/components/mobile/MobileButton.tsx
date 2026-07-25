"use client"

import { ReactNode, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface MobileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: "primary" | "secondary" | "ghost" | "outline"
    size?: "sm" | "md" | "lg"
    fullWidth?: boolean
    loading?: boolean
    icon?: ReactNode
}

/**
 * Touch-optimized button component for mobile
 * Features:
 * - 44px minimum height (Apple HIG)
 * - Large tap targets
 * - Loading states
 * - Haptic-style feedback
 * - Multiple variants
 */
export function MobileButton({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    icon,
    className,
    disabled,
    ...props
}: MobileButtonProps) {
    const baseStyles = "font-semibold rounded-[14px] transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

    const variants = {
        primary: "bg-primary hover:bg-brand-600 text-white shadow-lg shadow-primary/20",
        secondary: "bg-gray-100 hover:bg-gray-200 text-charcoal",
        ghost: "bg-transparent hover:bg-gray-100 text-charcoal",
        outline: "bg-white border-2 border-gray-200 hover:border-primary hover:text-primary text-charcoal"
    }

    const sizes = {
        sm: "h-[36px] px-3 text-sm min-w-[80px]",
        md: "h-[44px] px-4 text-[15px] min-w-[100px]",
        lg: "h-[48px] px-6 text-base min-w-[120px]"
    }

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="w-[18px] h-[18px] animate-spin" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && <span className="[&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    )
}

/**
 * Icon-only button variant
 */
export function MobileIconButton({
    icon,
    label,
    variant = "ghost",
    className,
    ...props
}: {
    icon: ReactNode
    label: string
    variant?: "primary" | "secondary" | "ghost"
} & ButtonHTMLAttributes<HTMLButtonElement>) {
    const variants = {
        primary: "bg-primary hover:bg-brand-600 text-white shadow-lg shadow-primary/20",
        secondary: "bg-gray-100 hover:bg-gray-200 text-charcoal",
        ghost: "bg-transparent hover:bg-gray-100 text-charcoal"
    }

    return (
        <button
            className={cn(
                "w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-200 active:scale-[0.97]",
                variants[variant],
                className
            )}
            aria-label={label}
            {...props}
        >
            <span className="[&>svg]:w-[20px] [&>svg]:h-[20px]">{icon}</span>
        </button>
    )
}

/**
 * Floating Action Button (FAB)
 */
export function MobileFAB({
    icon,
    label,
    onClick,
    className
}: {
    icon: ReactNode
    label: string
    onClick: () => void
    className?: string
}) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={cn(
                "fab-floating layer-docked fixed right-4",
                "w-[52px] h-[52px] rounded-full",
                "bg-primary hover:bg-brand-600 text-white",
                "shadow-lg shadow-primary/30",
                "flex items-center justify-center",
                "transition-all duration-200 active:scale-[0.97]",
                "safe-bottom",
                className
            )}
        >
            {icon}
        </button>
    )
}
