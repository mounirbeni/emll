'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Booking } from "@/types/admin"
import { Loader2, Calendar as CalendarIcon } from 'lucide-react'

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch bookings')
    return res.json()
}

export default function CalendarPage() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const { data: bookings, isLoading } = useSWR<Booking[]>('/api/admin/bookings', fetcher)

    // Get dates that have bookings
    const bookedDates = bookings?.map(b => new Date(b.date)) || []

    // Filter bookings for selected date
    const selectedDateBookings = bookings?.filter(booking => {
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
            case 'CONFIRMED':
                return 'bg-green-500'
            case 'CANCELLED':
                return 'bg-red-500'
            default:
                return 'bg-yellow-500'
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                    <p className="text-muted-foreground">
                        View your bookings by date.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Select Date</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
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

                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>
                            {date ? format(date, 'PPPP') : 'Select a date'}
                        </CardTitle>
                        <CardDescription>
                            {selectedDateBookings?.length || 0} bookings found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : selectedDateBookings && selectedDateBookings.length > 0 ? (
                            <div className="space-y-4">
                                {selectedDateBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">{booking.activityTitle}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.name} • {booking.guests} guests
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(booking.date), 'p')}
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(booking.status)}>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                                <p>No bookings for this date</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
