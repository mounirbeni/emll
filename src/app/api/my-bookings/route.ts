
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
            orderBy: { createdAt: 'desc' },
            include: {
                review: true,
                service: {
                    select: {
                        id: true,
                        images: true
                    }
                }
            }
        });

        // Map bookings with image URLs
        const bookingsWithImages = bookings.map(booking => {
            let imageUrl = null;
            if (booking.service?.images) {
                const images = booking.service.images as string[];
                if (Array.isArray(images) && images.length > 0) {
                    imageUrl = images[0];
                }
            }
            return {
                ...booking,
                imageUrl,
                service: undefined // Remove service object, keep only imageUrl
            };
        });

        return successResponse(bookingsWithImages);
    } catch (error) {
        return errorResponse(error);
    }
}
