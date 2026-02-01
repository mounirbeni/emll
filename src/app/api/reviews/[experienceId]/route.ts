import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { maskUserName } from '@/lib/reviews/rating-utils';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

/**
 * GET /api/reviews/[experienceId] - Get reviews for an experience
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ experienceId: string }> }
) {
    try {
        const { experienceId } = await params;
        const { searchParams } = new URL(request.url);

        const sort = (searchParams.get('sort') as SortOption) || 'newest';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        // Validate pagination
        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 50);
        const skip = (validPage - 1) * validLimit;

        // Determine sort order
        let orderBy: Record<string, 'asc' | 'desc'>;
        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'highest':
                orderBy = { rating: 'desc' };
                break;
            case 'lowest':
                orderBy = { rating: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        }

        // Fetch reviews with user info
        const [reviews, totalCount, experience] = await Promise.all([
            prisma.review.findMany({
                where: { experienceId },
                include: {
                    user: {
                        select: { name: true },
                    },
                },
                orderBy,
                skip,
                take: validLimit,
            }),
            prisma.review.count({
                where: { experienceId },
            }),
            prisma.experience.findUnique({
                where: { id: experienceId },
                select: { avgRating: true, reviewCount: true },
            }),
        ]);

        // Format reviews with masked usernames
        const formattedReviews = reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            images: review.images,
            userName: maskUserName(review.user?.name || 'Anonymous'),
            verified: review.verified,
            createdAt: review.createdAt,
        }));

        return NextResponse.json({
            reviews: formattedReviews,
            pagination: {
                page: validPage,
                limit: validLimit,
                totalCount,
                totalPages: Math.ceil(totalCount / validLimit),
            },
            summary: {
                avgRating: experience?.avgRating || 0,
                reviewCount: experience?.reviewCount || 0,
            },
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
