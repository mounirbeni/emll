/**
 * Booking Service
 * Contains all business logic for booking operations
 */

import { Booking, BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { bookingRepository } from '@/repositories/booking.repository';
import { serviceRepository } from '@/repositories/service.repository';
import { notificationService } from '@/services/notification.service';
import { generateShortId, ShortIdPrefix } from '@/lib/id-generator';
import { NotFoundError, BadRequestError } from '@/lib/errors';

export interface CreateBookingDTO {
    activityId: string;
    activityTitle: string;
    date: Date;
    guests: number;
    totalPrice: number;
    pickupLocation?: string;
    phone?: string;
    name: string;
    email: string;
    flightNumber?: string;
    language?: string;
    dietary?: string;
    specialRequests?: string;
    packageName?: string;
}

export interface UpdateBookingDTO {
    date?: Date;
    guests?: number;
    pickupLocation?: string;
    phone?: string;
    specialRequests?: string;
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
    service?: {
        title: string;
    } | null;
};

export class BookingService {
    /**
     * Create a new booking
     */
    async createBooking(data: CreateBookingDTO, userId: string): Promise<Booking> {
        // Validate activity exists by ID first
        let activityExists = await serviceRepository.exists(data.activityId);
        let actualActivityId = data.activityId;

        // If not found by ID, try to find by title (fallback for static activities)
        if (!activityExists) {
            console.warn(`Activity with ID ${data.activityId} not found. Trying to find by title: ${data.activityTitle}`);
            const serviceByTitle = await serviceRepository.findByTitle(data.activityTitle);
            if (serviceByTitle) {
                actualActivityId = serviceByTitle.id;
                activityExists = true;
                console.log(`Found activity by title. Using database ID: ${actualActivityId}`);
            }
        }

        // If still not found, try one more time with case-insensitive title search
        // and also try partial matching
        if (!activityExists) {
            // Try case-insensitive search again (in case findByTitle didn't work)
            const allServices = await serviceRepository.findMany({});
            const matchingService = allServices.find(s =>
                s.title.toLowerCase().trim() === data.activityTitle.toLowerCase().trim() ||
                s.title.toLowerCase().includes(data.activityTitle.toLowerCase()) ||
                data.activityTitle.toLowerCase().includes(s.title.toLowerCase())
            );

            if (matchingService) {
                actualActivityId = matchingService.id;
                activityExists = true;
                console.log(`Found service by fuzzy title match. Using database ID: ${actualActivityId}`);
            }
        }

        // If still not found, create the service automatically from booking data
        // This ensures bookings always work even if the service wasn't pre-created
        if (!activityExists) {
            console.log(`Service not found. Creating service automatically from booking data: ${data.activityTitle}`);
            try {
                const { generateShortId, ShortIdPrefix } = await import('@/lib/id-generator');

                // Check one more time if service was created by another concurrent request
                const doubleCheck = await serviceRepository.findByTitle(data.activityTitle);
                if (doubleCheck) {
                    actualActivityId = doubleCheck.id;
                    activityExists = true;
                    console.log(`Service found after double-check. Using database ID: ${actualActivityId}`);
                } else {
                    const newService = await serviceRepository.create({
                        id: generateShortId(ShortIdPrefix.SERVICE),
                        title: data.activityTitle,
                        description: `Service created from booking: ${data.activityTitle}`,
                        price: data.totalPrice / data.guests, // Calculate price per person
                        category: 'Experience', // Default category
                        duration: 'TBD',
                        location: 'Marrakech',
                        images: [],
                        features: [],
                        included: [],
                        whatToBring: [],
                        tags: [],
                        itinerary: [],
                        host: 'Explore Marrakesh',
                        rating: 0,
                        reviews: 0,
                    });

                    actualActivityId = newService.id;
                    activityExists = true;
                    console.log(`Created new service with ID: ${actualActivityId}`);
                }
            } catch (error) {
                console.error('Failed to create service automatically:', error);
                // If creation fails, try one last time to find by title (case-insensitive)
                const lastAttempt = await serviceRepository.findByTitle(data.activityTitle);
                if (lastAttempt) {
                    actualActivityId = lastAttempt.id;
                    activityExists = true;
                } else {
                    // Final fallback: throw a user-friendly error
                    throw new NotFoundError(
                        'Activity',
                        data.activityId,
                        `Unable to process booking for "${data.activityTitle}". Please try again or contact support.`
                    );
                }
            }
        }

        // Validate booking date is in the future
        // Compare dates properly - allow same day if time is in the future
        const now = new Date();
        const bookingDate = new Date(data.date);

        // If booking is for today, check if time is in the future
        if (bookingDate.toDateString() === now.toDateString()) {
            // Same day - check if time is in the future (at least 1 hour ahead)
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
            if (bookingDate <= oneHourFromNow) {
                throw new BadRequestError('Booking must be at least 1 hour in advance');
            }
        } else if (bookingDate <= now) {
            // Past date
            throw new BadRequestError('Booking date must be in the future');
        }

        // Validate guests count
        if (data.guests < 1 || data.guests > 50) {
            throw new BadRequestError('Number of guests must be between 1 and 50');
        }

        if (data.totalPrice <= 0 || data.totalPrice > 100000) {
            throw new BadRequestError('Invalid price value');
        }

        // Check for double bookings
        const isAvailable = await this.checkAvailability(actualActivityId, bookingDate);

        if (!isAvailable) {
            throw new BadRequestError('This time slot is already booked. Please choose another time.');
        }

        // Create booking (use actualActivityId if we found it by title)
        const booking = await bookingRepository.create({
            id: generateShortId(ShortIdPrefix.BOOKING),
            userId,
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            activityId: actualActivityId, // Use the actual database ID
            activityTitle: data.activityTitle,
            date: data.date,
            guests: data.guests,
            totalPrice: data.totalPrice,
            pickupLocation: data.pickupLocation || null,
            flightNumber: data.flightNumber || null,
            language: data.language || null,
            dietary: data.dietary || null,
            specialRequests: data.specialRequests || null,
            packageName: data.packageName || null,
            status: BookingStatus.PENDING,
            paymentStatus: PaymentStatus.UNPAID
        });

        // Send notification to user if they have an account
        if (userId) {
            try {
                await notificationService.sendBookingConfirmation(
                    userId,
                    booking.id,
                    data.activityTitle
                );
            } catch (error) {
                // Don't fail booking creation if notification fails
                console.error('Failed to send booking confirmation notification:', error);
            }
        }

        // Send booking received email (for both logged-in and guest users)
        // This is NOT a confirmation - just acknowledging receipt of the booking request
        try {
            const { emailService } = await import('@/services/email.service');
            await emailService.sendBookingReceived(
                data.email,
                data.name,
                booking.id,
                data.activityTitle,
                data.date,
                data.guests,
                data.totalPrice
            );

            await emailService.sendAdminBookingNotification(
                booking.id,
                data.activityTitle,
                data.date,
                data.guests,
                data.totalPrice,
                data.name,
                data.email
            );
        } catch (error) {
            // Don't fail booking creation if email fails
            console.error('Failed to send booking received email:', error);
        }

        return booking;
    }

    /**
     * Get booking by ID
     */
    async getBookingById(id: string, userId?: string): Promise<Booking> {
        const booking = await bookingRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        // If userId provided, verify ownership (admins bypass this in the route)
        if (userId && booking.userId !== userId) {
            throw new NotFoundError('Booking', id); // Don't reveal existence
        }

        return booking;
    }

    /**
     * Get all bookings for a user
     */
    async getUserBookings(userId: string): Promise<Booking[]> {
        return await bookingRepository.findByUserId(userId);
    }

    /**
     * Get all bookings (admin only)
     */
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
                service: {
                    select: {
                        title: true
                    }
                }
            }
        }) as unknown as BookingWithUser[];
    }

    /**
     * Update booking status
     */
    async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
        // Validate booking exists
        const booking = await bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        // Validate status transition
        this.validateStatusTransition(booking.status, status);

        // Update status
        const updatedBooking = await bookingRepository.updateStatus(id, status);

        // Send notification to user if they have an account
        if (booking.userId) {
            try {
                await notificationService.sendBookingStatusUpdate(
                    booking.userId,
                    booking.id,
                    booking.activityTitle,
                    status
                );
            } catch (error) {
                // Don't fail status update if notification fails
                console.error('Failed to send status update notification:', error);
            }
        }

        return updatedBooking;
    }

    /**
     * Cancel booking
     */
    /**
     * Confirm booking
     */
    async confirmBooking(id: string, userId?: string): Promise<Booking> {
        const booking = await bookingRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        // If userId provided, verify ownership (though usually admins confirm)
        if (userId && booking.userId !== userId) {
            // throw new NotFoundError('Booking', id); // Admins can confirm
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestError(`Cannot confirm booking with status: ${booking.status}`);
        }

        const updatedBooking = await this.updateBookingStatus(id, BookingStatus.CONFIRMED);

        // Send confirmation email
        try {
            const { emailService } = await import('@/services/email.service');
            await emailService.sendBookingConfirmation(
                booking.email,
                booking.name,
                booking.id,
                booking.activityTitle,
                booking.date,
                booking.guests,
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

        // Rule 2: Completed Experience Bonus (+100 points)
        if (booking.userId) {
            try {
                // We need to use raw prisma client here to access other models
                // Ideally this should be in a user/points service, but keeping it simple for now
                const { default: prisma } = await import('@/lib/prisma');

                await prisma.user.update({
                    where: { id: booking.userId },
                    data: {
                        loyaltyPoints: { increment: 100 },
                        pointsHistory: {
                            create: {
                                points: 100,
                                reason: 'Completed experience',
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Failed to award points for completed booking:', error);
                // Don't fail the completion itself
            }
        }

        return updatedBooking;
    }

    /**
     * Cancel booking
     */
    async cancelBooking(id: string, userId?: string, isAdmin: boolean = false): Promise<Booking> {
        const booking = await bookingRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        // Verify ownership if not admin
        if (userId && !isAdmin && booking.userId !== userId) {
            throw new NotFoundError('Booking', id);
        }

        // Check if booking can be cancelled
        if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestError(`Cannot cancel booking with status: ${booking.status}`);
        }

        // Check cancellation policy (e.g., 24 hours before) - Skip for admins
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

        // Send cancellation email
        try {
            const { emailService } = await import('@/services/email.service');
            // Check if payment was made to determine refund info
            const refundAmount = booking.paymentStatus === 'PAID' ? Number(booking.totalPrice) : undefined;

            await emailService.sendBookingCancellation(
                booking.email,
                booking.name,
                booking.activityTitle,
                refundAmount
            );
        } catch (error) {
            console.error('Failed to send cancellation email:', error);
        }

        return updatedBooking;
    }

    /**
     * Update booking details
     */
    async updateBooking(id: string, userId: string, data: UpdateBookingDTO): Promise<Booking> {
        const booking = await bookingRepository.findById(id);

        if (!booking) {
            throw new NotFoundError('Booking', id);
        }

        // Verify ownership
        if (booking.userId !== userId) {
            throw new NotFoundError('Booking', id);
        }

        // Only allow updates for pending bookings
        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestError('Only pending bookings can be modified');
        }

        // Validate date if provided
        if (data.date && data.date <= new Date()) {
            throw new BadRequestError('Booking date must be in the future');
        }

        // Validate guests if provided
        if (data.guests && (data.guests < 1 || data.guests > 50)) {
            throw new BadRequestError('Number of guests must be between 1 and 50');
        }

        return await bookingRepository.update(id, data);
    }

    /**
     * Get booking statistics
     */
    async getBookingStats(userId?: string): Promise<BookingStats> {
        const where = userId ? { userId } : undefined;

        const [total, upcoming, completed, cancelled, pending, totalRevenue] = await Promise.all([
            bookingRepository.count(where),
            bookingRepository.countByStatus(BookingStatus.CONFIRMED, userId),
            bookingRepository.countByStatus(BookingStatus.COMPLETED, userId),
            bookingRepository.countByStatus(BookingStatus.CANCELLED, userId),
            bookingRepository.countByStatus(BookingStatus.PENDING, userId),
            bookingRepository.getTotalRevenue(where)
        ]);

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
    async checkAvailability(activityId: string, date: Date): Promise<boolean> {
        const timeWindowStart = new Date(date);
        timeWindowStart.setMinutes(timeWindowStart.getMinutes() - 30);

        const timeWindowEnd = new Date(date);
        timeWindowEnd.setMinutes(timeWindowEnd.getMinutes() + 30);

        const conflictingBookings = await bookingRepository.findMany({
            where: {
                activityId,
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
