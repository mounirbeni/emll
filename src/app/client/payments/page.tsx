"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    method?: string;
    createdAt: string;
    booking: {
        id: string;
        activityTitle: string;
    };
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            // Fetch bookings with payment information
            const res = await fetch("/api/bookings");
            if (!res.ok) throw new Error("Failed to fetch payments");
            const data = await res.json();
            // Handle wrapped response
            const bookings = data.data || data;

            // Extract payments from bookings
            const paymentsData: Payment[] = [];
            bookings.forEach((booking: any) => {
                if (booking.payments && booking.payments.length > 0) {
                    booking.payments.forEach((payment: any) => {
                        paymentsData.push({
                            ...payment,
                            booking: {
                                id: booking.id,
                                activityTitle: booking.activityTitle,
                            },
                        });
                    });
                } else if (booking.paymentStatus === "PAID") {
                    // Create a virtual payment record for bookings marked as paid
                    paymentsData.push({
                        id: `virtual-${booking.id}`,
                        amount: booking.totalPrice,
                        currency: "EUR",
                        status: "COMPLETED",
                        method: "UNKNOWN",
                        createdAt: booking.createdAt,
                        booking: {
                            id: booking.id,
                            activityTitle: booking.activityTitle,
                        },
                    });
                }
            });

            setPayments(paymentsData);
        } catch (error) {
            console.error("Error fetching payments:", error);
            toast.error("Failed to load payment history");
        } finally {
            setLoading(false);
        }
    };

    const filterPayments = (filter: string) => {
        switch (filter) {
            case "completed":
                return payments.filter((p) => p.status === "COMPLETED");
            case "pending":
                return payments.filter((p) => p.status === "PENDING");
            case "failed":
                return payments.filter((p) => p.status === "FAILED");
            default:
                return payments;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "FAILED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-600 mt-1">
                    View your transaction history and invoices
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
                    <TabsTrigger value="completed">
                        Completed ({payments.filter((p) => p.status === "COMPLETED").length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pending ({payments.filter((p) => p.status === "PENDING").length})
                    </TabsTrigger>
                    <TabsTrigger value="failed">
                        Failed ({payments.filter((p) => p.status === "FAILED").length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {filterPayments(activeTab).length > 0 ? (
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Booking</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filterPayments(activeTab).map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>
                                                    {new Date(payment.createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/client/bookings/${payment.booking.id}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {payment.booking.activityTitle}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    €{Number(payment.amount).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {payment.method?.toLowerCase() || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                                                            payment.status
                                                        )}`}
                                                    >
                                                        {payment.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {payment.status === "COMPLETED" && (
                                                        <Button variant="ghost" size="sm">
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Invoice
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No {activeTab} payments
                                </h3>
                                <p className="text-gray-600">
                                    {activeTab === "all"
                                        ? "You haven't made any payments yet"
                                        : `No ${activeTab} payments to show`}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
