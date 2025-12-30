'use client'

import { useState, useTransition } from 'react'
import { Booking } from '@prisma/client'
import { confirmBooking, cancelBooking, processBooking, deleteBooking } from '@/app/actions/booking-actions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
    Search,
    Calendar,
    CheckCircle,
    XCircle,
    CheckCircle2,
    Trash2,
    ArrowUpDown,
    Phone,
    Mail,
    Users
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface BookingsClientProps {
    initialBookings: (Booking & { service?: { title: string } })[]
}

export default function BookingsClient({ initialBookings }: BookingsClientProps) {
    const [bookings, setBookings] = useState<(Booking & { service?: { title: string } })[]>(initialBookings)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [isPending, startTransition] = useTransition()

    // Filter and Sort
    const filteredBookings = bookings
        .filter((booking) => {
            // Status filter
            if (statusFilter !== 'ALL' && booking.status !== statusFilter) {
                return false
            }
            
            // Search filter
            const query = searchQuery.toLowerCase()
            return (
                (booking.name || '').toLowerCase().includes(query) ||
                (booking.email || '').toLowerCase().includes(query) ||
                (booking.service?.title || booking.activityTitle || '').toLowerCase().includes(query)
            )
        })
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
        })

    const handleConfirm = async (id: string) => {
        startTransition(async () => {
            const result = await confirmBooking(id)
            if (result.success) {
                toast.success('Booking confirmed successfully')
                setBookings((prev) =>
                    prev.map((b) => b.id === id ? { ...b, status: 'CONFIRMED' } : b)
                )
            } else {
                toast.error('Failed to confirm booking')
            }
        })
    }

    const handleCancel = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return

        startTransition(async () => {
            const result = await cancelBooking(id)
            if (result.success) {
                toast.success('Booking cancelled successfully')
                setBookings((prev) =>
                    prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' } : b)
                )
            } else {
                toast.error('Failed to cancel booking')
            }
        })
    }

    const handleProcess = async (id: string) => {
        if (!confirm('Mark this booking as completed? This action cannot be undone.')) return

        startTransition(async () => {
            const result = await processBooking(id)
            if (result.success) {
                toast.success('Booking marked as completed')
                setBookings((prev) =>
                    prev.map((b) => b.id === id ? { ...b, status: 'COMPLETED' } : b)
                )
            } else {
                toast.error('Failed to process booking')
            }
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return

        startTransition(async () => {
            const result = await deleteBooking(id)
            if (result.success) {
                toast.success('Booking deleted successfully')
                setBookings((prev) => prev.filter((b) => b.id !== id))
            } else {
                toast.error('Failed to delete booking')
            }
        })
    }

    const toggleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or activity..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={toggleSort}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        Sort by Date ({sortOrder === 'asc' ? 'Oldest' : 'Newest'})
                    </button>
                </div>
                
                {/* Status Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                    {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                statusFilter === status
                                    ? 'bg-[#FF5F00] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
                {filteredBookings && filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                                    <Card key={booking.id} className="overflow-hidden">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm truncate">{booking.activityTitle || booking.service?.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{booking.name}</p>
                                    </div>
                                    <Badge variant={
                                        booking.status === 'CONFIRMED' ? 'default' :
                                        booking.status === 'CANCELLED' ? 'destructive' : 'secondary'
                                    } className="text-xs">
                                        {booking.status}
                                    </Badge>
                                </div>
                                <div className="text-xs space-y-1 text-muted-foreground">
                                    <p>{booking.email}</p>
                                    {booking.phone && <p>{booking.phone}</p>}
                                    <p>{format(new Date(booking.date), 'PPP')} • {booking.guests} guests</p>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <div>
                                        <span className="font-bold">€{booking.totalPrice.toFixed(2)}</span>
                                        <span className={`text-xs ml-2 ${booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {booking.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {booking.status === 'PENDING' && (
                                            <Button size="sm" variant="outline" onClick={() => handleConfirm(booking.id)} disabled={isPending}>
                                                Confirm
                                            </Button>
                                        )}
                                        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                            <Button size="sm" variant="outline" onClick={() => handleCancel(booking.id)} disabled={isPending}>
                                                Cancel
                                            </Button>
                                        )}
                                        {booking.status === 'CONFIRMED' && (
                                            <Button size="sm" variant="outline" onClick={() => handleProcess(booking.id)} disabled={isPending}>
                                                Complete
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(booking)}>
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No bookings found.</p>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Guest</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Activity</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Date & Guests</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Total</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No bookings found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{booking.name}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">ID: {booking.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="h-3.5 w-3.5" />
                                                {booking.email}
                                            </div>
                                            {booking.phone && (
                                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {booking.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{booking.activityTitle || booking.service?.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {format(new Date(booking.date), 'MMM d, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                <Users className="h-3.5 w-3.5" />
                                                {booking.guests} guest{booking.guests !== 1 && 's'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                €{booking.totalPrice.toFixed(2)}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {booking.paymentStatus === 'PAID' ? (
                                                    <span className="text-green-600">Paid</span>
                                                ) : (
                                                    <span className="text-yellow-600">Unpaid</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    booking.status === 'CONFIRMED'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.status === 'CANCELLED'
                                                            ? 'bg-red-100 text-red-800'
                                                            : booking.status === 'COMPLETED'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Confirm - Only show for PENDING */}
                                                {booking.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleConfirm(booking.id)}
                                                        disabled={isPending}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                        title="Confirm Booking"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                                
                                                {/* Cancel - Show for PENDING and CONFIRMED */}
                                                {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        disabled={isPending}
                                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                                                        title="Cancel Booking"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                                
                                                {/* Process/Complete - Show for CONFIRMED */}
                                                {booking.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => handleProcess(booking.id)}
                                                        disabled={isPending}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                                
                                                {/* Delete - Show for all statuses */}
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    disabled={isPending}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete Booking"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
