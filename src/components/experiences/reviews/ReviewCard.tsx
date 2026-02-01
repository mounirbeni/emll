'use client';

import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';
import StarRating from './StarRating';
import Image from 'next/image';

interface ReviewCardProps {
    review: {
        id: string;
        rating: number;
        title?: string | null;
        comment: string;
        images?: string[];
        userName: string;
        verified?: boolean;
        createdAt: Date | string;
    };
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const formattedDate = format(new Date(review.createdAt), 'MMMM d, yyyy');

    return (
        <div className="border-b border-gray-100 py-6 last:border-b-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6900] to-[#FF8C00] flex items-center justify-center text-white font-semibold text-sm">
                        {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{review.userName}</span>
                            {review.verified && (
                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <span className="text-sm text-gray-500">{formattedDate}</span>
                    </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Title */}
            {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
            )}

            {/* Comment */}
            <p className="text-gray-600 leading-relaxed">{review.comment}</p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                    {review.images.map((image, idx) => (
                        <div
                            key={idx}
                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                        >
                            <Image
                                src={image}
                                alt={`Review photo ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
