import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdminResponse } from "@/lib/api-guard";

/**
 * GET /api/admin/conversations — support inbox for admins.
 *
 * The admin messages screen called this endpoint (and three siblings) but none
 * of them existed, so the whole inbox failed to load.
 */
export async function GET() {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: { updatedAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
                _count: {
                    select: { messages: { where: { read: false, sender: "USER" } } },
                },
            },
        });

        return NextResponse.json(
            conversations.map((c) => ({
                id: c.id,
                subject: c.subject,
                status: c.status,
                updatedAt: c.updatedAt.toISOString(),
                lastMessage: c.messages[0]?.content ?? "",
                lastMessageTime: (c.messages[0]?.createdAt ?? c.updatedAt).toISOString(),
                userName: c.user?.name ?? "Unknown",
                userEmail: c.user?.email ?? "",
                unreadCount: c._count.messages,
                userId: c.userId,
            }))
        );
    } catch (error) {
        console.error("[admin/conversations] GET failed:", error);
        return NextResponse.json({ error: "Failed to load conversations" }, { status: 500 });
    }
}
