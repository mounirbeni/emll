'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
};

export default function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onChange,
    className,
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value: number) => {
        if (interactive && onChange) {
            onChange(value);
        }
    };

    const handleMouseEnter = (value: number) => {
        if (interactive) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const displayRating = hoverRating || rating;

    return (
        <div
            className={cn('flex items-center gap-0.5', className)}
            onMouseLeave={handleMouseLeave}
        >
            {Array.from({ length: maxRating }, (_, i) => {
                const value = i + 1;
                const isFilled = value <= displayRating;
                const isHalf = !isFilled && value - 0.5 <= displayRating;

                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => handleClick(value)}
                        onMouseEnter={() => handleMouseEnter(value)}
                        disabled={!interactive}
                        className={cn(
                            'transition-colors focus:outline-none',
                            interactive && 'cursor-pointer hover:scale-110',
                            !interactive && 'cursor-default'
                        )}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                'transition-colors',
                                isFilled
                                    ? 'fill-[#FF6900] text-[#FF6900]'
                                    : isHalf
                                        ? 'fill-[#FF6900]/50 text-[#FF6900]'
                                        : 'fill-transparent text-gray-300'
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
