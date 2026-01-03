/**
 * Notification Repository
 * Handles all database operations for notifications
 */

import { prisma } from '@/lib/prisma';
import { Notification, NotificationType, Prisma } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

export class NotificationRepository implements BaseRepository<
    Notification,
    Prisma.NotificationCreateInput,
    Prisma.NotificationUpdateInput,
    Prisma.NotificationWhereInput
> {
    /**
     * Create a new notification
     */
    async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
        return await prisma.notification.create({ data });
    }

    /**
     * Create multiple notifications
     */
    async createMany(data: Prisma.NotificationCreateManyInput[]): Promise<number> {
        const result = await prisma.notification.createMany({
            data,
            skipDuplicates: true
        });
        return result.count;
    }

    /**
     * Find notification by ID
     */
    async findById(id: string): Promise<Notification | null> {
        return await prisma.notification.findUnique({
            where: { id }
        });
    }

    /**
     * Find many notifications with options
     */
    async findMany(options?: FindManyOptions<Prisma.NotificationWhereInput>): Promise<Notification[]> {
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

        return await prisma.notification.findMany(query);
    }

    /**
     * Find notifications by user ID
     */
    async findByUserId(userId: string, limit?: number): Promise<Notification[]> {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    /**
     * Find unread notifications for a user
     */
    async findUnread(userId: string): Promise<Notification[]> {
        return await prisma.notification.findMany({
            where: {
                userId,
                read: false
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get unread count for a user
     */
    async getUnreadCount(userId: string): Promise<number> {
        return await prisma.notification.count({
            where: {
                userId,
                read: false
            }
        });
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string): Promise<Notification> {
        return await prisma.notification.update({
            where: { id },
            data: { read: true }
        });
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<number> {
        const result = await prisma.notification.updateMany({
            where: {
                userId,
                read: false
            },
            data: { read: true }
        });
        return result.count;
    }

    /**
     * Mark multiple notifications as read
     */
    async markManyAsRead(ids: string[]): Promise<number> {
        const result = await prisma.notification.updateMany({
            where: {
                id: { in: ids }
            },
            data: { read: true }
        });
        return result.count;
    }

    /**
     * Update notification
     */
    async update(id: string, data: Prisma.NotificationUpdateInput): Promise<Notification> {
        return await prisma.notification.update({
            where: { id },
            data
        });
    }

    /**
     * Delete notification
     */
    async delete(id: string): Promise<void> {
        await prisma.notification.delete({
            where: { id }
        });
    }

    /**
     * Delete old read notifications
     */
    async deleteOldRead(daysOld: number = 30): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await prisma.notification.deleteMany({
            where: {
                read: true,
                createdAt: { lt: cutoffDate }
            }
        });
        return result.count;
    }

    /**
     * Delete all notifications for a user
     */
    async deleteAllForUser(userId: string): Promise<number> {
        const result = await prisma.notification.deleteMany({
            where: { userId }
        });
        return result.count;
    }

    /**
     * Count notifications
     */
    async count(where?: Prisma.NotificationWhereInput): Promise<number> {
        return await prisma.notification.count({ where });
    }

    /**
     * Check if notification exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.notification.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Find notifications by type
     */
    async findByType(userId: string, type: NotificationType): Promise<Notification[]> {
        return await prisma.notification.findMany({
            where: {
                userId,
                type
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get recent notifications
     */
    async findRecent(userId: string, limit: number = 10): Promise<Notification[]> {
        return await prisma.notification.findMany({
            where: { userId },
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
    }
}

// Export singleton instance
export const notificationRepository = new NotificationRepository();
