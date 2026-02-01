"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mail, Phone, Calendar, Trash2, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { deleteSupportRequest, updateSupportStatus } from "@/app/actions/admin-actions";

// Match Prisma type loosely or import if possible, but keep it simple for client
interface SupportRequest {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: string; // "PENDING", "RESOLVED", "CLOSED" etc.
    createdAt: Date;
    updatedAt: Date;
}

interface ComplaintsClientProps {
    initialRequests: SupportRequest[];
}

export function ComplaintsClient({ initialRequests }: ComplaintsClientProps) {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Provide client-side filtering since we load all attempts initially for now
    // In a real app with many requests, we would use searchParams and router.push
    const filteredRequests = initialRequests.filter(req =>
        statusFilter === "ALL" || req.status === statusFilter
    );

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const result = await updateSupportStatus(id, newStatus);
            if (result.success) {
                toast.success(`Status updated to ${newStatus}`);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsUpdating(true);
        try {
            const result = await deleteSupportRequest(deleteId);
            if (result.success) {
                toast.success("Request deleted successfully");
                setDeleteId(null);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete request");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="bg-[#F5EADB] text-[#FF6900] border-[#F5EADB]"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case "RESOLVED":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>;
            case "CLOSED":
                return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200"><XCircle className="w-3 h-3 mr-1" /> Closed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Requests</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredRequests.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                            <p className="text-xl font-medium text-muted-foreground">No support requests found</p>
                            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredRequests.map((request) => (
                        <Card key={request.id} className="overflow-hidden transition-all hover:shadow-md">
                            <div className="p-6 grid gap-6 md:grid-cols-[1fr_200px]">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">{request.subject}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {format(new Date(request.createdAt), 'PPP p')}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-4 w-4" />
                                                    {request.email}
                                                </div>
                                                {request.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-4 w-4" />
                                                        {request.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{request.message}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Author:</span>
                                        <span className="text-sm">{request.name}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 justify-start border-l pl-0 md:pl-6 border-dashed md:border-solid">
                                    <div className="flex justify-between md:justify-start items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-muted-foreground md:hidden">Status:</span>
                                        {getStatusBadge(request.status)}
                                    </div>

                                    <Select
                                        defaultValue={request.status}
                                        onValueChange={(val) => handleUpdateStatus(request.id, val)}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Update Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                                            <SelectItem value="CLOSED">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        variant="outline"
                                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                        onClick={() => setDeleteId(request.id)}
                                        disabled={isUpdating}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the support request.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
