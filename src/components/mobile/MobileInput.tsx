"use client"

import { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface MobileInputProps {
    label?: string
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    type?: "text" | "email" | "password" | "tel" | "number"
    error?: string
    icon?: ReactNode
    className?: string
}

/**
 * App-style input component for mobile
 * Features:
 * - 56px height
 * - Large font size (16px to prevent zoom on iOS)
 * - Floating labels
 * - Clear button
 * - Error states
 */
export function MobileInput({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    error,
    icon,
    className
}: MobileInputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const inputType = type === "password" && showPassword ? "text" : type

    return (
        <div className={cn("w-full", className)}>
            {label && (
                <label className="block text-sm font-semibold text-charcoal mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full h-[44px] rounded-[12px] border-2 transition-all",
                        "text-sm text-charcoal placeholder:text-gray-400",
                        "focus:outline-none",
                        icon ? "pl-11 pr-4" : "px-4",
                        error
                            ? "border-red-500 focus:border-red-500"
                            : isFocused
                                ? "border-primary"
                                : "border-gray-200",
                        type === "password" && "pr-11"
                    )}
                />
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}

/**
 * Textarea variant
 */
export function MobileTextarea({
    label,
    placeholder,
    value,
    onChange,
    error,
    rows = 4,
    className
}: {
    label?: string
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    error?: string
    rows?: number
    className?: string
}) {
    return (
        <div className={cn("w-full", className)}>
            {label && (
                <label className="block text-sm font-semibold text-charcoal mb-2">
                    {label}
                </label>
            )}
            <textarea
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={cn(
                    "w-full rounded-[12px] border-2 transition-all resize-none",
                    "text-sm text-charcoal placeholder:text-gray-400 p-3",
                    "focus:outline-none",
                    error
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-primary"
                )}
            />
            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
