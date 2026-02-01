"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Booking } from '@prisma/client' // Use Prisma type
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react'

// Extended Booking type to include relations
type CalendarBooking = Booking & {
    user: { name: string | null; email: string | null } | null;
    experience: { title: string };
};

export function CalendarClient({ bookings }: { bookings: CalendarBooking[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    // Booked dates (Set for O(1) lookup)
    const bookedDates = bookings.map(b => new Date(b.date))

    // Filter for selected date
    const selectedDateBookings = bookings.filter(booking => {
        if (!date) return false
        const bookingDate = new Date(booking.date)
        return (
            bookingDate.getDate() === date.getDate() &&
            bookingDate.getMonth() === date.getMonth() &&
            bookingDate.getFullYear() === date.getFullYear()
        )
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-500 hover:bg-green-600'
            case 'COMPLETED': return 'bg-primary hover:bg-primary/90'
            case 'CANCELLED': return 'bg-red-500 hover:bg-red-600'
            default: return 'bg-yellow-500 hover:bg-yellow-600'
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 h-full">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow-sm"
                        modifiers={{
                            booked: bookedDates
                        }}
                        modifiersStyles={{
                            booked: {
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                                color: 'var(--primary)'
                            }
                        }}
                    />
                </CardContent>
            </Card>

            <Card className="lg:col-span-4 flex flex-col">
                <CardHeader>
                    <CardTitle>
                        {date ? format(date, 'PPPP') : 'Select a date'}
                    </CardTitle>
                    <CardDescription>
                        {selectedDateBookings.length} bookings found
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto max-h-[500px]">
                    {selectedDateBookings.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDateBookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                                    <div className="space-y-1">
                                        <p className="font-medium">{booking.experience.title}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {booking.user?.name || booking.user?.email || 'Unknown User'} • {booking.numberOfPeople} guests
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(booking.date), 'p')}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(booking.status)}>
                                        {booking.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                            <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                            <p>No bookings for this date</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
