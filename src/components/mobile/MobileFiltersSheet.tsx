"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileFiltersSheetProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    appliedCount?: number
    onClear?: () => void
}

export function MobileFiltersSheet({
    isOpen,
    onClose,
    children,
    appliedCount = 0,
    onClear
}: MobileFiltersSheetProps) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Bottom Sheet */}
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden transition-transform duration-300 ease-out",
                    isOpen ? "translate-y-0" : "translate-y-full"
                )}
                style={{ maxHeight: "85vh" }}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 pb-4 border-b">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-charcoal" />
                        <h2 className="text-lg font-semibold text-charcoal">Filters</h2>
                        {appliedCount > 0 && (
                            <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                                {appliedCount}
                            </span>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-4 py-4" style={{ maxHeight: "calc(85vh - 140px)" }}>
                    {children}
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-3 bg-white flex gap-3">
                    {appliedCount > 0 && onClear && (
                        <Button
                            variant="outline"
                            onClick={onClear}
                            className="flex-1"
                        >
                            Clear All
                        </Button>
                    )}
                    <Button
                        onClick={onClose}
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                        Show Results
                    </Button>
                </div>
            </div>
        </>
    )
}
