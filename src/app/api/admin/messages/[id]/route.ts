import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdminResponse } from "@/lib/api-guard";

/** GET /api/admin/messages/[conversationId] — full thread, marked as read. */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    const { id } = await params;

    try {
        const conversation = await prisma.conversation.findUnique({ where: { id } });
        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: "asc" },
        });

        // Opening a thread clears its unread badge.
        await prisma.message.updateMany({
            where: { conversationId: id, read: false, sender: "USER" },
            data: { read: true },
        });

        return NextResponse.json(
            messages.map((m) => ({
                id: m.id,
                content: m.content,
                sender: m.sender,
                createdAt: m.createdAt.toISOString(),
            }))
        );
    } catch (error) {
        console.error("[admin/messages] GET failed:", error);
        return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
    }
}

/** POST /api/admin/messages/[conversationId] — reply as the support team. */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    const session = await auth();
    const { id } = await params;

    let content: unknown;
    try {
        ({ content } = await request.json());
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (typeof content !== "string" || content.trim() === "") {
        return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    try {
        const conversation = await prisma.conversation.findUnique({ where: { id } });
        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                sender: "ADMIN",
                read: true,
                conversationId: id,
                // Attribute the reply to the admin who sent it.
                userId: session!.user!.id as string,
            },
        });

        // Replying should surface the thread at the top of the inbox and reopen
        // it if it had been closed.
        await prisma.conversation.update({
            where: { id },
            data: {
                updatedAt: new Date(),
                ...(conversation.status === "CLOSED" ? { status: "OPEN" as const } : {}),
            },
        });

        return NextResponse.json(
            {
                id: message.id,
                content: message.content,
                sender: message.sender,
                createdAt: message.createdAt.toISOString(),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[admin/messages] POST failed:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
