"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Mail, Phone, Calendar, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface SupportRequest {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function ComplaintsPage() {
    const [requests, setRequests] = useState<SupportRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const url = statusFilter === "ALL"
                ? "/api/admin/support-requests"
                : `/api/admin/support-requests?status=${statusFilter}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            setRequests(data);
        } catch (error) {
            toast.error("Failed to load support requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/support-requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update");

            toast.success("Status updated successfully");
            fetchRequests();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const deleteRequest = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/support-requests/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete");

            toast.success("Request deleted successfully");
            setDeleteId(null);
            fetchRequests();
        } catch (error) {
            toast.error("Failed to delete request");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "RESOLVED":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Requests</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage customer support requests and complaints
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Requests</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={fetchRequests} variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : requests.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No support requests found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {requests.map((request) => (
                        <Card key={request.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{request.subject}</CardTitle>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="h-4 w-4" />
                                                <span>{request.email}</span>
                                            </div>
                                            {request.phone && (
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{request.phone}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                <span>{format(new Date(request.createdAt), "MMM dd, yyyy")}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(request.status)}>
                                        {request.status.replace("_", " ")}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-1">From: {request.name}</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {request.message}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2 border-t">
                                    <Select
                                        value={request.status}
                                        onValueChange={(value) => updateStatus(request.id, value)}
                                    >
                                        <SelectTrigger className="w-[160px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setDeleteId(request.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the support request.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && deleteRequest(deleteId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
