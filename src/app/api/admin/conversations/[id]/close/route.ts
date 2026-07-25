import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdminResponse } from "@/lib/api-guard";

/**
 * PATCH /api/admin/conversations/[id]/close
 * Body: { action: "close" | "reopen" }
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    const { id } = await params;

    let action: unknown;
    try {
        ({ action } = await request.json());
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (action !== "close" && action !== "reopen") {
        return NextResponse.json(
            { error: 'action must be "close" or "reopen"' },
            { status: 400 }
        );
    }

    try {
        const existing = await prisma.conversation.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const conversation = await prisma.conversation.update({
            where: { id },
            data: { status: action === "close" ? "CLOSED" : "OPEN" },
        });

        return NextResponse.json({ id: conversation.id, status: conversation.status });
    } catch (error) {
        console.error("[admin/conversations/close] PATCH failed:", error);
        return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
    }
}
