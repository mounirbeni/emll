
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateBookingSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
    notes: z.string().optional(),
});

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Params are Promises in Next.js 15+ usually, but checking patterns. safe to treat as standard or use generic params access if dynamic.
    // Actually, in recent Next.js versions params is a Promise. I will treat it as such to be safe or await it.
) {
    const { id } = await params;
    try {
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                experience: true,
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking);
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await req.json();
        const result = updateBookingSchema.safeParse(body);

        if (!result.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NextResponse.json({ error: 'Invalid input', details: (result as any).error.errors }, { status: 400 });
        }

        const { status, notes } = result.data;

        // Get current booking state to check for status change
        const currentBooking = await prisma.booking.findUnique({
            where: { id },
            select: { status: true, userId: true, experienceId: true },
        });

        const booking = await prisma.booking.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(notes && { notes }),
            },
            include: {
                experience: true
            } as any // eslint-disable-line @typescript-eslint/no-explicit-any
        });

        // If status changed to COMPLETED and user is registered, send review notification
        if (status === 'COMPLETED' && currentBooking?.status !== 'COMPLETED' && booking.userId) {
            // Create notification for user to leave a review
            await prisma.notification.create({
                data: {
                    userId: booking.userId,
                    title: 'How was your experience?',
                    message: `We hope you enjoyed "${(booking as any).experience?.title}". Share your review to help other travelers!`,
                    type: 'REVIEW',
                    link: `/experiences/${booking.experienceId}/review`,
                },
            });
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.booking.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }
}
