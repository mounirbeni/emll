import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { emailService } from '@/services/email.service';
import { addHours, startOfDay, endOfDay } from 'date-fns';

/**
 * POST: Send booking reminders for bookings happening in 24 hours
 * This can be called by a cron job or scheduled task
 */
export async function POST(request: Request) {
    try {
        await requireAdmin();

        // Find bookings happening in the next 24-25 hours (to catch all bookings for tomorrow)
        const tomorrow = addHours(new Date(), 24);
        const tomorrowEnd = addHours(new Date(), 25);

        const upcomingBookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: startOfDay(tomorrow),
                    lte: endOfDay(tomorrowEnd)
                },
                status: {
                    in: ['CONFIRMED', 'PENDING']
                },
                // Only send to bookings that haven't received a reminder yet
                // You might want to add a 'reminderSent' field to track this
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        let sentCount = 0;
        let failedCount = 0;

        for (const booking of upcomingBookings) {
            try {
                await emailService.sendBookingReminder(
                    booking.user?.email || booking.email,
                    booking.user?.name || booking.name,
                    booking.activityTitle,
                    booking.date,
                    booking.guests
                );
                sentCount++;
            } catch (error) {
                console.error(`Failed to send reminder for booking ${booking.id}:`, error);
                failedCount++;
            }
        }

        return successResponse({
            total: upcomingBookings.length,
            sent: sentCount,
            failed: failedCount,
            message: `Sent ${sentCount} reminders, ${failedCount} failed`
        });
    } catch (error) {
        return errorResponse(error);
    }
}

/**
 * GET: Check how many reminders would be sent (for testing)
 */
export async function GET() {
    try {
        await requireAdmin();

        const tomorrow = addHours(new Date(), 24);
        const tomorrowEnd = addHours(new Date(), 25);

        const upcomingBookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: startOfDay(tomorrow),
                    lte: endOfDay(tomorrowEnd)
                },
                status: {
                    in: ['CONFIRMED', 'PENDING']
                }
            },
            select: {
                id: true,
                activityTitle: true,
                date: true,
                email: true,
                name: true
            }
        });

        return successResponse({
            count: upcomingBookings.length,
            bookings: upcomingBookings
        });
    } catch (error) {
        return errorResponse(error);
    }
}

