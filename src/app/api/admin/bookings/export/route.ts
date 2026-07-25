import { prisma } from "@/lib/prisma";
import { requireAdminResponse } from "@/lib/api-guard";

/**
 * GET /api/admin/bookings/export — CSV of all bookings.
 *
 * The "Export" button on the admin bookings screen already fetched this URL and
 * downloaded the blob; the endpoint itself was never implemented, so the button
 * always showed an error toast.
 */

/** RFC 4180: wrap in quotes and double any embedded quote. */
function csvCell(value: unknown): string {
    if (value === null || value === undefined) return '""';
    const s = value instanceof Date ? value.toISOString() : String(value);
    return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: "desc" },
            include: { experience: { select: { title: true } } },
        });

        const headers = [
            "Booking ID",
            "Created",
            "Experience",
            "Date",
            "Guests",
            "Customer",
            "Email",
            "Phone",
            "Total",
            "Status",
            "Payment Status",
            "Pickup Location",
            "Special Requests",
        ];

        const rows = bookings.map((b) =>
            [
                b.id,
                b.createdAt,
                b.experience?.title ?? "",
                b.date,
                b.numberOfPeople,
                b.userName,
                b.userEmail,
                b.userPhone,
                b.totalPrice,
                b.status,
                b.paymentStatus,
                b.pickupLocation ?? "",
                b.specialRequests ?? "",
            ]
                .map(csvCell)
                .join(",")
        );

        // BOM so Excel opens UTF-8 (accented names, Arabic) correctly.
        const csv = "﻿" + [headers.map(csvCell).join(","), ...rows].join("\r\n");
        const filename = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;

        return new Response(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("[admin/bookings/export] failed:", error);
        return Response.json({ error: "Failed to export bookings" }, { status: 500 });
    }
}
