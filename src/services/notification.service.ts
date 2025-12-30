/**
 * Notification Service
 * Contains all business logic for notification operations
 */

import { Notification } from '@prisma/client';
import { notificationRepository } from '@/repositories/notification.repository';
import { NotFoundError, BadRequestError } from '@/lib/errors';

export interface CreateNotificationDTO {
    userId: string;
    title: string;
    message: string;
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BOOKING';
    link?: string;
}

export class NotificationService {
    /**
     * Create a notification
     */
    async createNotification(data: CreateNotificationDTO): Promise<Notification> {
        if (!data.title || data.title.trim().length === 0) {
            throw new BadRequestError('Notification title is required');
        }

        if (!data.message || data.message.trim().length === 0) {
            throw new BadRequestError('Notification message is required');
        }

        return await notificationRepository.create({
            user: { connect: { id: data.userId } },
            title: data.title.trim(),
            message: data.message.trim(),
            type: data.type || 'INFO',
            link: data.link || null
        });
    }

    /**
     * Create multiple notifications for multiple users
     */
    async createBulkNotifications(
        userIds: string[],
        title: string,
        message: string,
        type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BOOKING',
        link?: string
    ): Promise<number> {
        const notifications = userIds.map(userId => ({
            userId,
            title: title.trim(),
            message: message.trim(),
            type: type || 'INFO',
            link: link || null,
            read: false
        }));

        return await notificationRepository.createMany(notifications);
    }

    /**
     * Send booking confirmation notification
     */
    async sendBookingConfirmation(userId: string, bookingId: string, activityTitle: string): Promise<Notification> {
        return await this.createNotification({
            userId,
            title: 'Booking Confirmed',
            message: `Your booking for "${activityTitle}" has been confirmed!`,
            type: 'BOOKING',
            link: `/bookings/${bookingId}`
        });
    }

    /**
     * Send booking status update notification
     */
    async sendBookingStatusUpdate(
        userId: string,
        bookingId: string,
        activityTitle: string,
        newStatus: string
    ): Promise<Notification> {
        const statusMessages: Record<string, string> = {
            CONFIRMED: 'Your booking has been confirmed',
            CANCELLED: 'Your booking has been cancelled',
            COMPLETED: 'Your booking is complete! We hope you enjoyed the experience'
        };

        return await this.createNotification({
            userId,
            title: 'Booking Status Updated',
            message: `${statusMessages[newStatus] || 'Booking status updated'} for "${activityTitle}"`,
            type: 'BOOKING',
            link: `/bookings/${bookingId}`
        });
    }

    /**
     * Send payment confirmation notification
     */
    async sendPaymentConfirmation(userId: string, bookingId: string, amount: number): Promise<Notification> {
        return await this.createNotification({
            userId,
            title: 'Payment Received',
            message: `We have received your payment of €${amount.toFixed(2)}. Thank you!`,
            type: 'SUCCESS',
            link: `/bookings/${bookingId}`
        });
    }

    /**
     * Send welcome notification
     */
    async sendWelcomeNotification(userId: string, userName?: string): Promise<Notification> {
        return await this.createNotification({
            userId,
            title: `Welcome${userName ? `, ${userName}` : ''}!`,
            message: 'Thank you for joining us. Explore our amazing experiences and create unforgettable memories!',
            type: 'SUCCESS',
            link: '/services'
        });
    }

    /**
     * Get notifications for a user
     */
    async getUserNotifications(userId: string, limit?: number): Promise<Notification[]> {
        return await notificationRepository.findByUserId(userId, limit);
    }

    /**
     * Get unread notifications
     */
    async getUnreadNotifications(userId: string): Promise<Notification[]> {
        return await notificationRepository.findUnread(userId);
    }

    /**
     * Get unread count
     */
    async getUnreadCount(userId: string): Promise<number> {
        return await notificationRepository.getUnreadCount(userId);
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string, userId?: string): Promise<Notification> {
        const notification = await notificationRepository.findById(id);

        if (!notification) {
            throw new NotFoundError('Notification', id);
        }

        // If userId provided, verify ownership
        if (userId && notification.userId !== userId) {
            throw new BadRequestError('You can only mark your own notifications as read');
        }

        return await notificationRepository.markAsRead(id);
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<number> {
        return await notificationRepository.markAllAsRead(userId);
    }

    /**
     * Mark multiple notifications as read
     */
    async markManyAsRead(ids: string[], userId?: string): Promise<number> {
        // If userId provided, verify all notifications belong to user
        if (userId) {
            const notifications = await Promise.all(
                ids.map(id => notificationRepository.findById(id))
            );

            const allBelongToUser = notifications.every(
                n => n && n.userId === userId
            );

            if (!allBelongToUser) {
                throw new BadRequestError('You can only mark your own notifications as read');
            }
        }

        return await notificationRepository.markManyAsRead(ids);
    }

    /**
     * Delete notification
     */
    async deleteNotification(id: string, userId?: string): Promise<void> {
        const notification = await notificationRepository.findById(id);

        if (!notification) {
            throw new NotFoundError('Notification', id);
        }

        // If userId provided, verify ownership
        if (userId && notification.userId !== userId) {
            throw new BadRequestError('You can only delete your own notifications');
        }

        await notificationRepository.delete(id);
    }

    /**
     * Delete all notifications for a user
     */
    async deleteAllForUser(userId: string): Promise<number> {
        return await notificationRepository.deleteAllForUser(userId);
    }

    /**
     * Clean up old read notifications
     */
    async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
        return await notificationRepository.deleteOldRead(daysOld);
    }

    /**
     * Get notifications by type
     */
    async getNotificationsByType(userId: string, type: string): Promise<Notification[]> {
        return await notificationRepository.findByType(userId, type);
    }

    /**
     * Get recent notifications
     */
    async getRecentNotifications(userId: string, limit: number = 10): Promise<Notification[]> {
        return await notificationRepository.findRecent(userId, limit);
    }
}

// Export singleton instance
export const notificationService = new NotificationService();
