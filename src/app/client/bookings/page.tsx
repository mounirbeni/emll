"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Booking {
    id: string;
    activityTitle: string;
    date: string;
    guests: number;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    activityId: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("upcoming");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/bookings");
            if (!res.ok) throw new Error("Failed to fetch bookings");
            const data = await res.json();
            // Handle wrapped response
            const bookingsData = data.data || data;
            setBookings(bookingsData);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = (status: string) => {
        const now = new Date();
        switch (status) {
            case "upcoming":
                return bookings.filter(
                    (b) =>
                        (b.status === "PENDING" || b.status === "CONFIRMED") &&
                        new Date(b.date) > now
                );
            case "past":
                return bookings.filter(
                    (b) => b.status === "COMPLETED" || new Date(b.date) < now
                );
            case "cancelled":
                return bookings.filter(
                    (b) => b.status === "CANCELLED" || b.status === "REJECTED"
                );
            default:
                return bookings;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "CANCELLED":
            case "REJECTED":
                return "bg-red-100 text-red-800";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const BookingCard = ({ booking }: { booking: Booking }) => (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4 sm:gap-0">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {booking.activityTitle}
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(booking.date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-2" />
                                {new Date(booking.date).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Users className="w-4 h-4 mr-2" />
                                {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                            </div>
                        </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="text-2xl font-bold text-gray-900">
                            €{booking.totalPrice}
                        </p>
                        <span
                            className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                                booking.status
                            )}`}
                        >
                            {booking.status}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                        Payment: <span className="font-medium">{booking.paymentStatus}</span>
                    </span>
                    <Link href={`/client/bookings/${booking.id}`}>
                        <Button variant="outline" size="sm">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );

    const EmptyState = ({ type }: { type: string }) => (
        <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {type} bookings
            </h3>
            <p className="text-gray-600 mb-4">
                {type === "upcoming"
                    ? "You don't have any upcoming bookings. Ready to explore?"
                    : `You don't have any ${type} bookings.`}
            </p>
            {type === "upcoming" && (
                <Link href="/search">
                    <Button>Browse Activities</Button>
                </Link>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#FF5F00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-600 mt-1">
                        View and manage your activity bookings
                    </p>
                </div>
                <Link href="/search">
                    <Button>
                        <Calendar className="w-4 h-4 mr-2" />
                        New Booking
                    </Button>
                </Link>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6">
                    {filterBookings("upcoming").length > 0 ? (
                        <div className="grid gap-4">
                            {filterBookings("upcoming").map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState type="upcoming" />
                    )}
                </TabsContent>

                <TabsContent value="past" className="mt-6">
                    {filterBookings("past").length > 0 ? (
                        <div className="grid gap-4">
                            {filterBookings("past").map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState type="past" />
                    )}
                </TabsContent>

                <TabsContent value="cancelled" className="mt-6">
                    {filterBookings("cancelled").length > 0 ? (
                        <div className="grid gap-4">
                            {filterBookings("cancelled").map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState type="cancelled" />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
