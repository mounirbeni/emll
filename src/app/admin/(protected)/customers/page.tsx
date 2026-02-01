import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { userService } from "@/services/user.service";
import { format } from "date-fns";
import { Eye, Mail, Phone, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input"; // We need a client component for search
import { CustomersSearch } from "./search"; // I'll create this small client component

export const dynamic = 'force-dynamic';

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: { q?: string; page?: string }
}) {
    const page = Number(searchParams.page) || 1;
    const pageSize = 20;
    const query = searchParams.q || "";

    // Fetch users (simulating pagination/filter on service output)
    const allUsers = query
        ? await userService.searchUsers(query)
        : await userService.getAllUsers();

    // Sort by date desc default
    allUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const totalUsers = allUsers.length;
    const totalPages = Math.ceil(totalUsers / pageSize);
    const paginatedUsers = allUsers.slice((page - 1) * pageSize, page * pageSize);

    // Enrich with stats
    // We use Promise.all to fetch stats for the current page only
    const usersWithStats = await Promise.all(
        paginatedUsers.map(async (user) => {
            try {
                const stats = await userService.getUserStats(user.id);
                return { ...user, stats };
            } catch (e) {
                return { ...user, stats: { totalBookings: 0, totalSpent: 0, completedBookings: 0, lastBookingDate: null } };
            }
        })
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                    <p className="text-muted-foreground">Manage your customer base ({totalUsers} total)</p>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border">
                <CustomersSearch />
            </div>

            <Card className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Bookings</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usersWithStats.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            usersWithStats.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.name || 'Unnamed User'}</div>
                                                <div className="text-xs text-muted-foreground font-mono">ID: {user.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                <span>{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{user.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(user.createdAt, 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.stats.totalBookings} orders</span>
                                            <span className="text-xs text-muted-foreground">{user.stats.completedBookings} completed</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold">€{user.stats.totalSpent.toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.stats.totalBookings > 0 ? "default" : "secondary"}>
                                            {user.stats.totalBookings > 0 ? "Active" : "New"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/customers/${user.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {page > 1 && (
                        <Button variant="outline" asChild>
                            <Link href={`/admin/customers?page=${page - 1}&q=${query}`}>Previous</Link>
                        </Button>
                    )}
                    <span className="py-2 px-4 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                    {page < totalPages && (
                        <Button variant="outline" asChild>
                            <Link href={`/admin/customers?page=${page + 1}&q=${query}`}>Next</Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
