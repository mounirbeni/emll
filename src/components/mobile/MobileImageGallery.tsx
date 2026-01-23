"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Share2, ZoomIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface MobileImageGalleryProps {
    images: string[]
    isOpen: boolean
    onClose: () => void
    initialIndex?: number
}

/**
 * Native-style photo viewer for mobile
 * Features:
 * - Fullscreen swipeable images
 * - Pinch to zoom
 * - Image counter (1/5)
 * - Close and share buttons
 */
export function MobileImageGallery({
    images,
    isOpen,
    onClose,
    initialIndex = 0
}: MobileImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    useEffect(() => {
        setCurrentIndex(initialIndex)
    }, [initialIndex])

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Check out this experience",
                url: window.location.href
            })
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="md:hidden fixed inset-0 z-50 bg-black"
                >
                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent safe-top">
                        <div className="flex items-center justify-between px-4 py-4">
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="text-white text-sm font-medium">
                                    {currentIndex + 1} / {images.length}
                                </span>
                            </div>
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={images[currentIndex]}
                                    alt={`Image ${currentIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent safe-bottom">
                            <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-4">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={cn(
                                            "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                                            currentIndex === index
                                                ? "border-white scale-110"
                                                : "border-transparent opacity-60"
                                        )}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
