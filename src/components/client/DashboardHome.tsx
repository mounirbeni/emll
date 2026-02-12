"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, MapPin, ArrowRight, Wallet, Users, Clock, Star, Sparkles, MessageSquare } from "lucide-react";
import Image from "next/image";
import { RecentActivity } from "./RecentActivity";

interface DashboardHomeProps {
    user: {
        name: string | null;
        email: string | null;
        image?: string | null;
        id?: string;
    };
    stats: {
        total: number;
        upcoming: number;
        completed: number;
        cancelled: number;
        pending: number;
        totalRevenue: number;
    };
    nextBooking: any;
}

export function DashboardHome({ user, stats, nextBooking }: DashboardHomeProps) {
    const firstName = user.name?.split(' ')[0] || 'Traveler';
    const currentTime = new Date();
    const hour = currentTime.getHours();

    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    if (hour >= 17) greeting = 'Good evening';

    return (
        <div className="space-y-8 animate-fade-in pb-safe-nav lg:pb-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        {greeting}, <span className="text-primary">{firstName}!</span>
                    </h1>
                    <p className="text-gray-500 mt-1 text-lg">
                        Ready to explore the magic of Marrakech?
                    </p>
                </div>
                <Link href="/experiences">
                    <Button className="rounded-full bg-primary hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 px-6 h-12 text-base font-bold transition-all hover:scale-105 active:scale-95">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Book New Experience
                    </Button>
                </Link>
            </div>

            {/* Quick Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl group-hover:scale-110 transition-transform text-primary">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <span className="text-3xl font-black text-gray-900">{stats.total}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-400">Total Bookings</div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform text-blue-500">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-gray-900">
                            €{stats.totalRevenue}
                        </span>
                    </div>
                    <div className="text-sm font-medium text-gray-400">Total Spent</div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-2xl group-hover:scale-110 transition-transform text-green-500">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <span className="text-3xl font-black text-gray-900">{stats.completed}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-400">Places Visited</div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-2xl group-hover:scale-110 transition-transform text-purple-500">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <span className="text-3xl font-black text-gray-900">0</span>
                    </div>
                    <div className="text-sm font-medium text-gray-400">New Messages</div>
                </div>
            </div>


            <div className="grid lg:grid-cols-3 gap-8">
                {/* Next Trip Card */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary fill-primary" />
                        Your Next Adventure
                    </h2>

                    {nextBooking ? (
                        <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent z-10" />
                            <div className="relative h-64 w-full">
                                <Image
                                    src={nextBooking.experience.images[0] || "/images/placeholder-experience.svg"}
                                    alt={nextBooking.experience.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                                    Upcoming
                                </span>
                                <h3 className="text-3xl font-black text-white mb-2 leading-tight max-w-xl">
                                    {nextBooking.experience.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-6 text-white/90 mt-4">
                                    <div className="flex items-center gap-2 text-sm font-medium bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                                        <Calendar className="w-4 h-4" />
                                        <span>{format(new Date(nextBooking.date), "MMMM d, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                                        <Clock className="w-4 h-4" />
                                        <span>{nextBooking.time || "10:00 AM"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                                        <Users className="w-4 h-4" />
                                        <span>{nextBooking.guests} Guests</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <Link href={`/client/bookings/${nextBooking.id}`} className="flex-1 sm:flex-none">
                                        <Button className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl h-12 shadow-lg">
                                            View Details
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href={`/experiences/${nextBooking.id}`} className="hidden sm:block">
                                        <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:border-white font-bold rounded-xl h-12 backdrop-blur-sm">
                                            View Listing
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 text-center py-16 shadow-sm">
                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <MapPin className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No upcoming trips</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                You haven't booked any experiences yet. Start your journey by exploring our curated selection.
                            </p>
                            <Link href="/experiences">
                                <Button className="bg-primary hover:bg-orange-600 font-bold rounded-full h-12 px-8 shadow-lg shadow-orange-500/20">
                                    Browse Experiences
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right Column: Recent Activity */}
                <div className="lg:col-span-1">
                    <RecentActivity />
                </div>
            </div>
        </div >
    );
}
