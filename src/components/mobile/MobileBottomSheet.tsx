"use client"

import { ReactNode, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface MobileBottomSheetProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    snapPoints?: number[]
    className?: string
}

/**
 * Reusable bottom sheet component for mobile
 * Features:
 * - Slide-up animation
 * - Backdrop blur
 * - Drag handle
 * - Smooth animations
 */
export function MobileBottomSheet({
    isOpen,
    onClose,
    children,
    title,
    className
}: MobileBottomSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm layer-overlay"
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300
                        }}
                        className={cn(
                            "md:hidden fixed bottom-0 left-0 right-0 layer-sheet",
                            "bg-white rounded-t-3xl shadow-2xl",
                            "max-h-[90vh] flex flex-col",
                            "safe-bottom",
                            className
                        )}
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </div>

                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-charcoal">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

/**
 * Filter bottom sheet variant
 */
export function MobileFilterSheet({
    isOpen,
    onClose,
    onApply,
    onReset,
    children,
    appliedCount = 0
}: {
    isOpen: boolean
    onClose: () => void
    onApply: () => void
    onReset: () => void
    children: ReactNode
    appliedCount?: number
}) {
    return (
        <MobileBottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Filters"
        >
            <div className="space-y-6">
                {children}
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 -mx-6 -mb-4 mt-6">
                <div className="flex gap-3">
                    <button
                        onClick={onReset}
                        className="flex-1 h-12 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => {
                            onApply()
                            onClose()
                        }}
                        className="flex-1 h-12 rounded-xl bg-primary hover:bg-accent text-white font-semibold transition-colors shadow-lg shadow-primary/20"
                    >
                        Show Results {appliedCount > 0 && `(${appliedCount})`}
                    </button>
                </div>
            </div>
        </MobileBottomSheet>
    )
}
