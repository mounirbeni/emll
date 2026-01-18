import { Suspense } from 'react'
import { bookingService } from '@/services/booking.service'
import { CalendarClient } from './calendar-client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
    title: "Calendar | Admin Panel",
    description: "Booking calendar view",
};

export default async function CalendarPage() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/auth/login')
    }

    // Fetch all bookings for now. Optimization: Fetch only current month + future.
    // Given the repo methods, getAllBookings is easiest starting point.
    // It already includes user and service title.
    const bookings = await bookingService.getAllBookings({
        // No filters for now, fetch all
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <p className="text-muted-foreground">View bookings by date</p>
            </div>
            <Suspense fallback={<CalendarLoading />}>
                {/* @ts-ignore: Types might need exact alignment but structure matches */}
                <CalendarClient bookings={bookings} />
            </Suspense>
        </div>
    )
}

function CalendarLoading() {
    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
            <div className="lg:col-span-3">
                <Skeleton className="h-[350px] w-full" />
            </div>
            <div className="lg:col-span-4">
                <Skeleton className="h-[350px] w-full" />
            </div>
        </div>
    )
}
