'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Booking } from '@prisma/client'
import { confirmBooking, cancelBooking, completeBooking, deleteBooking } from '@/app/actions/admin-actions'
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
    Users,
    Filter,
    Eye
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'

interface BookingsClientProps {
    initialBookings: (Booking & { service?: { title: string } } & { user?: { name: string | null } | null })[]
}

export default function BookingsClient({ initialBookings }: BookingsClientProps) {
    const router = useRouter()
    const [bookings, setBookings] = useState(initialBookings)
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
                (booking.service?.title || booking.activityTitle || '').toLowerCase().includes(query) ||
                (booking.id.toLowerCase().includes(query))
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
                // Optimistic update or wait for revalidation (router.refresh() happens automatically via server action?)
                // Actually server actions with revalidatePath usually don't trigger client component state reset unless we rely on props.
                // Best practice: update local state optimistically or based on success.
                // We'll update local state status.
                setBookings((prev) =>
                    prev.map((b) => b.id === id ? { ...b, status: 'CONFIRMED' } : b)
                )
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to confirm booking')
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
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to cancel booking')
            }
        })
    }

    const handleComplete = async (id: string) => {
        if (!confirm('Mark this booking as completed? This action cannot be undone.')) return

        startTransition(async () => {
            const result = await completeBooking(id)
            if (result.success) {
                toast.success('Booking marked as completed')
                setBookings((prev) =>
                    prev.map((b) => b.id === id ? { ...b, status: 'COMPLETED' } : b)
                )
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to process booking')
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
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to delete booking')
            }
        })
    }

    const toggleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    }

    const handleViewDetails = (booking: Booking & { service?: { title: string } }) => {
        // Navigate to client booking details page (admin generally proxies client or has own view. Client view is fine.)
        router.push(`/client/bookings/${booking.id}`)
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col gap-4 bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-border">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or activity..."
                            className="w-full pl-10 pr-4 py-2.5 border-2 border-border rounded-xl bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="outline"
                        onClick={toggleSort}
                        className="flex items-center gap-2 rounded-xl border-2"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        <span className="hidden sm:inline">Sort:</span> {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
                    </Button>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mr-2">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Status:</span>
                    </div>
                    {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${statusFilter === status
                                ? 'bg-primary text-white shadow-md shadow-primary/25'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                }`}
                        >
                            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3">
                {filteredBookings && filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden rounded-xl border-border hover:shadow-md transition-all duration-200">
                            <CardContent className="p-0 flex h-full">
                                {/* Left Side - Date & Status */}
                                <div className={`w-20 flex-shrink-0 flex flex-col items-center justify-center p-3 text-white ${booking.status === 'CONFIRMED' ? 'bg-gradient-to-b from-emerald-500 to-emerald-600' :
                                        booking.status === 'CANCELLED' ? 'bg-gradient-to-b from-red-500 to-red-600' :
                                            booking.status === 'COMPLETED' ? 'bg-gradient-to-b from-blue-500 to-blue-600' :
                                                'bg-gradient-to-b from-amber-500 to-amber-600'
                                    }`}>
                                    <div className="text-center">
                                        <div className="font-bold text-2xl">{new Date(booking.date).getDate()}</div>
                                        <div className="text-xs uppercase font-medium opacity-90">{format(new Date(booking.date), 'MMM')}</div>
                                        <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                                            {booking.status.slice(0, 4)}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Content */}
                                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-sm text-foreground truncate leading-tight">
                                                {booking.activityTitle || booking.service?.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">{booking.name}</p>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="font-bold text-primary text-base">€{Number(booking.totalPrice).toFixed(0)}</span>
                                            <PaymentStatusBadge status={booking.paymentStatus} />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mt-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                                <Users className="h-3 w-3" />
                                                <span>{booking.guests}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-1.5">
                                            {booking.status === 'PENDING' && (
                                                <Button size="icon" className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm" onClick={(e) => { e.stopPropagation(); handleConfirm(booking.id); }} disabled={isPending}>
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                                <Button size="icon" className="h-8 w-8 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 shadow-sm" onClick={(e) => { e.stopPropagation(); handleCancel(booking.id); }} disabled={isPending}>
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg" onClick={() => handleViewDetails(booking)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <EmptyState
                        icon="bookings"
                        title="No bookings found"
                        description={searchQuery ? `No results for "${searchQuery}"` : "Bookings will appear here when customers make reservations."}
                        compact
                    />
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Guest</th>
                                <th className="px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Contact</th>
                                <th className="px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Activity</th>
                                <th className="px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Date & Guests</th>
                                <th className="px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Total</th>
                                <th className="px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider">Status</th>
                                <th className="px-5 py-4 font-semibold text-foreground text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16">
                                        <EmptyState
                                            icon="bookings"
                                            title="No bookings found"
                                            description={searchQuery ? `No results for "${searchQuery}"` : "Bookings will appear here when customers make reservations."}
                                            compact
                                        />
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <span className="text-primary font-semibold text-sm">
                                                        {booking.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{booking.name}</div>
                                                    <div className="text-xs text-muted-foreground font-mono">#{booking.id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate max-w-[150px]">{booking.email}</span>
                                            </div>
                                            {booking.phone && (
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                                    <Phone className="h-3.5 w-3.5 shrink-0" />
                                                    {booking.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-foreground max-w-[200px] truncate">{booking.activityTitle || booking.service?.title}</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-foreground">
                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                {format(new Date(booking.date), 'MMM d, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                                                <Users className="h-3.5 w-3.5" />
                                                {booking.guests} guest{booking.guests !== 1 && 's'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-foreground text-base">
                                                €{Number(booking.totalPrice).toFixed(0)}
                                            </div>
                                            <PaymentStatusBadge status={booking.paymentStatus} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <BookingStatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {booking.status === 'PENDING' && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleConfirm(booking.id)}
                                                        disabled={isPending}
                                                        className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                        title="Confirm Booking"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleCancel(booking.id)}
                                                        disabled={isPending}
                                                        className="h-8 w-8 rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                                        title="Cancel Booking"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {booking.status === 'CONFIRMED' && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleComplete(booking.id)}
                                                        disabled={isPending}
                                                        className="h-8 w-8 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                        title="Mark as Completed"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(booking.id)}
                                                    disabled={isPending}
                                                    className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    title="Delete Booking"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
