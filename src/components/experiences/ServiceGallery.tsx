'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ServiceGalleryProps {
    images: string[];
    title: string;
}

export default function ServiceGallery({ images, title }: ServiceGalleryProps) {
    // Ensure we have at least some images for the grid
    const displayImages = images && images.length > 0 ? images : ['/placeholders/experience-placeholder.jpg'];

    return (
        <div className="relative h-[400px] w-full overflow-hidden rounded-xl md:h-[500px]">
            <div className="grid h-full grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2">
                {/* Main large image */}
                <div className="relative col-span-2 row-span-2 md:col-span-2 md:row-span-2">
                    <Image
                        src={displayImages[0]}
                        alt={`${title} main`}
                        fill
                        className="cursor-pointer object-cover transition-opacity hover:opacity-95"
                        priority
                    />
                </div>

                {/* Secondary images */}
                <div className="relative hidden md:col-span-1 md:row-span-1 md:block">
                    {
                        displayImages[1] && (
                            <Image
                                src={displayImages[1]}
                                alt={`${title} 2`}
                                fill
                                className="cursor-pointer object-cover transition-opacity hover:opacity-95"
                            />
                        )
                    }
                </div>
                <div className="relative hidden md:col-span-1 md:row-span-1 md:block">
                    {
                        displayImages[2] && (
                            <Image
                                src={displayImages[2]}
                                alt={`${title} 3`}
                                fill
                                className="cursor-pointer object-cover transition-opacity hover:opacity-95"
                            />
                        )
                    }
                </div>
                <div className="relative hidden md:col-span-1 md:row-span-1 md:block">
                    {
                        displayImages[3] && (
                            <Image
                                src={displayImages[3]}
                                alt={`${title} 4`}
                                fill
                                className="cursor-pointer object-cover transition-opacity hover:opacity-95"
                            />
                        )
                    }
                </div>
                <div className="relative hidden md:col-span-1 md:row-span-1 md:block">
                    {
                        displayImages[4] && (
                            <Image
                                src={displayImages[4]}
                                alt={`${title} 5`}
                                fill
                                className="cursor-pointer object-cover transition-opacity hover:opacity-95"
                            />
                        )
                    }
                    {
                        displayImages.length > 5 && (
                            <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-white transition-colors hover:bg-black/50">
                                <div className="flex items-center gap-2 font-medium">
                                    <ImageIcon className="h-5 w-5" />
                                    <span>See all {displayImages.length} photos</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Mobile view all button */}
            <div className="absolute bottom-4 right-4 md:hidden">
                <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-md">
                    <ImageIcon className="h-4 w-4" />
                    <span>{displayImages.length} photos</span>
                </button>
            </div>
        </div>
    );
}
