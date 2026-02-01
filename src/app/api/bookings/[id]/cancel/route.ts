import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Fetch the booking
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { experience: { select: { title: true } } }
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Verify ownership
        if (booking.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Check if booking can be cancelled
        if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
            return NextResponse.json(
                { error: "Only pending or confirmed bookings can be cancelled" },
                { status: 400 }
            );
        }

        // Update booking status
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status: "CANCELLED" },
        });

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId: session.user.id,
                type: "BOOKING",
                title: "Booking Cancelled",
                message: `Your booking for "${booking.experience.title}" has been cancelled.`,
                read: false,
            },
        });

        return NextResponse.json({
            success: true,
            booking: updatedBooking,
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return NextResponse.json(
            { error: "Failed to cancel booking" },
            { status: 500 }
        );
    }
}
