
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function GET() {
    try {
        const session = await requireAuth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch bookings with service images in a single query (fixes N+1)
        const bookings = await prisma.booking.findMany({
            where: {
                userId: session.user.id as string
            },
            orderBy: { createdAt: 'desc' }
        });

        return successResponse(bookings);
    } catch (error) {
        return errorResponse(error);
    }
}
