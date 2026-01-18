/**
 * Support Service
 * Contains all business logic for support request operations
 */

import { SupportRequest } from '@prisma/client';
import { supportRepository } from '@/repositories/support.repository';
import { NotFoundError, BadRequestError } from '@/lib/errors';

export interface CreateSupportRequestDTO {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface UpdateSupportRequestDTO {
    status?: string;
}

export class SupportService {
    /**
     * Create a new support request
     */
    async createSupportRequest(data: CreateSupportRequestDTO): Promise<SupportRequest> {
        if (!data.name || !data.email || !data.subject || !data.message) {
            throw new BadRequestError('All fields are required');
        }

        return await supportRepository.create({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            status: 'PENDING'
        });
    }

    /**
     * Get all support requests (admin only)
     */
    async getAllRequests(): Promise<SupportRequest[]> {
        return await supportRepository.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get support request by ID
     */
    async getRequestById(id: string): Promise<SupportRequest> {
        const request = await supportRepository.findById(id);

        if (!request) {
            throw new NotFoundError('Support request', id);
        }

        return request;
    }

    /**
     * Get recent support requests
     */
    async getRecentRequests(limit: number = 5): Promise<SupportRequest[]> {
        return await supportRepository.findRecent(limit);
    }

    /**
     * Update support request status (admin only)
     */
    async updateRequestStatus(id: string, status: string): Promise<SupportRequest> {
        const exists = await supportRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('Support request', id);
        }

        return await supportRepository.update(id, {
            status
        });
    }

    /**
     * Get support stats
     */
    async getStats() {
        return await supportRepository.getStats();
    }

    /**
     * Get requests by status
     */
    async getRequestsByStatus(status: string): Promise<SupportRequest[]> {
        return await supportRepository.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Delete support request
     */
    async deleteRequest(id: string): Promise<void> {
        const exists = await supportRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('Support request', id);
        }

        await supportRepository.delete(id);
    }
}

// Export singleton instance
export const supportService = new SupportService();
