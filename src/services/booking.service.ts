/**
 * Booking Service
 * Contains all business logic for booking operations
 */

import { Booking, BookingStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { bookingRepository } from '@/repositories/booking.repository';
import { notificationService } from '@/services/notification.service';
import { adminNotificationService } from '@/services/admin-notification.service';
import { NotFoundError, BadRequestError } from '@/lib/errors';

export interface CreateBookingDTO {
    experienceId: string;
    activityTitle: string; // Used for notifications/emails, not stored in DB
    date: Date;
    numberOfPeople: number;
    totalPrice: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    notes?: string;
}

export interface UpdateBookingDTO {
    date?: Date;
    numberOfPeople?: number;
    notes?: string;
}

export interface BookingStats {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    pending: number;
    totalRevenue: number;
}


export type BookingWithUser = Booking & {
    user: {
        id: string;
        name: string | null;
        email: string;
    } | null;
    experience: {
        id: string;
        title: string;
    };
};

export type DetailedBooking = Booking & {
    user: {
        id: string;
        name: string | null;
        email: string;
    } | null;
    payments: any[];
    experience: {
        title: string;
    };
};

export class BookingService {
    // ... createBooking ...

    /**
     * Get booking by ID
     */
    async getBookingById(id: string, userEmail?: string): Promise<DetailedBooking> {
        const booking = await bookingRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        // If userEmail provided, verify ownership
        // Access userEmail via the flat field on Booking model
        if (userEmail && booking.userEmail !== userEmail) {
            throw new NotFoundError('Booking', id);
        }

        return booking as unknown as DetailedBooking;
    }

    /**
     * Get all bookings for a user
     */
    async getUserBookings(userId: string): Promise<(Booking & { experience: { title: string } })[]> {
        return await bookingRepository.findByUserId(userId);
    }

    /**
     * Get all bookings (admin only)
     */
    async getAllBookings(filters?: {
        status?: BookingStatus;
        startDate?: Date;
        endDate?: Date
    }): Promise<BookingWithUser[]> {
        const where: Prisma.BookingWhereInput = {};

        if (filters?.status) {
            where.status = filters.status;
        }

        if (filters?.startDate || filters?.endDate) {
            where.date = {};
            if (filters.startDate) where.date.gte = filters.startDate;
            if (filters.endDate) where.date.lte = filters.endDate;
        }

        return await bookingRepository.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                experience: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        }) as unknown as BookingWithUser[];
    }

    /**
     * Update booking status
     */
    async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
        const booking = await bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        this.validateStatusTransition(booking.status, status);

        const updatedBooking = await bookingRepository.updateStatus(id, status);

        // Create admin notification for status change
        try {
            await adminNotificationService.notifyBookingStatusChange(
                booking.userName,
                booking.experienceId,
                status,
                booking.id
            );
        } catch (error) {
            console.error('Failed to create admin notification for status change:', error);
        }

        return updatedBooking;
    }

    /**
     * Confirm booking
     */
    async confirmBooking(id: string): Promise<Booking> {
        const booking = await bookingRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestError(`Cannot confirm booking with status: ${booking.status}`);
        }

        const updatedBooking = await this.updateBookingStatus(id, BookingStatus.CONFIRMED);

        try {
            const { emailService } = await import('@/services/email.service');
            await emailService.sendBookingConfirmation(
                booking.userEmail,
                booking.userName,
                booking.id,
                booking.experienceId,
                booking.date,
                booking.numberOfPeople,
                Number(booking.totalPrice)
            );
        } catch (error) {
            console.error('Failed to send confirmation email:', error);
        }

        return updatedBooking;
    }

    /**
     * Complete booking
     */
    async completeBooking(id: string): Promise<Booking> {
        const booking = await bookingRepository.findById(id);
        if (!booking) throw new NotFoundError('Booking', id);

        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestError(`Cannot complete booking with status: ${booking.status}`);
        }

        const updatedBooking = await this.updateBookingStatus(id, BookingStatus.COMPLETED);

        return updatedBooking;
    }

    /**
     * Cancel booking
     */
    async cancelBooking(id: string, userEmail?: string, isAdmin: boolean = false): Promise<Booking> {
        const booking = await bookingRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        // If userEmail provided and not admin, verify ownership
        if (userEmail && !isAdmin && booking.userEmail !== userEmail) {
            throw new NotFoundError('Booking', id);
        }

        if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestError(`Cannot cancel booking with status: ${booking.status}`);
        }

        if (!isAdmin) {
            const hoursBefore = 24;
            const cancellationDeadline = new Date(booking.date);
            cancellationDeadline.setHours(cancellationDeadline.getHours() - hoursBefore);

            if (new Date() > cancellationDeadline) {
                throw new BadRequestError(
                    `Bookings can only be cancelled at least ${hoursBefore} hours before the activity`
                );
            }
        }

        const updatedBooking = await this.updateBookingStatus(id, BookingStatus.CANCELLED);

        try {
            const { emailService } = await import('@/services/email.service');
            await emailService.sendBookingCancellation(
                booking.userEmail,
                booking.userName,
                booking.experienceId
            );
        } catch (error) {
            console.error('Failed to send cancellation email:', error);
        }

        return updatedBooking;
    }

    /**
     * Update booking details
     */
    async updateBooking(id: string, userEmail: string, data: UpdateBookingDTO): Promise<Booking> {
        const booking = await bookingRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        // Verify ownership by email
        if (booking.userEmail !== userEmail) {
            throw new NotFoundError('Booking', id);
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestError('Only pending bookings can be modified');
        }

        if (data.date && data.date <= new Date()) {
            throw new BadRequestError('Booking date must be in the future');
        }

        if (data.numberOfPeople && (data.numberOfPeople < 1 || data.numberOfPeople > 50)) {
            throw new BadRequestError('Number of people must be between 1 and 50');
        }

        return await bookingRepository.update(id, data);
    }

    /**
     * Get booking statistics
     */
    async getBookingStats(userId: string): Promise<BookingStats> {
        const [total, upcoming, completed, cancelled, pending, totals] = await Promise.all([
            bookingRepository.count({ userId }),
            bookingRepository.countByStatus(BookingStatus.CONFIRMED, userId),
            bookingRepository.countByStatus(BookingStatus.COMPLETED, userId),
            bookingRepository.countByStatus(BookingStatus.CANCELLED, userId),
            bookingRepository.countByStatus(BookingStatus.PENDING, userId),
            prisma.booking.aggregate({
                where: { userId, status: BookingStatus.COMPLETED },
                _sum: { totalPrice: true }
            })
        ]);

        const totalRevenue = (totals._sum && totals._sum.totalPrice) ? Number(totals._sum.totalPrice) : 0;

        return {
            total,
            upcoming,
            completed,
            cancelled,
            pending,
            totalRevenue
        };
    }

    /**
     * Get upcoming bookings
     */
    async getUpcomingBookings(userId?: string): Promise<Booking[]> {
        return await bookingRepository.findUpcoming(userId);
    }

    /**
     * Get past bookings
     */
    async getPastBookings(userId?: string): Promise<Booking[]> {
        return await bookingRepository.findPast(userId);
    }

    /**
     * Get recent bookings (admin)
     */
    async getRecentBookings(limit: number = 5) {
        return await bookingRepository.findRecent(limit);
    }

    /**
     * Delete booking (admin only)
     */
    async deleteBooking(id: string): Promise<void> {
        const exists = await bookingRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('Booking', id);
        }

        await bookingRepository.delete(id);
    }

    /**
     * Check if a time slot is available
     */
    async checkAvailability(experienceId: string, date: Date): Promise<boolean> {
        const timeWindowStart = new Date(date);
        timeWindowStart.setMinutes(timeWindowStart.getMinutes() - 30);

        const timeWindowEnd = new Date(date);
        timeWindowEnd.setMinutes(timeWindowEnd.getMinutes() + 30);

        const conflictingBookings = await bookingRepository.findMany({
            where: {
                experienceId,
                date: {
                    gte: timeWindowStart,
                    lte: timeWindowEnd
                },
                status: {
                    in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
                }
            }
        });

        return conflictingBookings.length === 0;
    }

    /**
     * Validate status transition
     */
    private validateStatusTransition(currentStatus: BookingStatus, newStatus: BookingStatus): void {
        const validTransitions: Record<BookingStatus, BookingStatus[]> = {
            [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
            [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
            [BookingStatus.COMPLETED]: [], // Cannot change from completed
            [BookingStatus.CANCELLED]: []  // Cannot change from cancelled
        };

        const allowedStatuses = validTransitions[currentStatus] || [];

        if (!allowedStatuses.includes(newStatus)) {
            throw new BadRequestError(
                `Cannot transition from ${currentStatus} to ${newStatus}`
            );
        }
    }
}

// Export singleton instance
export const bookingService = new BookingService();
