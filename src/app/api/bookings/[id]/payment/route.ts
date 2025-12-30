
import { NextResponse } from 'next/server';
import { bookingService } from '@/services/booking.service';
import { paymentService } from '@/services/payment.service';
import { requireAuth } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';
import { createPaymentSchema } from '@/lib/validation';
import { z } from 'zod';

const routePaymentSchema = createPaymentSchema.omit({ bookingId: true });

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth();
        const { id: bookingId } = await params;

        // Verify booking ownership
        const booking = await bookingService.getBookingById(bookingId, session.user.id);

        const body = await request.json();
        const validation = routePaymentSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(validation.error);
        }

        const { amount, method, currency } = validation.data;

        // Create Payment Record
        const payment = await paymentService.createPayment({
            bookingId,
            amount,
            method,
            currency
        });

        // Auto-process for demo purposes (Simulator)
        // In a real app, we would redirect to a gateway here.
        // We simulate a successful transaction immediately.
        const completedPayment = await paymentService.processPayment({
            paymentId: payment.id,
            metadata: {
                simulation: true,
                processedBy: 'system-demo'
            }
        });

        // Send payment receipt email
        try {
            const { emailService } = await import('@/services/email.service');
            await emailService.sendPaymentReceipt(
                booking.email,
                booking.name,
                booking.id,
                amount,
                booking.activityTitle
            );
        } catch (error) {
            console.error('Failed to send payment receipt email:', error);
            // Don't fail payment if email fails
        }

        return successResponse(completedPayment);

    } catch (error) {
        return errorResponse(error);
    }
}
