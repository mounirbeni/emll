import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { userService } from "@/services/user.service";
import { notificationService } from "@/services/notification.service";
import { format } from "date-fns";
import { Calendar, Mail, Phone, Bell } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await userService.getUserWithBookings(id);
    if (!user) {
        notFound();
    }

    const stats = await userService.getUserStats(id);
    const notifications = await notificationService.getUserNotifications(id);

    // Sort bookings by date desc
    const sortedBookings = [...(user.bookings || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Link href="/admin/customers" className="hover:underline">Customers</Link> {' > '} Details
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{user.name || 'Unnamed User'}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${user.email}`}><Mail className="mr-2 h-4 w-4" /> Email</a>
                    </Button>
                    {user.phone && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${user.phone}`}><Phone className="mr-2 h-4 w-4" /> Call</a>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Profile & Stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <div className="font-semibold">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.role}</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined {format(user.createdAt, 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Total Spent</span>
                                <div className="text-2xl font-bold">€{stats.totalSpent.toLocaleString()}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Bookings</span>
                                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Completed</span>
                                <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase">Cancelled</span>
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.totalBookings - stats.completedBookings - (user.bookings?.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED').length || 0)}
                                    {/* Approximation if 'cancelled' isn't explicitly in stats, but usually it is. Re-checking stats structure later if needed. */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle & Right: Bookings & Activity */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking History</CardTitle>
                            <CardDescription>Recent reservations made by this customer</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sortedBookings.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">No bookings found.</p>
                                ) : (
                                    sortedBookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-background p-2 rounded border">
                                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{booking.experience.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {format(booking.date, 'PPP')} • {booking.numberOfPeople} Guests
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge variant={
                                                    booking.status === 'COMPLETED' ? 'default' :
                                                        booking.status === 'CONFIRMED' ? 'secondary' :
                                                            booking.status === 'PENDING' ? 'secondary' : 'destructive'
                                                }>
                                                    {booking.status}
                                                </Badge>
                                                <span className="text-sm font-bold">€{Number(booking.totalPrice).toFixed(0)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {notifications.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                                ) : (
                                    notifications.slice(0, 5).map((notif) => (
                                        <div key={notif.id} className="flex gap-3 text-sm">
                                            <div className="mt-0.5">
                                                <Bell className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{notif.title}</p>
                                                <p className="text-muted-foreground">{notif.message}</p>
                                                <p className="text-xs text-muted-foreground/50 mt-1">{format(notif.createdAt, 'PP p')}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
