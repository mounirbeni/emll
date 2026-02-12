'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ExperienceGalleryProps {
    images: string[];
    title: string;
}

export default function ExperienceGallery({ images, title }: ExperienceGalleryProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Filter out placeholder images for display
    const validImages = images.filter(img => img && img !== 'IMAGE_PLACEHOLDER_PENDING_UPLOAD');

    // If no valid images, use a placeholder
    const displayImages = validImages.length > 0 ? validImages : ['/images/placeholder-experience.svg'];

    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const goToPrevious = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'Escape') closeModal();
    };

    return (
        <>
            {/* Desktop Gallery Grid */}
            <div className="hidden md:block container mx-auto px-4">
                <div className="grid grid-cols-4 gap-2 h-[500px]">
                    {/* Main large image */}
                    <div
                        className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl cursor-pointer group"
                        onClick={() => openModal(0)}
                    >
                        <Image
                            src={displayImages[0]}
                            alt={`${title} - Main view`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* Smaller images grid */}
                    {displayImages.slice(1, 5).map((image, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-2xl cursor-pointer group"
                            onClick={() => openModal(index + 1)}
                        >
                            <Image
                                src={image}
                                alt={`${title} - View ${index + 2}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                            {/* Show all photos button on last image */}
                            {index === 3 && displayImages.length > 5 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        +{displayImages.length - 5} more
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden relative h-[300px] w-full">
                <div className="relative h-full overflow-hidden">
                    <Image
                        src={displayImages[currentImageIndex]}
                        alt={`${title} - View ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Navigation arrows for mobile */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-900" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-900" />
                        </button>
                    </>
                )}

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {displayImages.length}
                </div>

                {/* View all button */}
                <button
                    onClick={() => openModal(currentImageIndex)}
                    className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-gray-900 hover:bg-white transition-colors"
                >
                    View all photos
                </button>
            </div>

            {/* Full-Screen Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent
                    className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none"
                    onKeyDown={handleKeyDown}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
                            aria-label="Close gallery"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Main image */}
                        <div className="relative w-full h-full flex items-center justify-center p-16">
                            <Image
                                src={displayImages[currentImageIndex]}
                                alt={`${title} - View ${currentImageIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Navigation arrows */}
                        {displayImages.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors z-40"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-8 h-8 text-white" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors z-40"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-8 h-8 text-white" />
                                </button>
                            </>
                        )}

                        {/* Image counter */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-40">
                            {currentImageIndex + 1} / {displayImages.length}
                        </div>

                        {/* Thumbnail strip */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4 z-40 scrollbar-hide">
                            {displayImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={cn(
                                        "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                        currentImageIndex === index
                                            ? "border-white scale-110"
                                            : "border-transparent opacity-60 hover:opacity-100"
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
                </DialogContent>
            </Dialog>
        </>
    );
}
