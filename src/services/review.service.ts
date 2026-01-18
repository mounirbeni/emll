/**
 * Review Service
 * Contains all business logic for review operations
 */

import { Review, ReviewStatus } from '@prisma/client';
import { reviewRepository } from '@/repositories/review.repository';
import { bookingRepository } from '@/repositories/booking.repository';
import { serviceRepository } from '@/repositories/service.repository';
import { NotFoundError, BadRequestError, ConflictError } from '@/lib/errors';

export interface CreateReviewDTO {
    bookingId: string;
    serviceId: string;
    userId: string;
    rating: number;
    comment: string;
}

export interface UpdateReviewDTO {
    rating?: number;
    comment?: string;
}

export class ReviewService {
    /**
     * Create a new review
     */
    async createReview(data: CreateReviewDTO): Promise<Review> {
        // Validate booking exists
        const booking = await bookingRepository.findById(data.bookingId);
        if (!booking) {
            throw new NotFoundError('Booking', data.bookingId);
        }

        // Validate service exists
        const service = await serviceRepository.findById(data.serviceId);
        if (!service) {
            throw new NotFoundError('Service', data.serviceId);
        }

        // Verify booking belongs to user
        if (booking.userId !== data.userId) {
            throw new BadRequestError('You can only review your own bookings');
        }

        // Verify booking is completed
        if (booking.status !== 'COMPLETED') {
            throw new BadRequestError('You can only review completed bookings');
        }

        // Check if already reviewed
        const existingReview = await reviewRepository.findByBookingId(data.bookingId);
        if (existingReview) {
            throw new ConflictError('This booking has already been reviewed');
        }

        // Validate rating
        if (data.rating < 1 || data.rating > 5) {
            throw new BadRequestError('Rating must be between 1 and 5');
        }

        // Validate comment
        if (!data.comment || data.comment.trim().length < 10) {
            throw new BadRequestError('Review comment must be at least 10 characters long');
        }

        // Create review
        const review = await reviewRepository.create({
            booking: { connect: { id: data.bookingId } },
            service: { connect: { id: data.serviceId } },
            user: { connect: { id: data.userId } },
            rating: data.rating,
            comment: data.comment.trim(),
            status: 'PENDING' // Default status for new reviews
        });

        // Update service rating
        await this.updateServiceRating(data.serviceId);

        return review;
    }

    /**
     * Update service rating based on all reviews
     */
    private async updateServiceRating(serviceId: string): Promise<void> {
        const averageRating = await reviewRepository.getAverageRating(serviceId);
        const reviewCount = await reviewRepository.getReviewCount(serviceId);

        await serviceRepository.updateRating(
            serviceId,
            Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount
        );
    }


    /**
     * Update review status (Admin only)
     */
    async updateStatus(id: string, status: ReviewStatus): Promise<Review> {
        const review = await reviewRepository.findById(id);
        if (!review) throw new NotFoundError('Review', id);

        const updated = await reviewRepository.update(id, { status });

        // Recalculate if visibility changed
        if (status === ReviewStatus.APPROVED || (review.status as any) === ReviewStatus.APPROVED) {
            await this.updateServiceRating(review.serviceId);
        }
        return updated;
    }

    /**
     * Get review by ID
     */
    async getReviewById(id: string): Promise<Review> {
        const review = await reviewRepository.findById(id);

        if (!review) {
            throw new NotFoundError('Review', id);
        }

        return review;
    }

    /**
     * Get reviews for a service
     */
    async getServiceReviews(serviceId: string, limit?: number): Promise<Review[]> {
        return await reviewRepository.findByServiceId(serviceId, limit);
    }

    /**
     * Get reviews by user
     */
    async getUserReviews(userId: string): Promise<Review[]> {
        return await reviewRepository.findByUserId(userId);
    }

    /**
     * Update review
     */
    async updateReview(id: string, userId: string, data: UpdateReviewDTO): Promise<Review> {
        const review = await reviewRepository.findById(id);

        if (!review) {
            throw new NotFoundError('Review', id);
        }

        // Verify ownership
        if (review.userId !== userId) {
            throw new BadRequestError('You can only update your own reviews');
        }

        // Validate rating if provided
        if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
            throw new BadRequestError('Rating must be between 1 and 5');
        }

        // Validate comment if provided
        if (data.comment !== undefined && data.comment.trim().length < 10) {
            throw new BadRequestError('Review comment must be at least 10 characters long');
        }

        // Update review
        const updatedReview = await reviewRepository.update(id, {
            ...(data.rating !== undefined && { rating: data.rating }),
            ...(data.comment !== undefined && { comment: data.comment.trim() })
        });

        // Update service rating if rating changed
        if (data.rating !== undefined) {
            await this.updateServiceRating(review.serviceId);
        }

        return updatedReview;
    }

    /**
     * Delete review
     */
    async deleteReview(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
        const review = await reviewRepository.findById(id);

        if (!review) {
            throw new NotFoundError('Review', id);
        }

        // Verify ownership or admin
        if (!isAdmin && review.userId !== userId) {
            throw new BadRequestError('You can only delete your own reviews');
        }

        const serviceId = review.serviceId;

        // Delete review
        await reviewRepository.delete(id);

        // Update service rating
        await this.updateServiceRating(serviceId);
    }

    /**
     * Get recent reviews
     */
    async getRecentReviews(limit: number = 10): Promise<Review[]> {
        return await reviewRepository.findRecent(limit);
    }

    /**
     * Get reviews by rating
     */
    async getReviewsByRating(serviceId: string, rating: number): Promise<Review[]> {
        if (rating < 1 || rating > 5) {
            throw new BadRequestError('Rating must be between 1 and 5');
        }

        return await reviewRepository.findByRating(serviceId, rating);
    }

    /**
     * Get rating distribution for a service
     */
    async getRatingDistribution(serviceId: string): Promise<Record<number, number>> {
        return await reviewRepository.getRatingDistribution(serviceId);
    }

    /**
     * Check if user can review a booking
     */
    async canReviewBooking(bookingId: string, userId: string): Promise<{
        canReview: boolean;
        reason?: string;
    }> {
        const booking = await bookingRepository.findById(bookingId);

        if (!booking) {
            return { canReview: false, reason: 'Booking not found' };
        }

        if (booking.userId !== userId) {
            return { canReview: false, reason: 'Not your booking' };
        }

        if (booking.status !== 'COMPLETED') {
            return { canReview: false, reason: 'Booking not completed yet' };
        }

        const hasReviewed = await reviewRepository.hasUserReviewedBooking(bookingId);
        if (hasReviewed) {
            return { canReview: false, reason: 'Already reviewed' };
        }

        return { canReview: true };
    }

    /**
     * Get average rating for a service
     */
    async getAverageRating(serviceId: string): Promise<number> {
        return await reviewRepository.getAverageRating(serviceId);
    }

    /**
     * Get review count for a service
     */
    async getReviewCount(serviceId: string): Promise<number> {
        return await reviewRepository.getReviewCount(serviceId);
    }
}

// Export singleton instance
export const reviewService = new ReviewService();
