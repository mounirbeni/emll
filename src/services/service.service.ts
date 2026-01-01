/**
 * Service Service (Activity Service)
 * Contains all business logic for service/activity operations
 */

import { Service } from '@prisma/client';
import { serviceRepository } from '@/repositories/service.repository';
import { generateShortId, ShortIdPrefix } from '@/lib/id-generator';
import { NotFoundError, BadRequestError } from '@/lib/errors';

export interface CreateServiceDTO {
    title: string;
    description: string;
    price: number;
    category: string;
    duration: string;
    location: string;
    latitude?: number;
    longitude?: number;
    images: string[];
    features: string[];
    included: string[];
    whatToBring: string[];
    tags: string[];
    itinerary: any;
    host: string;
}

export interface UpdateServiceDTO {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    duration?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
    features?: string[];
    included?: string[];
    whatToBring?: string[];
    tags?: string[];
    itinerary?: any;
    host?: string;
}

export interface ServiceFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'price' | 'rating' | 'reviews' | 'newest';
    sortOrder?: 'asc' | 'desc';
}

export interface ServiceStats {
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    reviewCount: number;
}

export class ServiceService {
    /**
     * Create a new service
     */
    async createService(data: CreateServiceDTO): Promise<Service> {
        // Validate required fields
        if (!data.title || data.title.trim().length === 0) {
            throw new BadRequestError('Service title is required');
        }

        if (!data.description || data.description.trim().length === 0) {
            throw new BadRequestError('Service description is required');
        }

        if (data.price <= 0 || data.price > 100000) {
            throw new BadRequestError('Price must be between 0 and 100,000');
        }

        // Create service with native arrays
        const service = await serviceRepository.create({
            id: generateShortId(ShortIdPrefix.SERVICE),
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category,
            duration: data.duration,
            location: data.location,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            images: data.images || [],
            features: data.features || [],
            included: data.included || [],
            whatToBring: data.whatToBring || [],
            tags: data.tags || [],
            itinerary: data.itinerary || [], // Prisma Json type accepts array/object
            host: data.host || 'Explore Marrakesh',
            rating: 0,
            reviews: 0
        });


        return service;
    }

    /**
     * Get service by ID
     */
    async getServiceById(id: string): Promise<Service> {
        const service = await serviceRepository.findById(id);

        if (!service) {
            throw new NotFoundError('Service', id);
        }

        return service;
    }

    /**
     * Get all services with optional filters
     */
    async getServices(filters?: ServiceFilters): Promise<Service[]> {
        let services: Service[];

        if (filters?.search) {
            services = await serviceRepository.search(filters.search);
        } else if (filters?.category) {
            services = await serviceRepository.findByCategory(filters.category);
        } else if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            const min = filters.minPrice || 0;
            const max = filters.maxPrice || 999999;
            services = await serviceRepository.findByPriceRange(min, max);
        } else {
            // Get all services
            const orderBy = this.buildOrderBy(filters?.sortBy, filters?.sortOrder);
            services = await serviceRepository.findMany({ orderBy });
        }

        return services;
    }

    /**
     * Get top rated services
     */
    async getTopRatedServices(limit: number = 10): Promise<Service[]> {
        const services = await serviceRepository.findTopRated(limit);
        return services;
    }

    /**
     * Update service
     */
    async updateService(id: string, data: UpdateServiceDTO): Promise<Service> {
        // Verify service exists
        const exists = await serviceRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('Service', id);
        }

        // Validate price if provided
        if (data.price !== undefined && (data.price <= 0 || data.price > 100000)) {
            throw new BadRequestError('Price must be between 0 and 100,000');
        }

        // Build update data
        const updateData: any = { ...data };

        const service = await serviceRepository.update(id, updateData);
        return service;
    }

    /**
     * Delete service
     */
    async deleteService(id: string): Promise<void> {
        const exists = await serviceRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('Service', id);
        }

        // TODO: Check if service has active bookings
        // TODO: Prevent deletion if there are upcoming bookings

        await serviceRepository.delete(id);
    }

    /**
     * Get all categories
     */
    async getCategories(): Promise<string[]> {
        return await serviceRepository.getCategories();
    }

    /**
     * Update service rating
     */
    async updateServiceRating(serviceId: string, newRating: number): Promise<Service> {
        const service = await serviceRepository.findById(serviceId);

        if (!service) {
            throw new NotFoundError('Service', serviceId);
        }

        // Calculate new average rating
        const currentTotal = service.rating * service.reviews;
        const newReviewCount = service.reviews + 1;
        const newAverageRating = (currentTotal + newRating) / newReviewCount;

        const updated = await serviceRepository.updateRating(
            serviceId,
            Math.round(newAverageRating * 10) / 10, // Round to 1 decimal
            newReviewCount
        );

        return updated;
    }

    /**
     * Build orderBy clause for queries
     */
    private buildOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc'): any {
        switch (sortBy) {
            case 'price':
                return { price: sortOrder };
            case 'rating':
                return { rating: sortOrder };
            case 'reviews':
                return { reviews: sortOrder };
            case 'newest':
                return { createdAt: 'desc' };
            default:
                return { createdAt: 'desc' };
        }
    }
}

// Export singleton instance
export const serviceService = new ServiceService();
