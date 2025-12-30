import React from 'react';
import { Booking } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface BookingKanbanProps {
    bookings: Booking[];
    onStatusUpdate: (id: string, status: string) => void;
    onViewDetails: (booking: Booking) => void;
}

const COLUMNS = [
    { id: 'UNPROCESSED', label: 'Awaiting', color: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400' },
    { id: 'PENDING', label: 'Pending Payment', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400' },
    { id: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' },
    { id: 'COMPLETED', label: 'Completed', color: 'bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-400' },
];

export function BookingKanban({ bookings, onStatusUpdate, onViewDetails }: BookingKanbanProps) {
    const getColumnBookings = (status: string) => bookings.filter(b => b.status === status);

    return (
        <div className="flex h-full gap-2 md:gap-4 overflow-x-auto pb-4">
            {COLUMNS.map(col => {
                const columnBookings = getColumnBookings(col.id);
                return (
                    <div key={col.id} className="min-w-[250px] md:min-w-[300px] w-[250px] md:w-[300px] flex flex-col h-full rounded-xl bg-muted/40 border border-border/50">
                        {/* Column Header */}
                        <div className={`p-2 md:p-3 border-b border-border/50 flex items-center justify-between ${col.color} bg-opacity-20`}>
                            <h3 className="font-semibold text-sm">{col.label}</h3>
                            <Badge variant="secondary" className="bg-background/50 font-mono text-xs">
                                {columnBookings.length}
                            </Badge>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                {columnBookings.map(booking => (
                                    <Card
                                        key={booking.id}
                                        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer active:cursor-grabbing"
                                        onClick={() => onViewDetails(booking)}
                                    >
                                        <CardContent className="p-2 md:p-3 space-y-2 md:space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1 min-w-0">
                                                    <p className="font-medium text-sm line-clamp-1">{booking.activityTitle}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{booking.name}</p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        {COLUMNS.map(targetCol => (
                                                            targetCol.id !== booking.status && (
                                                                <DropdownMenuItem
                                                                    key={targetCol.id}
                                                                    onClick={() => onStatusUpdate(booking.id, targetCol.id)}
                                                                >
                                                                    Move to {targetCol.label}
                                                                </DropdownMenuItem>
                                                            )
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center text-xs text-muted-foreground gap-1 md:gap-2">
                                                    <Calendar className="h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate">{format(new Date(booking.date), 'MMM d')}</span>
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground gap-1 md:gap-2">
                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                    <span>{booking.guests} Guests</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t mt-2 flex items-center justify-between">
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                                    €{booking.totalPrice}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {format(new Date(booking.createdAt), 'HH:mm')}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
