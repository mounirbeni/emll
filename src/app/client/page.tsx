import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Calendar,
    Clock,
    CheckCircle,
    MapPin,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { bookingService } from '@/services/booking.service';
import { StatsCard } from '@/components/dashboard/stats-card';
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
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hello, {session.user.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Ready for your next adventure?
                    </p>
                </div>
                <Link href="/services">
                    <Button className="rounded-full bg-black text-white hover:bg-gray-800 shadow-lg hidden md:flex">
                        Explore
                    </Button>
                </Link>
            </div>

            {/* Next Trip Card (Hero) */}
            {nextBooking ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-[#FF5F00] to-[#FF8A4D] rounded-3xl p-6 text-white shadow-xl shadow-orange-200/50">
                    <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                                Next Trip
                            </span>
                            <div className="text-right">
                                <p className="text-3xl font-bold">
                                    {new Date(nextBooking.date).getDate()}
                                </p>
                                <p className="text-sm opacity-90 uppercase tracking-wider">
                                    {new Date(nextBooking.date).toLocaleDateString('en-US', { month: 'short' })}
                                </p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 leading-tight">
                            {nextBooking.activityTitle}
                        </h2>

                        <div className="flex items-center gap-4 text-sm opacity-90 mb-6 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {new Date(nextBooking.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="w-1 h-1 bg-white/50 rounded-full" />
                            <span className="capitalize">
                                {nextBooking.status.toLowerCase()}
                            </span>
                        </div>

                        <Link href={`/client/bookings/${nextBooking.id}`} className="block w-full">
                            <Button variant="secondary" className="w-full bg-white text-[#FF5F00] hover:bg-orange-50 font-bold rounded-xl border-none">
                                View Details
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming trips</h3>
                    <p className="text-gray-500 mb-6 text-sm">
                        You haven&apos;t booked any adventures yet. Explore Marrakech today!
                    </p>
                    <Link href="/services">
                        <Button className="bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-orange-200">
                            Book an Adventure
                        </Button>
                    </Link>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatsCard label="Upcoming" value={stats.upcoming} />
                <StatsCard label="Completed" value={stats.completed} />
                <StatsCard label="Cancelled" value={stats.cancelled} />
                <StatsCard label="All Time" value={stats.total} />
            </div>

            {/* Recent Activity / Actions */}
            <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                </div>

                <div className="grid gap-3">
                    <Link href="/client/bookings">
                        <div className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 transition-colors group cursor-pointer shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-100 transition-colors">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">Manage Bookings</h4>
                                <p className="text-xs text-gray-500">View past and upcoming trips</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link href="/client/profile">
                        <div className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 transition-colors group cursor-pointer shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mr-4 group-hover:bg-purple-100 transition-colors">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">Account Preferences</h4>
                                <p className="text-xs text-gray-500">Update your details</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
