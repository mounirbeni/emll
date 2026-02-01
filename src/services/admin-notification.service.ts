/**
 * Admin Notification Service
 * Business logic for system-wide admin notifications
 */

import { AdminNotification, AdminNotificationType } from '@prisma/client';
import { adminNotificationRepository, AdminNotificationFilters } from '@/repositories/admin-notification.repository';

export interface CreateAdminNotificationDTO {
    type: AdminNotificationType;
    title: string;
    message: string;
    link?: string;
}

class AdminNotificationService {
    /**
     * Create a generic admin notification
     */
    async create(data: CreateAdminNotificationDTO): Promise<AdminNotification> {
        return await adminNotificationRepository.create({
            type: data.type,
            title: data.title,
            message: data.message,
            link: data.link || null,
        });
    }

    /**
     * Notify about a new booking
     */
    async notifyNewBooking(
        userName: string,
        experienceTitle: string,
        bookingId: string
    ): Promise<AdminNotification> {
        return await this.create({
            type: 'BOOKING',
            title: 'New Booking',
            message: `${userName} booked "${experienceTitle}"`,
            link: `/admin/bookings/${bookingId}`,
        });
    }

    /**
     * Notify about booking cancellation
     */
    async notifyBookingCancelled(
        userName: string,
        experienceTitle: string,
        bookingId: string
    ): Promise<AdminNotification> {
        return await this.create({
            type: 'CANCELLATION',
            title: 'Booking Cancelled',
            message: `${userName} cancelled booking for "${experienceTitle}"`,
            link: `/admin/bookings/${bookingId}`,
        });
    }

    /**
     * Notify about booking status change
     */
    async notifyBookingStatusChange(
        userName: string,
        experienceTitle: string,
        newStatus: string,
        bookingId: string
    ): Promise<AdminNotification> {
        const statusMessages: Record<string, string> = {
            CONFIRMED: 'confirmed',
            COMPLETED: 'completed',
            CANCELLED: 'cancelled',
        };

        return await this.create({
            type: newStatus === 'CANCELLED' ? 'CANCELLATION' : 'BOOKING',
            title: `Booking ${statusMessages[newStatus] || 'Updated'}`,
            message: `Booking for "${experienceTitle}" by ${userName} is now ${statusMessages[newStatus] || newStatus.toLowerCase()}`,
            link: `/admin/bookings/${bookingId}`,
        });
    }

    /**
     * Notify about a new review
     */
    async notifyNewReview(
        reviewerName: string,
        rating: number,
        experienceTitle: string,
        reviewId: string
    ): Promise<AdminNotification> {
        return await this.create({
            type: 'REVIEW',
            title: `New ${rating}-Star Review`,
            message: `${reviewerName} left a ${rating}-star review for "${experienceTitle}"`,
            link: `/admin/reviews`,
        });
    }

    /**
     * Notify about a new message/contact request
     */
    async notifyNewMessage(
        senderName: string,
        subject: string,
        supportId?: string
    ): Promise<AdminNotification> {
        return await this.create({
            type: 'MESSAGE',
            title: 'New Contact Request',
            message: `${senderName}: "${subject}"`,
            link: supportId ? `/admin/complaints/${supportId}` : '/admin/complaints',
        });
    }

    /**
     * Notify about a system alert
     */
    async notifySystemAlert(
        title: string,
        message: string,
        link?: string
    ): Promise<AdminNotification> {
        return await this.create({
            type: 'ALERT',
            title,
            message,
            link,
        });
    }

    /**
     * Notify about a system event
     */
    async notifySystemEvent(
        title: string,
        message: string,
        link?: string
    ): Promise<AdminNotification> {
        return await this.create({
            type: 'SYSTEM',
            title,
            message,
            link,
        });
    }

    /**
     * Get all notifications with optional filters
     */
    async getAll(filters?: AdminNotificationFilters): Promise<AdminNotification[]> {
        return await adminNotificationRepository.findAll(filters);
    }

    /**
     * Get unread notifications
     */
    async getUnread(limit?: number): Promise<AdminNotification[]> {
        return await adminNotificationRepository.findUnread(limit);
    }

    /**
     * Get unread count
     */
    async getUnreadCount(): Promise<number> {
        return await adminNotificationRepository.getUnreadCount();
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string): Promise<AdminNotification> {
        return await adminNotificationRepository.markAsRead(id);
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<number> {
        return await adminNotificationRepository.markAllAsRead();
    }

    /**
     * Delete notification
     */
    async delete(id: string): Promise<void> {
        await adminNotificationRepository.delete(id);
    }

    /**
     * Delete all notifications
     */
    async deleteAll(): Promise<number> {
        return await adminNotificationRepository.deleteAll();
    }

    /**
     * Cleanup old read notifications
     */
    async cleanup(daysOld: number = 30): Promise<number> {
        return await adminNotificationRepository.deleteOldRead(daysOld);
    }
}

export const adminNotificationService = new AdminNotificationService();
