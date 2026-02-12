import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { bookingService } from '@/services/booking.service';
import { DashboardHome } from '@/components/client/DashboardHome';
import { BookingStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string) {
    const [bookings, stats] = await Promise.all([
        bookingService.getUserBookings(userId),
        bookingService.getBookingStats(userId),
    ]);

    // Calculate next booking
    const now = new Date();
    const upcomingBookings = bookings
        .filter(
            (b) =>
                (b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED) &&
                new Date(b.date) > now
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const nextBooking = upcomingBookings[0] || null;

    return {
        stats,
        nextBooking,
    };
}

export default async function ClientDashboard() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const { stats, nextBooking } = await getDashboardData(session.user.id);

    return (
        <DashboardHome
            user={{
                name: session.user.name ?? null,
                email: session.user.email ?? null,
                id: session.user.id
            }}
            stats={stats}
            nextBooking={nextBooking}
        />
    );
}
