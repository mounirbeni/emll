/**
 * Admin Notification Repository
 * Data access layer for system-wide admin notifications
 */

import { prisma } from '@/lib/prisma';
import { AdminNotification, AdminNotificationType, Prisma } from '@prisma/client';

export interface AdminNotificationFilters {
    type?: AdminNotificationType;
    read?: boolean;
    limit?: number;
    offset?: number;
}

class AdminNotificationRepository {
    /**
     * Create a new admin notification
     */
    async create(data: Prisma.AdminNotificationCreateInput): Promise<AdminNotification> {
        return await prisma.adminNotification.create({ data });
    }

    /**
     * Find all admin notifications with optional filters
     */
    async findAll(filters: AdminNotificationFilters = {}): Promise<AdminNotification[]> {
        const { type, read, limit = 50, offset = 0 } = filters;

        const where: Prisma.AdminNotificationWhereInput = {};
        if (type) where.type = type;
        if (read !== undefined) where.read = read;

        return await prisma.adminNotification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }

    /**
     * Find unread notifications
     */
    async findUnread(limit?: number): Promise<AdminNotification[]> {
        return await prisma.adminNotification.findMany({
            where: { read: false },
            orderBy: { createdAt: 'desc' },
            take: limit || 50,
        });
    }

    /**
     * Get unread count
     */
    async getUnreadCount(): Promise<number> {
        return await prisma.adminNotification.count({
            where: { read: false },
        });
    }

    /**
     * Find by ID
     */
    async findById(id: string): Promise<AdminNotification | null> {
        return await prisma.adminNotification.findUnique({
            where: { id },
        });
    }

    /**
     * Mark single notification as read
     */
    async markAsRead(id: string): Promise<AdminNotification> {
        return await prisma.adminNotification.update({
            where: { id },
            data: { read: true },
        });
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<number> {
        const result = await prisma.adminNotification.updateMany({
            where: { read: false },
            data: { read: true },
        });
        return result.count;
    }

    /**
     * Delete a notification
     */
    async delete(id: string): Promise<void> {
        await prisma.adminNotification.delete({
            where: { id },
        });
    }

    /**
     * Delete all notifications
     */
    async deleteAll(): Promise<number> {
        const result = await prisma.adminNotification.deleteMany({});
        return result.count;
    }

    /**
     * Delete old read notifications (cleanup)
     */
    async deleteOldRead(daysOld: number = 30): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await prisma.adminNotification.deleteMany({
            where: {
                read: true,
                createdAt: { lt: cutoffDate },
            },
        });
        return result.count;
    }
}

export const adminNotificationRepository = new AdminNotificationRepository();
