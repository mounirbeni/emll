import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdminResponse } from "@/lib/api-guard";

/**
 * DELETE /api/admin/conversations/[id]
 *
 * The admin inbox passes the *user* id here (it deletes the whole thread with a
 * traveller), so accept either a conversation id or a user id.
 */
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    const { id } = await params;

    try {
        const byId = await prisma.conversation.findUnique({ where: { id } });

        if (byId) {
            await prisma.conversation.delete({ where: { id } });
            return NextResponse.json({ deleted: 1 });
        }

        const result = await prisma.conversation.deleteMany({ where: { userId: id } });
        if (result.count === 0) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        return NextResponse.json({ deleted: result.count });
    } catch (error) {
        console.error("[admin/conversations] DELETE failed:", error);
        return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
    }
}
