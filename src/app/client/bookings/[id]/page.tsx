"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    Mail,
    Phone,
    CreditCard,
    AlertCircle,
    XCircle,
    ArrowLeft,
    MessageSquare,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface BookingDetails {
    id: string;
    activityTitle: string;
    activityId: string;
    date: string;
    guests: number;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    name: string;
    email: string;
    phone?: string;
    pickupLocation?: string;
    specialRequests?: string;
    createdAt: string;
}

export default function BookingDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const { id } = use(params);
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    const fetchBookingDetails = async () => {
        try {
            const res = await fetch(`/api/bookings/${id}`);
            if (!res.ok) {
                if (res.status === 404) {
                    toast.error("Booking not found");
                    router.push("/client/bookings");
                    return;
                }
                throw new Error("Failed to fetch booking");
            }
            const data = await res.json();
            // Handle both wrapped response and direct response
            const bookingData = data.data || data;
            setBooking(bookingData);
        } catch (error) {
            console.error("Error fetching booking:", error);
            toast.error("Failed to load booking details");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        setCancelling(true);
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "CANCEL" }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || error.message || "Failed to cancel booking");
            }

            toast.success("Booking cancelled successfully");
            router.push("/client/bookings");
        } catch (error: any) {
            console.error("Error cancelling booking:", error);
            toast.error(error.message || "Failed to cancel booking");
        } finally {
            setCancelling(false);
        }
    };

    const [processingPayment, setProcessingPayment] = useState(false);

    const handlePayment = async () => {
        setProcessingPayment(true);
        try {
            const res = await fetch(`/api/bookings/${id}/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: booking!.totalPrice,
                    method: 'CREDIT_CARD',
                    currency: 'EUR'
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || error.message || "Payment failed");
            }

            const data = await res.json();
            const paymentData = data.data || data;
            
            toast.success("Payment processed successfully!");
            // Refresh booking details
            await fetchBookingDetails();
        } catch (error: any) {
            console.error("Payment error:", error);
            toast.error(error.message || "Payment failed");
        } finally {
            setProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    const canCancel =
        booking.status === "PENDING" || booking.status === "CONFIRMED";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/client/bookings">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Bookings
                    </Button>
                </Link>
            </div>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600">Booking ID:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-primary font-bold">
                        {booking.id}
                    </code>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {booking.activityTitle}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Date</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(booking.date).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Time</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(booking.date).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Guests</p>
                                        <p className="text-sm text-gray-600">
                                            {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                                        </p>
                                    </div>
                                </div>
                                {booking.pickupLocation && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Pickup Location
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {booking.pickupLocation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email</p>
                                    <p className="text-sm text-gray-600">{booking.email}</p>
                                </div>
                            </div>
                            {booking.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Phone</p>
                                        <p className="text-sm text-gray-600">{booking.phone}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {booking.specialRequests && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Special Requests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Booking Status</p>
                                <span
                                    className={`inline-block px-3 py-1 text-sm font-medium rounded ${booking.status === "CONFIRMED"
                                        ? "bg-green-100 text-green-800"
                                        : booking.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {booking.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                                <span
                                    className={`inline-block px-3 py-1 text-sm font-medium rounded ${booking.paymentStatus === "PAID"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {booking.paymentStatus}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>€{booking.totalPrice}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/client/messages/new">
                                <Button variant="outline" className="w-full">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Contact Support
                                </Button>
                            </Link>
                            {canCancel && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full">
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Cancel Booking
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to cancel this booking? This action
                                                cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>No, keep it</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleCancelBooking}
                                                disabled={cancelling}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                {cancelling ? "Cancelling..." : "Yes, cancel"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            {booking.paymentStatus === 'UNPAID' && booking.status === 'CONFIRMED' && (
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 mt-2"
                                    onClick={handlePayment}
                                    disabled={processingPayment}
                                >
                                    {processingPayment ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                                    Pay Now (€{booking.totalPrice})
                                </Button>
                            )}
                            {booking.paymentStatus === 'UNPAID' && booking.status === 'PENDING' && (
                                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Awaiting Confirmation:</strong> Payment will be available once your booking is confirmed by our team.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
