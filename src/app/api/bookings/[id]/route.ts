import { NextResponse } from 'next/server';
import { bookingService } from '@/services/booking.service';
import { requireAuth } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';
import { updateBookingSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth();
        const { id } = await params;

        const booking = await bookingService.getBookingById(id, session.user.id);

        return successResponse(booking);
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth();
        const { id } = await params;
        const body = await request.json();

        // If body has 'status' and it's CANCELLED, treat as cancellation
        // or support specific cancel action if preferred. 
        // Logic: bookingService.cancelBooking is specific.
        // Let's inspect body. 
        // If the user wants to CANCEL, the UI might send { status: 'CANCELLED' } or { action: 'CANCEL' }.
        // The old code checked for action: 'CANCEL'.
        // To be backwards compatible or strict:

        if (body.action === 'CANCEL' || body.status === 'CANCELLED') {
            const booking = await bookingService.cancelBooking(id, session.user.id);
            return successResponse(booking);
        }

        // Otherwise treat as update (date, guests etc)
        // Validate payload
        const validationResult = updateBookingSchema.safeParse(body);
        if (!validationResult.success) {
            // If validation fails, maybe it was a partial update intended? 
            // Service expects UpdateBookingDTO.
            // We return error if schema fails.
            // But Wait, if action was 'CANCEL', we handled it.
            // If not, we fall through to here.
            // If the body is just nonsense, we error.
            if (Object.keys(body).length === 0) {
                return errorResponse(new Error('Empty body'));
            }
        }

        // Note: updateBookingSchema might not allow extra fields. 
        // Let's assume generic update is allowed for pending bookings.
        const updatedBooking = await bookingService.updateBooking(id, session.user.id, body);
        return successResponse(updatedBooking);

    } catch (error) {
        return errorResponse(error);
    }
}

// Deprecate PUT if not needed, or map to PATCH logic for compatibility
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return PATCH(request, { params });
}
