'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { BookingCard } from '@/components/dashboard/booking-card';
import {
    Compass,
    History,
    XCircle,
    Search,
} from 'lucide-react';
import { Booking, BookingStatus } from '@prisma/client';

interface BookingsClientProps {
    bookings: Booking[];
}

export function BookingsClient({ bookings }: BookingsClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('upcoming');

    const filterBookings = (status: string) => {
        const now = new Date();
        let filtered = bookings;

        // Date/Status Filter
        if (status === 'upcoming') {
            filtered = bookings.filter(
                (b) => (b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED) && new Date(b.date) > now
            ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (status === 'past') {
            filtered = bookings.filter(
                (b) => b.status === BookingStatus.COMPLETED || new Date(b.date) < now
            ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (status === 'cancelled') {
            filtered = bookings.filter(
                (b) => b.status === BookingStatus.CANCELLED
            ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        // Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.activityTitle.toLowerCase().includes(lowerQuery) ||
                b.id.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered;
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Trips</h1>
                    <p className="text-gray-500 text-sm">Manage your upcoming and past adventures</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search bookings..."
                        className="pl-9 w-full md:w-64 rounded-xl border-gray-200 focus:ring-[#FF5F00] focus:border-[#FF5F00]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-100/50 p-1 rounded-2xl w-full flex justify-between md:justify-start md:w-auto overflow-x-auto">
                    {[
                        { id: 'upcoming', label: 'Upcoming' },
                        { id: 'past', label: 'Past' },
                        { id: 'cancelled', label: 'Cancelled' }
                    ].map(tab => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="rounded-xl flex-1 md:flex-initial px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#FF5F00] data-[state=active]:shadow-sm font-medium transition-all"
                        >
                            {tab.label}
                            {filterBookings(tab.id).length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-md">
                                    {filterBookings(tab.id).length}
                                </span>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-6 min-h-[50vh]">
                    <TabsContent value="upcoming" className="space-y-4 animate-slide-up">
                        {filterBookings('upcoming').length > 0 ? (
                            filterBookings('upcoming').map(booking => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                                    <Compass className="w-8 h-8 text-[#FF5F00]" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">No upcoming trips</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto mt-1 mb-6">
                                    You don&apos;t have any upcoming adventures. Let&apos;s find you something amazing!
                                </p>
                                <Link href="/services">
                                    <Button className="rounded-xl bg-[#FF5F00] hover:bg-[#E55500]">
                                        Explore Experiences
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4 animate-slide-up">
                        {filterBookings('past').length > 0 ? (
                            filterBookings('past').map(booking => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))
                        ) : (
                            <EmptyState
                                icon={History}
                                title="No past trips"
                                description="Your completed adventures will appear here."
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="space-y-4 animate-slide-up">
                        {filterBookings('cancelled').length > 0 ? (
                            filterBookings('cancelled').map(booking => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))
                        ) : (
                            <EmptyState
                                icon={XCircle}
                                title="No cancelled trips"
                                description="You haven't cancelled any bookings."
                            />
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
