"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
    images: string[];
    title: string;
}

/**
 * ImageGallery Component
 * 
 * Luxury image carousel with thumbnails and lightbox modal.
 * Features smooth transitions and responsive design.
 */
export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <>
            {/* Main Gallery */}
            <div className="space-y-4">
                {/* Main Image */}
                <div
                    className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                    onClick={() => setIsLightboxOpen(true)}
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm shadow-lg border border-gray-200">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {images.slice(0, 6).map((image, index) => (
                            <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent hover:border-gray-300"
                                    }`}
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
                )}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-gray-900 hover:bg-gray-100"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    <div className="relative w-full max-w-6xl aspect-video">
                        <Image
                            src={images[currentIndex]}
                            alt={`${title} - Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 hover:bg-gray-100"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 hover:bg-gray-100"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        </>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-3 py-1 rounded-full text-sm shadow-lg border border-gray-200">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    );
}
