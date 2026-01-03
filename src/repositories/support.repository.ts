/**
 * Support Request Repository
 * Handles all database operations for support requests
 */

import { prisma } from '@/lib/prisma';
import { SupportRequest, Prisma } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

export class SupportRepository implements BaseRepository<
    SupportRequest,
    Prisma.SupportRequestCreateInput,
    Prisma.SupportRequestUpdateInput,
    Prisma.SupportRequestWhereInput
> {
    /**
     * Create a new support request
     */
    async create(data: Prisma.SupportRequestCreateInput): Promise<SupportRequest> {
        return await prisma.supportRequest.create({ data });
    }

    /**
     * Find support request by ID
     */
    async findById(id: string): Promise<SupportRequest | null> {
        return await prisma.supportRequest.findUnique({
            where: { id }
        });
    }

    /**
     * Find many support requests with options
     */
    async findMany(options?: FindManyOptions<Prisma.SupportRequestWhereInput>): Promise<SupportRequest[]> {
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

        return await prisma.supportRequest.findMany(query);
    }

    /**
     * Find support requests by email
     */
    async findByEmail(email: string): Promise<SupportRequest[]> {
        return await prisma.supportRequest.findMany({
            where: { email },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find support requests by status
     */
    async findByStatus(status: string): Promise<SupportRequest[]> {
        return await prisma.supportRequest.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find pending support requests
     */
    async findPending(): Promise<SupportRequest[]> {
        return await this.findByStatus('PENDING');
    }

    /**
     * Find resolved support requests
     */
    async findResolved(): Promise<SupportRequest[]> {
        return await this.findByStatus('RESOLVED');
    }

    /**
     * Find recent support requests
     */
    async findRecent(limit: number = 10): Promise<SupportRequest[]> {
        return await prisma.supportRequest.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Update support request
     */
    async update(id: string, data: Prisma.SupportRequestUpdateInput): Promise<SupportRequest> {
        return await prisma.supportRequest.update({
            where: { id },
            data
        });
    }

    /**
     * Update support request status
     */
    async updateStatus(id: string, status: string): Promise<SupportRequest> {
        return await prisma.supportRequest.update({
            where: { id },
            data: {
                status,
                updatedAt: new Date()
            }
        });
    }

    /**
     * Mark as resolved
     */
    async markAsResolved(id: string): Promise<SupportRequest> {
        return await this.updateStatus(id, 'RESOLVED');
    }

    /**
     * Mark as in progress
     */
    async markAsInProgress(id: string): Promise<SupportRequest> {
        return await this.updateStatus(id, 'IN_PROGRESS');
    }

    /**
     * Delete support request
     */
    async delete(id: string): Promise<void> {
        await prisma.supportRequest.delete({
            where: { id }
        });
    }

    /**
     * Count support requests
     */
    async count(where?: Prisma.SupportRequestWhereInput): Promise<number> {
        return await prisma.supportRequest.count({ where });
    }

    /**
     * Count by status
     */
    async countByStatus(status: string): Promise<number> {
        return await prisma.supportRequest.count({
            where: { status }
        });
    }

    /**
     * Check if support request exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.supportRequest.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Search support requests
     */
    async search(query: string): Promise<SupportRequest[]> {
        return await prisma.supportRequest.findMany({
            where: {
                OR: [
                    { subject: { contains: query, mode: 'insensitive' } },
                    { message: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get statistics
     */
    async getStats(): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
    }> {
        const [total, pending, inProgress, resolved] = await Promise.all([
            this.count(),
            this.countByStatus('PENDING'),
            this.countByStatus('IN_PROGRESS'),
            this.countByStatus('RESOLVED')
        ]);

        return {
            total,
            pending,
            inProgress,
            resolved
        };
    }
}

// Export singleton instance
export const supportRepository = new SupportRepository();
