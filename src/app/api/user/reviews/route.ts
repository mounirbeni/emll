import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * GET /api/user/reviews - Get the current user's reviews
 */
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const reviews = await prisma.review.findMany({
            where: { userId: session.user.id },
            include: {
                experience: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        gallery: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedReviews = reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            images: review.images,
            createdAt: review.createdAt,
            experience: {
                id: review.experience.id,
                title: review.experience.title,
                slug: review.experience.slug,
                image: review.experience.gallery[0] || null,
            },
        }));

        return NextResponse.json({ reviews: formattedReviews });

    } catch (error) {
        console.error('Error fetching user reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
