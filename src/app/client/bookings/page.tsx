"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonBookingCard } from "@/components/ui/skeleton";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    ArrowRight,
    Compass,
    History,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
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
        <Card className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                    {/* Left accent bar */}
                    <div className={`w-full sm:w-1.5 h-1.5 sm:h-auto ${
                        booking.status === 'CONFIRMED' ? 'bg-success' :
                        booking.status === 'PENDING' ? 'bg-warning' :
                        booking.status === 'COMPLETED' ? 'bg-info' : 'bg-destructive'
                    }`} />
                    
                    <div className="flex-1 p-5">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-charcoal mb-3">
                                    {booking.activityTitle}
                                </h3>
                                <div className="flex flex-wrap gap-4 text-sm text-medium-gray">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        {new Date(booking.date).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-primary" />
                                        {new Date(booking.date).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-primary" />
                                        {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                                    </span>
                                </div>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-2xl font-bold text-primary">
                                    €{booking.totalPrice}
                                </p>
                                <span
                                    className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                        booking.status
                                    )}`}
                                >
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                            <span className="text-sm text-medium-gray">
                                Payment: <span className={`font-medium ${booking.paymentStatus === 'PAID' ? 'text-success' : 'text-warning'}`}>{booking.paymentStatus}</span>
                            </span>
                            <Link href={`/client/bookings/${booking.id}`}>
                                <Button variant="outline" size="sm" className="rounded-full">
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const BookingEmptyState = ({ type }: { type: string }) => {
        const getEmptyStateContent = () => {
            switch (type) {
                case "upcoming":
                    return {
                        icon: Compass,
                        title: "No upcoming adventures yet",
                        description: "Your next Marrakech experience is waiting! Browse our curated collection of authentic local experiences.",
                        action: { label: "Explore Experiences", onClick: () => router.push('/services') }
                    };
                case "past":
                    return {
                        icon: History,
                        title: "No past bookings",
                        description: "Once you complete an experience, it will appear here as a cherished memory.",
                        action: undefined
                    };
                case "cancelled":
                    return {
                        icon: XCircle,
                        title: "No cancelled bookings",
                        description: "Great news! You haven't had to cancel any bookings.",
                        action: undefined
                    };
                default:
                    return {
                        icon: Calendar,
                        title: "No bookings found",
                        description: "Start exploring our experiences to make your first booking.",
                        action: { label: "Browse Experiences", onClick: () => router.push('/services') }
                    };
            }
        };

        const content = getEmptyStateContent();
        return (
            <EmptyState
                icon={content.icon}
                title={content.title}
                description={content.description}
                action={content.action}
            />
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-charcoal">My Bookings</h1>
                        <p className="text-medium-gray mt-1">View and manage your activity bookings</p>
                    </div>
                </div>
                <div className="grid gap-4">
                    {[...Array(3)].map((_, i) => (
                        <SkeletonBookingCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">My Bookings</h1>
                    <p className="text-medium-gray mt-1">View and manage your activity bookings</p>
                </div>
                <Link href="/services">
                    <Button className="rounded-full shadow-md shadow-primary/20">
                        <Compass className="w-4 h-4 mr-2" />
                        Explore More
                    </Button>
                </Link>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-cream-dark/50 p-1 rounded-full">
                    <TabsTrigger 
                        value="upcoming" 
                        className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm px-6"
                    >
                        Upcoming
                        {filterBookings("upcoming").length > 0 && (
                            <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                {filterBookings("upcoming").length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger 
                        value="past"
                        className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm px-6"
                    >
                        Past
                    </TabsTrigger>
                    <TabsTrigger 
                        value="cancelled"
                        className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm px-6"
                    >
                        Cancelled
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6">
                    {filterBookings("upcoming").length > 0 ? (
                        <div className="grid gap-4">
                            {filterBookings("upcoming").map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                    ) : (
                        <BookingEmptyState type="upcoming" />
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
                        <BookingEmptyState type="past" />
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
                        <BookingEmptyState type="cancelled" />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
