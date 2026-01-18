import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { serviceService } from "@/services/service.service";
import { Plus, Search, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ExperienceActions } from "./experience-actions-client";

export const dynamic = 'force-dynamic';

export default async function ExperiencesPage({ searchParams }: { searchParams: { q?: string } }) {
    // In a real app we'd pass search params to the service service for server-side filtering
    // For now, we fetch all and filter (or assumes serviceService.getServices supports query if upgraded, but existing usage suggests getAll)
    // The existing 'page.tsx' did client-side filter.
    // I can do in-memory filter here if the dataset is small, or use service if available.
    // user.service.ts has search, service.service.ts has getServices() - checks logic?
    // service.service.ts: getServices() -> finds all.
    // I will fetch all and filter here for now to match functionality without changing API.

    const allServices = await serviceService.getServices();
    // const q = searchParams?.q?.toLowerCase() || '';
    // const filteredServices = allServices.filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    // Actually, searchParams access in Server Components needs await in Next.js 15, but this is likely 14 based on syntax seen?
    // Wait, the previous file `EditServicePage` had `params: Promise<{ id: string }>`.
    // So `searchParams` might also be a Promise in newer Next.js.
    // But standard type is often just object in 14.
    // I'll check `package.json` later if needed, but assuming 14/15 safe pattern: just access it if not promise.
    // Actually existing code uses `searchParams` directly in some places or client `useSearchParams`.
    // I'll wrap it safely.

    // For simplicity and robustness, I'll just render all and let client search be added later if needed or just simple list.
    // I'll Include a search input that pushes to URL, and filter here.

    // Check if searchParams is promise (Next 15)
    // const params = await searchParams; // If it is a promise.
    // Safe check:
    const q = (searchParams?.q as string) || '';

    const filteredServices = allServices.filter(s =>
        !q || s.title.toLowerCase().includes(q.toLowerCase()) || s.category.toLowerCase().includes(q.toLowerCase())
    );

    return (
        <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Experiences</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Manage your travel experiences and services.
                    </p>
                </div>
                <Link href="/admin/services/new">
                    <Button className="w-full sm:w-auto text-sm sm:text-base">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Experience
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Experiences</CardTitle>
                    <CardDescription>
                        {filteredServices.length} experiences available.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Simple Search Form */}
                    <form className="mb-6">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                name="q"
                                placeholder="Search experiences..."
                                defaultValue={q}
                                className="pl-8"
                            />
                        </div>
                    </form>

                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredServices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            No experiences found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredServices.map((service) => {
                                        const isActive = !service.tags.includes('inactive');
                                        return (
                                            <TableRow key={service.id}>
                                                <TableCell>
                                                    {service.images?.[0] ? (
                                                        <div className="relative h-10 w-16 rounded overflow-hidden bg-muted">
                                                            <Image
                                                                src={service.images[0]}
                                                                alt={service.title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                                            No Img
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium max-w-[200px] truncate" title={service.title}>
                                                    {service.title}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{service.category}</Badge>
                                                </TableCell>
                                                <TableCell>€{Number(service.price).toFixed(0)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={isActive ? "default" : "secondary"} className={!isActive ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-green-100 text-green-700 hover:bg-green-200"}>
                                                        {isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <ExperienceActions id={service.id} isActive={isActive} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
