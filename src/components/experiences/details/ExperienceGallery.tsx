'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface ExperienceGalleryProps {
    images: string[];
    title: string;
}

export default function ExperienceGallery({ images, title }: ExperienceGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);


    const validImages = images.filter(img => img && img !== 'IMAGE_PLACEHOLDER_PENDING_UPLOAD');

    // Ensure we have at least 1 image
    if (validImages.length === 0) return null;

    // Use validImages for display
    const displaySrc = (index: number) => validImages[index] || validImages[0]; // Fallback to first regular image if index missing (redundancy)

    return (
        <section className="hidden md:block">
            <div className="container mx-auto px-4">
                <div className="grid h-[400px] grid-cols-4 gap-2 overflow-hidden rounded-2xl lg:h-[500px]">
                    {/* Main Large Image */}
                    <div className="relative col-span-2 row-span-2 cursor-pointer transition-opacity hover:opacity-95" onClick={() => setIsOpen(true)}>
                        <Image
                            src={displaySrc(0)}
                            alt={`${title} - Main View`}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            priority
                        />
                    </div>

                    {/* Secondary Images Column */}
                    <div className="col-span-1 row-span-2 grid grid-rows-2 gap-2">
                        {validImages[1] && (
                            <div className="relative h-full cursor-pointer transition-opacity hover:opacity-95" onClick={() => setIsOpen(true)}>
                                <Image
                                    src={displaySrc(1)}
                                    alt={`${title} - Detail 1`}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 25vw, 50vw"
                                />
                            </div>
                        )}
                        {validImages[2] && (
                            <div className="relative h-full cursor-pointer transition-opacity hover:opacity-95" onClick={() => setIsOpen(true)}>
                                <Image
                                    src={displaySrc(2)}
                                    alt={`${title} - Detail 2`}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 25vw, 50vw"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tertiary Images Column */}
                    <div className="col-span-1 row-span-2 grid grid-rows-2 gap-2">
                        {validImages[3] && (
                            <div className="relative h-full cursor-pointer transition-opacity hover:opacity-95" onClick={() => setIsOpen(true)}>
                                <Image
                                    src={displaySrc(3)}
                                    alt={`${title} - Detail 3`}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 25vw, 50vw"
                                />
                            </div>
                        )}
                        {/* 5th Image with "View All" Overlay */}
                        {validImages[4] && (
                            <div className="relative h-full cursor-pointer transition-opacity hover:opacity-95" onClick={() => setIsOpen(true)}>
                                <Image
                                    src={displaySrc(4)}
                                    alt={`${title} - Detail 4`}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 25vw, 50vw"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                                    <Button variant="secondary" size="sm" className="gap-2 font-bold shadow-lg">
                                        <ImageIcon className="h-4 w-4" />
                                        Show all {validImages.length} photos
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox / Full Screen Gallery */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-black/95 border-none">
                    <VisuallyHidden.Root>
                        <DialogTitle>Gallery - {title}</DialogTitle>
                    </VisuallyHidden.Root>

                    <div className="relative h-full w-full overflow-y-auto p-4 md:p-10">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="fixed right-4 top-4 z-50 rounded-full bg-white/10 text-white hover:bg-white/20"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                            {validImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-gray-900">
                                    <Image
                                        src={img}
                                        alt={`Gallery image ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width: 768px) 50vw, (min-width: 1024px) 33vw, 100vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
