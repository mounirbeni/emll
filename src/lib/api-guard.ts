import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Admin guard for route handlers.
 *
 * Returns a NextResponse to send straight back when the caller is not an
 * admin, or `null` when the request may proceed:
 *
 *   const denied = await requireAdminResponse();
 *   if (denied) return denied;
 *
 * Several admin-only endpoints (experience create/update/delete, broadcast,
 * promo) previously shipped with no session check at all.
 */
export async function requireAdminResponse(): Promise<NextResponse | null> {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // The session role can be stale, so confirm against the database.
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
}
