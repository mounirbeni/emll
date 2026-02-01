import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { BookingStatus } from '@prisma/client';
import { generateShortId, ShortIdPrefix } from '@/lib/id-generator';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

// Validation schema for public booking (stricter - all fields required)
const publicBookingSchema = z.object({
    experienceId: z.string().min(1, 'Experience ID is required'),
    experienceTitle: z.string().min(1, 'Experience Title is required'),
    date: z.string().datetime().transform((str) => new Date(str)),
    numberOfPeople: z.coerce.number().int().min(1, 'At least 1 person required').max(50, 'Maximum 50 people'),
    totalPrice: z.coerce.number().positive('Total price must be positive'),
    userName: z.string().min(2, 'Name must be at least 2 characters'),
    userEmail: z.string().email('Invalid email address'),
    userPhone: z.string().min(8, 'Phone number is required'),
    specialRequests: z.string().optional(),
});

/**
 * POST: Create a new booking (PUBLIC - no authentication required)
 * This endpoint allows guests to book without logging in
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate payload
        const validationResult = publicBookingSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: validationResult.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Validate booking date is in the future
        const now = new Date();
        const bookingDate = new Date(data.date);

        if (bookingDate <= now) {
            return NextResponse.json(
                { success: false, error: 'Booking date must be in the future' },
                { status: 400 }
            );
        }

        // Create booking directly in database (no userId for guest bookings)
        const booking = await prisma.booking.create({
            data: {
                id: generateShortId(ShortIdPrefix.BOOKING),
                userName: data.userName,
                userEmail: data.userEmail,
                userPhone: data.userPhone,
                experienceId: data.experienceId,
                date: data.date,
                numberOfPeople: data.numberOfPeople,
                totalPrice: data.totalPrice,
                specialRequests: data.specialRequests || null,
                status: BookingStatus.PENDING,
                // userId is null for guest bookings
            }
        });

        // Send emails asynchronously (don't block the response)
        sendBookingEmails(booking, data).catch(err => {
            console.error('Failed to send booking emails:', err);
        });

        // Generate WhatsApp link for customer
        const whatsappLink = generateWhatsAppLink({
            userName: data.userName,
            experienceTitle: data.experienceTitle,
            date: data.date,
            numberOfPeople: data.numberOfPeople,
            totalPrice: data.totalPrice
        });

        return NextResponse.json({
            success: true,
            data: {
                bookingId: booking.id,
                status: booking.status,
                experienceTitle: data.experienceTitle,
                date: data.date,
                numberOfPeople: data.numberOfPeople,
                totalPrice: data.totalPrice,
                whatsappLink
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Public booking error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create booking. Please try again.' },
            { status: 500 }
        );
    }
}

/**
 * Send booking confirmation emails (background task)
 */
async function sendBookingEmails(
    booking: { id: string },
    data: { userName: string; userEmail: string; experienceTitle: string; date: Date; numberOfPeople: number; totalPrice: number }
) {
    try {
        const { emailService } = await import('@/services/email.service');

        // Send confirmation email to customer
        await emailService.sendBookingReceived(
            data.userEmail,
            data.userName,
            booking.id,
            data.experienceTitle,
            data.date,
            data.numberOfPeople,
            data.totalPrice
        );

        // Send notification email to admin
        await emailService.sendAdminBookingNotification(
            booking.id,
            data.experienceTitle,
            data.date,
            data.numberOfPeople,
            data.totalPrice,
            data.userName,
            data.userEmail
        );

        // Create admin notification in database
        const { notificationService } = await import('@/services/notification.service');

        // Find admin users to notify
        const adminUsers = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true }
        });

        for (const admin of adminUsers) {
            await notificationService.createNotification({
                userId: admin.id,
                title: 'New Booking',
                message: `New booking from ${data.userName} for ${data.experienceTitle}`,
                type: 'BOOKING',
                link: `/admin/bookings`
            });
        }
    } catch (error) {
        console.error('Failed to send booking emails:', error);
        // Don't throw - we don't want to fail the booking if emails fail
    }
}
