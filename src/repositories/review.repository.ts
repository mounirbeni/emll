/**
 * Review Repository
 * Handles all database operations for reviews
 */

import prisma from '@/lib/prisma';
import { Review, Prisma } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

export class ReviewRepository implements BaseRepository<
    Review,
    Prisma.ReviewCreateInput,
    Prisma.ReviewUpdateInput,
    Prisma.ReviewWhereInput
> {
    /**
     * Create a new review
     */
    async create(data: Prisma.ReviewCreateInput): Promise<Review> {
        return await prisma.review.create({ data });
    }

    /**
     * Find review by ID
     */
    async findById(id: string): Promise<Review | null> {
        return await prisma.review.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                service: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                booking: {
                    select: {
                        id: true,
                        date: true,
                    }
                }
            }
        });
    }

    /**
     * Find many reviews with options
     */
    async findMany(options?: FindManyOptions<Prisma.ReviewWhereInput>): Promise<Review[]> {
        const query: any = {
            where: options?.where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { createdAt: 'desc' },
        };

        if (options?.include) {
            query.include = options.include;
        } else if (options?.select) {
            query.select = options.select;
        }

        return await prisma.review.findMany(query);
    }

    /**
     * Find reviews by service ID
     */
    async findByServiceId(serviceId: string, limit?: number): Promise<Review[]> {
        return await prisma.review.findMany({
            where: { serviceId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    /**
     * Find reviews by user ID
     */
    async findByUserId(userId: string): Promise<Review[]> {
        return await prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                service: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });
    }

    /**
     * Find review by booking ID
     */
    async findByBookingId(bookingId: string): Promise<Review | null> {
        return await prisma.review.findUnique({
            where: { bookingId }
        });
    }

    /**
     * Get average rating for a service (approved reviews only)
     */
    async getAverageRating(serviceId: string): Promise<number> {
        const result = await prisma.review.aggregate({
            where: { serviceId, status: 'APPROVED' },
            _avg: {
                rating: true
            }
        });
        return result._avg.rating || 0;
    }

    /**
     * Get review count for a service (approved reviews only)
     */
    async getReviewCount(serviceId: string): Promise<number> {
        return await prisma.review.count({
            where: { serviceId, status: 'APPROVED' }
        });
    }

    /**
     * Get reviews by rating
     */
    async findByRating(serviceId: string, rating: number): Promise<Review[]> {
        return await prisma.review.findMany({
            where: {
                serviceId,
                rating
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get recent reviews across all services
     */
    async findRecent(limit: number = 10): Promise<Review[]> {
        return await prisma.review.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                service: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });
    }

    /**
     * Update review
     */
    async update(id: string, data: Prisma.ReviewUpdateInput): Promise<Review> {
        return await prisma.review.update({
            where: { id },
            data
        });
    }

    /**
     * Delete review
     */
    async delete(id: string): Promise<void> {
        await prisma.review.delete({
            where: { id }
        });
    }

    /**
     * Count reviews
     */
    async count(where?: Prisma.ReviewWhereInput): Promise<number> {
        return await prisma.review.count({ where });
    }

    /**
     * Check if review exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.review.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Check if user has reviewed a booking
     */
    async hasUserReviewedBooking(bookingId: string): Promise<boolean> {
        const count = await prisma.review.count({
            where: { bookingId }
        });
        return count > 0;
    }

    /**
     * Get rating distribution for a service
     */
    async getRatingDistribution(serviceId: string): Promise<Record<number, number>> {
        const reviews = await prisma.review.findMany({
            where: { serviceId },
            select: { rating: true }
        });

        const distribution: Record<number, number> = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };

        reviews.forEach(review => {
            distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        });

        return distribution;
    }
}

// Export singleton instance
export const reviewRepository = new ReviewRepository();
