import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function AdminReservationsPage() {
    const reservations = await prisma.reservation.findMany({
        orderBy: { createdAt: 'desc' },
    });

    // Helper to get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-700';
            case 'WAITING_VERIFICATION': return 'bg-yellow-100 text-yellow-700';
            case 'CASH_ON_DELIVERY': return 'bg-blue-100 text-blue-700';
            case 'NOT_PAID': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Reservations Dashboard</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reservations.map((res: any) => (
                                <TableRow key={res.id}>
                                    <TableCell className="font-mono text-xs">{res.id.slice(-6)}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{res.fullName}</div>
                                        <div className="text-xs text-gray-500">{res.email}</div>
                                        <div className="text-xs text-gray-500">{res.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{res.date} at {res.time}</div>
                                        <div className="text-xs text-gray-500">{res.numberOfPersons} Guest(s)</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold">€{res.finalPrice || res.basePrice}</div>
                                        {res.finalPrice && res.finalPrice !== res.basePrice && (
                                            <div className="text-xs text-green-600 line-through">€{res.basePrice}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>{res.paymentMethod || '-'}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(res.paymentStatus)}`}>
                                            {res.paymentStatus}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Date(res.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
