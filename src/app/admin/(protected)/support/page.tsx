
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { MessageSquare, Mail, Phone } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getSupportRequests() {
    return await prisma.supportRequest.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export default async function AdminSupportPage() {
    const requests = await getSupportRequests();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Support Requests</h1>

            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No support requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">
                                        {req.name}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-3 w-3" /> {req.email}
                                            </div>
                                            {req.phone && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-3 w-3" /> {req.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{req.subject}</TableCell>
                                    <TableCell className="max-w-md truncate" title={req.message}>
                                        {req.message}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            req.status === 'RESOLVED' ? 'default' :
                                                req.status === 'PENDING' ? 'secondary' : 'outline'
                                        }>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                        {format(new Date(req.createdAt), "MMM d, HH:mm")}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
