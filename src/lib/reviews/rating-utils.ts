import { prisma } from '@/lib/prisma';

/**
 * Calculate and update the average rating and review count for an experience
 */
export async function updateExperienceRating(experienceId: string): Promise<void> {
    const reviews = await prisma.review.findMany({
        where: { experienceId },
        select: { rating: true },
    });

    const reviewCount = reviews.length;
    const avgRating = reviewCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    await prisma.experience.update({
        where: { id: experienceId },
        data: {
            avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
            reviewCount,
        },
    });
}

/**
 * Mask a user's name for privacy
 * e.g., "John Smith" -> "J*** S***"
 */
export function maskUserName(name: string): string {
    if (!name) return 'Anonymous';

    const parts = name.trim().split(' ');
    return parts
        .map((part) => {
            if (part.length <= 1) return part[0] + '***';
            return part[0] + '***';
        })
        .join(' ');
}

/**
 * Check if a user can review an experience
 * Returns { canReview: boolean, reason?: string, bookingId?: string }
 */
export async function canUserReview(
    userId: string,
    experienceId: string
): Promise<{ canReview: boolean; reason?: string; bookingId?: string }> {
    // Check if user has a completed booking for this experience
    const booking = await prisma.booking.findFirst({
        where: {
            userId,
            experienceId,
            status: 'COMPLETED',
        },
        include: {
            review: true,
        },
    });

    if (!booking) {
        return {
            canReview: false,
            reason: 'You must complete a booking for this experience before leaving a review.',
        };
    }

    if (booking.review) {
        return {
            canReview: false,
            reason: 'You have already reviewed this experience.',
        };
    }

    return {
        canReview: true,
        bookingId: booking.id,
    };
}

/**
 * Validate review input
 */
export function validateReviewInput(data: {
    rating?: number;
    comment?: string;
    title?: string;
}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Rating validation
    if (data.rating === undefined || data.rating === null) {
        errors.push('Rating is required');
    } else if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
        errors.push('Rating must be an integer between 1 and 5');
    }

    // Comment validation
    if (!data.comment || typeof data.comment !== 'string') {
        errors.push('Comment is required');
    } else if (data.comment.trim().length < 30) {
        errors.push('Comment must be at least 30 characters');
    } else if (data.comment.length > 2000) {
        errors.push('Comment must not exceed 2000 characters');
    }

    // Title validation (optional)
    if (data.title && data.title.length > 100) {
        errors.push('Title must not exceed 100 characters');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
