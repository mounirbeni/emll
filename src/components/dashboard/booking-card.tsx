import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { PaymentStatusBadge } from '@/components/payment/PaymentStatusBadge';
import type { PaymentStatusType } from '@/components/payment/PaymentStatusBadge';

interface BookingCardProps {
    booking: any;
}

const statusColors = {
    CONFIRMED: 'bg-[#10B981]',
    PENDING: 'bg-[#F59E0B]',
    COMPLETED: 'bg-[#3B82F6]',
    CANCELLED: 'bg-[#EF4444]',
} as const;

const statusBadgeStyles = {
    CONFIRMED: 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]',
    PENDING: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    CANCELLED: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
    COMPLETED: 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]',
} as const;

export function BookingCard({ booking }: BookingCardProps) {
    const statusColor = statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-400';
    const badgeStyle = statusBadgeStyles[booking.status as keyof typeof statusBadgeStyles] || 'bg-gray-100 text-gray-800';

    return (
        <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl">
            <CardContent className="p-0">
                <div className="flex flex-col">
                    {/* Status Bar */}
                    <div className={`h-1 w-full ${statusColor}`} />

                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-[#FF5F00] transition-colors">
                                    {booking.experience?.title || booking.activityTitle}
                                </h3>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4 text-[#FF5F00]" />
                                    <span>
                                        {new Date(booking.date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                        {' • '}
                                        {new Date(booking.date).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <PaymentStatusBadge status={((booking as { paymentStatus?: string }).paymentStatus ?? 'UNPAID') as PaymentStatusType} showIcon={false} />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    {booking.numberOfPeople || booking.guests}
                                </span>
                                <span className="font-bold text-gray-900">
                                    €{Number(booking.totalPrice).toFixed(2)}
                                </span>
                            </div>

                            <Link href={`/client/bookings/${booking.id}`}>
                                <Button size="sm" className="rounded-xl bg-black text-white hover:bg-[#FF5F00] transition-colors">
                                    Details
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function BookingCardSkeleton() {
    return (
        <Card className="overflow-hidden border-none shadow-sm bg-white rounded-2xl">
            <CardContent className="p-0">
                <div className="flex flex-col">
                    <div className="h-1 w-full bg-gray-200 animate-pulse" />
                    <div className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                            </div>
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
                                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div className="h-9 w-24 bg-gray-200 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
