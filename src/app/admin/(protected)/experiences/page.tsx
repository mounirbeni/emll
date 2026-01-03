
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Edit, Plus, Trash } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getServices() {
    return await prisma.service.findMany({
        orderBy: { title: 'asc' }
    });
}

export default async function AdminExperiencesPage() {
    const services = await getServices();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
                <Button className="gap-2" asChild>
                    <Link href="/admin/services/new">
                        <Plus className="h-4 w-4" />
                        New Experience
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No services found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.title}</TableCell>
                                    <TableCell className="capitalize">{service.category}</TableCell>
                                    <TableCell>€{service.price.toString()}</TableCell>
                                    <TableCell>{service.duration}</TableCell>
                                    <TableCell>{service.rating}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                                <Link href={`/admin/services/${service.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-destructive"
                                                onClick={async () => {
                                                    if (confirm('Delete this service?')) {
                                                        await fetch(`/api/admin/services/${service.id}`, { method: 'DELETE' });
                                                        window.location.reload();
                                                    }
                                                }}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
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
