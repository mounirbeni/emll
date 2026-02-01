import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { bookingService } from '@/services/booking.service';
import { BookingDetailsClient } from './booking-details-client';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getBookingDetails(bookingId: string, userId: string) {
    try {
        const booking = await bookingService.getBookingById(bookingId, userId);
        return booking;
    } catch {
        return null;
    }
}

export default async function BookingDetailsPage({ params }: PageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const { id } = await params;
    const booking = await getBookingDetails(id, session.user.id);

    if (!booking) {
        notFound();
    }

    return <BookingDetailsClient booking={booking} />;
}
