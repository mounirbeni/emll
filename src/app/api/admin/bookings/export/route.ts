import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse } from '@/lib/api-response';
import { format } from 'date-fns';
import { bookingService } from '@/services/booking.service';
import { BookingStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET: Export bookings as CSV
 */
export async function GET(request: Request) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Parse status
        let status: BookingStatus | undefined;
        if (statusParam && statusParam !== 'ALL') {
            const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
            if (validStatuses.includes(statusParam)) {
                status = statusParam as BookingStatus;
            }
        }

        // Fetch bookings via service
        const bookings = await bookingService.getAllBookings({
            status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });

        // Convert to CSV
        const headers = [
            'Booking ID',
            'Customer Name',
            'Email',
            'Phone',
            'Activity Title',
            'Date',
            'Time',
            'Guests',
            'Total Price',
            'Status',
            'Payment Status',
            'Created At'
        ];

        const rows = bookings.map(booking => [
            booking.id,
            booking.user?.name || booking.name,
            booking.user?.email || booking.email,
            booking.phone || '',
            booking.activityTitle,
            format(new Date(booking.date), 'yyyy-MM-dd'),
            format(new Date(booking.date), 'HH:mm'),
            booking.guests.toString(),
            Number(booking.totalPrice).toFixed(2),
            booking.status,
            booking.paymentStatus,
            format(new Date(booking.createdAt), 'yyyy-MM-dd HH:mm:ss')
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        // Return CSV file
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="bookings-${format(new Date(), 'yyyy-MM-dd')}.csv"`
            }
        });

    } catch (error) {
        return errorResponse(error);
    }
}

