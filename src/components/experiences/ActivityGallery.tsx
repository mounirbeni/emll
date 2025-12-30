"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

interface ActivityGalleryProps {
    images: string[];
    title: string;
}

export function ActivityGallery({ images, title }: ActivityGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    // Filter out any empty or invalid images
    const validImages = (images || []).filter(img => img && img.trim() !== "");

    // Navigation functions for lightbox
    const goToNext = useCallback(() => {
        if (selectedImage === null || validImages.length === 0) return;
        setDirection(1);
        setSelectedImage((prev) => (prev === null ? 0 : (prev + 1) % validImages.length));
    }, [selectedImage, validImages.length]);

    const goToPrev = useCallback(() => {
        if (selectedImage === null || validImages.length === 0) return;
        setDirection(-1);
        setSelectedImage((prev) => (prev === null ? 0 : (prev - 1 + validImages.length) % validImages.length));
    }, [selectedImage, validImages.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImage !== null) {
                if (e.key === "ArrowRight") goToNext();
                if (e.key === "ArrowLeft") goToPrev();
                if (e.key === "Escape") setSelectedImage(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImage, goToNext, goToPrev]);

    // Ensure we have images
    if (validImages.length === 0) return null;

    // Variants for image transition animations
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <div className="space-y-6">
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {validImages.slice(0, 4).map((img, idx) => (
                    <motion.div
                        key={idx}
                        className={cn(
                            "relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group",
                            // Special sizing for first image in grid
                            idx === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-[4/3]" : "aspect-square"
                        )}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedImage(idx)}
                        layoutId={`gallery-image-${idx}`}
                    >
                        <Image
                            src={img}
                            alt={`${title} - Image ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gray-50/30 group-hover:bg-gray-50/20 transition-colors duration-300" />

                        {/* Image counter overlay for first image */}
                        {idx === 0 && validImages.length > 4 && (
                            <div className="absolute top-4 right-4 bg-white text-gray-900 text-sm font-medium rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg border border-gray-200">
                                <Expand className="h-3.5 w-3.5" />
                                View Gallery ({validImages.length})
                            </div>
                        )}

                        {/* Expand icon for all images */}
                        <div className="absolute bottom-4 right-4 bg-white text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg border border-gray-200">
                            <Expand className="h-4 w-4" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 text-gray-900 hover:text-gray-700 transition-colors z-50 p-2 rounded-full hover:bg-gray-100"
                            aria-label="Close gallery"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        {/* Navigation arrows */}
                        {validImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToPrev();
                                    }}
                                    className="absolute left-6 text-gray-900 hover:text-gray-700 transition-colors z-50 p-3 rounded-full hover:bg-gray-100"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToNext();
                                    }}
                                    className="absolute right-6 text-gray-900 hover:text-gray-700 transition-colors z-50 p-3 rounded-full hover:bg-gray-100"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </button>
                            </>
                        )}

                        {/* Image counter */}
                        <div className="absolute top-6 left-6 text-gray-900 text-sm font-medium bg-white rounded-full px-3 py-1.5 z-50 shadow-lg border border-gray-200">
                            {selectedImage + 1} / {validImages.length}
                        </div>

                        {/* Image display */}
                        <div
                            className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={selectedImage}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = swipePower(offset.x, velocity.x);
                                        if (swipe < -swipeConfidenceThreshold) {
                                            goToNext();
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            goToPrev();
                                        }
                                    }}
                                    className="relative w-full h-full flex items-center justify-center"
                                >
                                    <Image
                                        src={validImages[selectedImage]}
                                        alt={`${title} - Expanded View`}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Image caption */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-900 text-center max-w-2xl px-4">
                            <p className="text-sm bg-white rounded-full px-4 py-2 inline-block shadow-lg border border-gray-200">
                                {title} - Image {selectedImage + 1}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}