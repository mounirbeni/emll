import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return errorResponse(new Error("Unauthorized"), 401);
        }

        const { id } = await params;

        if (!id) {
            return errorResponse(new Error("Notification ID is required"), 400);
        }

        // Fetch the notification
        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            return errorResponse(new Error("Notification not found"), 404);
        }

        // Verify ownership
        if (notification.userId !== session.user.id) {
            return errorResponse(new Error("Forbidden"), 403);
        }

        // Mark as read (always set to true when marking as read)
        const updated = await prisma.notification.update({
            where: { id },
            data: { read: true },
        });

        return successResponse(updated);
    } catch (error) {
        console.error("Error updating notification:", error);
        return errorResponse(error);
    }
}
