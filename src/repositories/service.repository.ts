/**
 * Service Repository
 * Handles all database operations for services/activities
 */

import prisma from '@/lib/prisma';
import { Service, Prisma } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

export class ServiceRepository implements BaseRepository<
    Service,
    Prisma.ServiceCreateInput,
    Prisma.ServiceUpdateInput,
    Prisma.ServiceWhereInput
> {
    /**
     * Create a new service
     */
    async create(data: Prisma.ServiceCreateInput): Promise<Service> {
        return await prisma.service.create({ data });
    }

    /**
     * Find service by ID
     */
    async findById(id: string): Promise<Service | null> {
        return await prisma.service.findUnique({
            where: { id },
            include: {
                userReviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    /**
     * Find many services with options
     */
    async findMany(options?: FindManyOptions<Prisma.ServiceWhereInput>): Promise<Service[]> {
        const query: any = {
            where: options?.where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { createdAt: 'desc' },
        };

        // Add either include or select, but not both
        if (options?.include) {
            query.include = options.include;
        } else if (options?.select) {
            query.select = options.select;
        }

        return await prisma.service.findMany(query);
    }

    /**
     * Find services by category
     */
    async findByCategory(category: string): Promise<Service[]> {
        return await prisma.service.findMany({
            where: { category },
            orderBy: { rating: 'desc' }
        });
    }

    /**
     * Search services by title or description
     */
    async search(query: string): Promise<Service[]> {
        return await prisma.service.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            },
            orderBy: { rating: 'desc' }
        });
    }

    /**
     * Find top rated services
     */
    async findTopRated(limit: number = 10): Promise<Service[]> {
        return await prisma.service.findMany({
            take: limit,
            orderBy: { rating: 'desc' }
        });
    }

    /**
     * Find services by price range
     */
    async findByPriceRange(minPrice: number, maxPrice: number): Promise<Service[]> {
        return await prisma.service.findMany({
            where: {
                price: {
                    gte: minPrice,
                    lte: maxPrice
                }
            },
            orderBy: { price: 'asc' }
        });
    }

    /**
     * Update service
     */
    async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
        return await prisma.service.update({
            where: { id },
            data
        });
    }

    /**
     * Update service rating
     */
    async updateRating(id: string, rating: number, reviewCount: number): Promise<Service> {
        return await prisma.service.update({
            where: { id },
            data: { rating, reviews: reviewCount }
        });
    }

    /**
     * Delete service
     */
    async delete(id: string): Promise<void> {
        await prisma.service.delete({
            where: { id }
        });
    }

    /**
     * Count services
     */
    async count(where?: Prisma.ServiceWhereInput): Promise<number> {
        return await prisma.service.count({ where });
    }

    /**
     * Check if service exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.service.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Find service by title (fallback for static activities)
     * Case-insensitive search
     */
    async findByTitle(title: string): Promise<Service | null> {
        return await prisma.service.findFirst({
            where: { 
                title: {
                    equals: title,
                    mode: 'insensitive'
                }
            }
        });
    }

    /**
     * Get all categories
     */
    async getCategories(): Promise<string[]> {
        const services = await prisma.service.findMany({
            select: { category: true },
            distinct: ['category']
        });
        return services.map(s => s.category);
    }
}

// Export singleton instance
export const serviceRepository = new ServiceRepository();
