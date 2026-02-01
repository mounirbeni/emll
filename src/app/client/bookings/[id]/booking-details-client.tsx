'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    Mail,
    Phone,
    CreditCard,
    ArrowLeft,
    MessageSquare,
    Loader2,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { BookingStatus } from '@prisma/client';
import type { Booking } from '@prisma/client';
import { cancelBooking } from '@/app/client/actions';

// Extended Booking type to include relation
interface ExtendedBooking extends Booking {
    experience: {
        title: string;
    };
}

interface BookingDetailsClientProps {
    booking: ExtendedBooking;
}

const StatusIcon = ({ status }: { status: BookingStatus }) => {
    switch (status) {
        case BookingStatus.CONFIRMED: return <CheckCircle className="w-5 h-5 text-green-600" />;
        case BookingStatus.PENDING: return <Clock className="w-5 h-5 text-amber-600" />;
        case BookingStatus.CANCELLED: return <XCircle className="w-5 h-5 text-red-600" />;
        case BookingStatus.COMPLETED: return <CheckCircle className="w-5 h-5 text-primary" />;
        case BookingStatus.NEEDS_UPDATE: return <AlertTriangle className="w-5 h-5 text-amber-600" />;
        default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
};

const statusStyles: Record<BookingStatus, string> = {
    [BookingStatus.CONFIRMED]: 'bg-green-50 text-green-700 border-green-200',
    [BookingStatus.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
    [BookingStatus.CANCELLED]: 'bg-red-50 text-red-700 border-red-200',
    [BookingStatus.COMPLETED]: 'bg-primary/10 text-primary border-primary/20',
    [BookingStatus.NEEDS_UPDATE]: 'bg-amber-50 text-amber-700 border-amber-200',
};

const statusBarColors: Record<BookingStatus, string> = {
    [BookingStatus.CONFIRMED]: 'bg-green-500',
    [BookingStatus.PENDING]: 'bg-amber-500',
    [BookingStatus.CANCELLED]: 'bg-red-500',
    [BookingStatus.COMPLETED]: 'bg-primary',
    [BookingStatus.NEEDS_UPDATE]: 'bg-amber-500',
};

export function BookingDetailsClient({ booking }: BookingDetailsClientProps) {
    const router = useRouter();
    const [cancelling, setCancelling] = useState(false);

    const canCancel = booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED;

    const handleCancelBooking = async () => {
        setCancelling(true);
        try {
            const result = await cancelBooking(booking.id);
            if (result.success) {
                toast.success('Booking cancelled successfully');
                router.refresh();
            } else {
                toast.error(result.error);
                setCancelling(false);
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to cancel booking');
            setCancelling(false);
        }
    };

    const [isPaying, setIsPaying] = useState(false);
    const handlePayment = async () => {
        setIsPaying(true);
        try {
            const res = await fetch(`/api/bookings/${booking.id}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Number(booking.totalPrice),
                    currency: 'EUR',
                    method: 'CREDIT_CARD'
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Payment failed');

            toast.success('Payment successful!');
            router.refresh();
        } catch (error) {
            console.error('Payment Error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Navigation */}
            <div className="flex items-center gap-3 mb-2">
                <Link href="/client/bookings">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 -ml-2">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
            </div>

            {/* Main Status Card */}
            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
                <div className={`h-2 w-full ${statusBarColors[booking.status]}`} />
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[booking.status]} mb-3`}>
                                <StatusIcon status={booking.status} />
                                {booking.status}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                {booking.experience.title}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Ref: {booking.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5F00]">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(booking.date).toLocaleDateString('en-US', {
                                            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5F00]">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Time</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(booking.date).toLocaleTimeString('en-US', {
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5F00]">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Guests</p>
                                    <p className="font-semibold text-gray-900">
                                        {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'Guest' : 'Guests'}
                                    </p>
                                </div>
                            </div>
                            {booking.pickupLocation && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5F00]">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase">Pickup</p>
                                        <p className="font-semibold text-gray-900">{booking.pickupLocation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Special Requests</h3>
                            <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                        </div>
                    )}

                    {/* Additional Info */}
                    {(booking.dietary || booking.language || booking.flightNumber) && (
                        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {booking.dietary && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">Dietary</p>
                                    <p className="text-sm text-gray-900">{booking.dietary}</p>
                                </div>
                            )}
                            {booking.language && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">Language</p>
                                    <p className="text-sm text-gray-900">{booking.language}</p>
                                </div>
                            )}
                            {booking.flightNumber && (
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">Flight Number</p>
                                    <p className="text-sm text-gray-900">{booking.flightNumber}</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contact & Payment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardContent className="p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            Contact Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900 text-sm break-all">{booking.userEmail}</p>
                                </div>
                            </div>
                            {booking.userPhone && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-medium text-gray-900 text-sm">{booking.userPhone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white rounded-3xl">
                    <CardContent className="p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            Payment Info
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm text-gray-500">Total Amount</span>
                                <span className="text-xl font-bold text-gray-900">€{Number(booking.totalPrice).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center px-3">
                                <span className="text-sm text-gray-500">Status</span>
                                <span className={`font-bold text-sm ${booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                                    {booking.paymentStatus}
                                </span>
                            </div>

                            {booking.paymentStatus === 'UNPAID' && booking.status !== 'CANCELLED' && (
                                <Button
                                    onClick={handlePayment}
                                    disabled={isPaying}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-green-200 mt-2"
                                >
                                    {isPaying ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Pay Now'
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cancellation Policy */}
            {canCancel && (
                <Card className="border-none shadow-sm bg-amber-50 rounded-3xl">
                    <CardContent className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            Cancellation Policy
                        </h3>
                        <p className="text-sm text-gray-700">
                            Bookings can be cancelled at least 24 hours before the activity. Cancellations made within 24 hours of the activity may not be eligible for a refund.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
                <Link href="/client/messages/new">
                    <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-gray-50 h-12 font-semibold text-gray-700">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Support
                    </Button>
                </Link>

                {canCancel && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="w-full rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 h-12 font-medium">
                                Cancel Booking
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Adventure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to cancel this booking? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl border-gray-200">Keep it</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCancelBooking}
                                    disabled={cancelling}
                                    className="bg-red-600 hover:bg-red-700 rounded-xl"
                                >
                                    {cancelling ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Cancelling...
                                        </>
                                    ) : (
                                        'Yes, cancel it'
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
    );
}
