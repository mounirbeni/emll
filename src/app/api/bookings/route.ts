
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Prisma } from '@prisma/client';
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/email';
import { z } from 'zod';
import { adminNotificationService } from '@/services/admin-notification.service';

const bookingSchema = z.object({
    experienceId: z.string(),
    userName: z.string().min(2),
    userEmail: z.string().email(),
    userPhone: z.string().min(8),
    date: z.string().or(z.date()), // Handle string input from JSON
    numberOfPeople: z.number().min(1),
    totalPrice: z.number().min(0),
    notes: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = bookingSchema.safeParse(body);

        if (!result.success) {
            // Explicitly cast error to accessing .errors which exists on ZodError
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NextResponse.json({ error: 'Invalid input', details: (result as any).error.errors }, { status: 400 });
        }

        const { experienceId, userName, userEmail, userPhone, date, numberOfPeople, totalPrice, notes } = result.data;

        // Create Booking
        const booking = await prisma.booking.create({
            data: {
                experienceId,
                userName,
                userEmail,
                userPhone,
                date: new Date(date),
                numberOfPeople,
                totalPrice,
                status: 'PENDING',
                notes,
            } as any, // Cast to any to bypass stale client type mismatch
            include: {
                experience: true,
            } as any, // Cast include to any
        });

        // Send Notifications (Non-blocking usually, but await here for simplicity or run Promise.all)
        await Promise.all([
            // Email to Customer
            sendEmail({
                to: userEmail,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                subject: `Booking Confirmation: ${(booking as any).experience.title}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                html: EMAIL_TEMPLATES.customerConfirmation(booking as any),
            }),
            // Email to Admin
            sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@example.com',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                subject: `New Booking: ${(booking as any).userName}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                html: EMAIL_TEMPLATES.adminNotification(booking as any),
            }),
            // Admin Notification (system-wide)
            adminNotificationService.notifyNewBooking(
                userName,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (booking as any).experience.title,
                booking.id
            ).catch(e => console.error("Failed to create admin notification:", e))
        ]);

        return NextResponse.json(booking, { status: 201 });

    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const experienceId = searchParams.get('experienceId');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (status) where.status = status as any; // Cast if status enum mismatch potential
    if (experienceId) where.experienceId = experienceId;

    if (date) {
        const d = new Date(date);
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);
        where.date = {
            gte: d,
            lt: nextDay
        };
    }

    try {
        const bookings = await prisma.booking.findMany({
            where,
             
            include: {
                experience: {
                    select: { title: true }
                }
            } as any,
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(bookings);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
