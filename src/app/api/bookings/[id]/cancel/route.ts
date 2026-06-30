import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";
import { refundPayPalCapture } from '@/lib/paypal';
import { PaymentMethod, TransactionStatus, PaymentStatus } from '@prisma/client';

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

        // Fetch the booking with payments
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                experience: { select: { title: true } },
                payments: {
                    where: {
                        method: PaymentMethod.PAYPAL,
                        status: TransactionStatus.COMPLETED,
                    },
                    select: { id: true, transactionId: true, amount: true, currency: true },
                },
            },
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

        // Attempt PayPal refund for any completed PayPal payments
        let refunded = false;
        for (const payment of booking.payments) {
            if (payment.transactionId) {
                try {
                    await refundPayPalCapture(
                        payment.transactionId,
                        Number(payment.amount),
                        payment.currency,
                    );
                    // No REFUNDED status in TransactionStatus — booking.paymentStatus handles this
                    refunded = true;
                } catch (refundErr) {
                    console.error('[cancel] PayPal refund failed for payment', payment.id, refundErr);
                }
            }
        }

        // Update booking status and payment status
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: "CANCELLED",
                ...(refunded && { paymentStatus: PaymentStatus.REFUNDED }),
            },
        });

        // Create notification for user
        await prisma.notification.create({
            data: {
                userId: session.user.id,
                type: "BOOKING",
                title: "Booking Cancelled",
                message: `Your booking for "${booking.experience.title}" has been cancelled.${refunded ? ' A refund has been initiated.' : ''}`,
                read: false,
            },
        });

        return NextResponse.json({
            success: true,
            booking: updatedBooking,
            refunded,
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return NextResponse.json(
            { error: "Failed to cancel booking" },
            { status: 500 }
        );
    }
}
