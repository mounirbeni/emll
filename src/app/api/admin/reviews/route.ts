import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

/**
 * GET /api/admin/reviews - Get all reviews for admin
 */
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const experienceId = searchParams.get('experienceId');
        const rating = searchParams.get('rating');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        const validPage = Math.max(1, page);
        const validLimit = Math.min(Math.max(1, limit), 100);
        const skip = (validPage - 1) * validLimit;

        // Build filter
        const where: Record<string, unknown> = {};
        if (experienceId) where.experienceId = experienceId;
        if (rating) where.rating = parseInt(rating, 10);

        const [reviews, totalCount] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                    experience: {
                        select: { id: true, title: true, slug: true },
                    },
                    booking: {
                        select: { id: true, date: true, userName: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: validLimit,
            }),
            prisma.review.count({ where }),
        ]);

        // Get review statistics
        const stats = await prisma.review.groupBy({
            by: ['rating'],
            _count: { rating: true },
        });

        const ratingDistribution = [1, 2, 3, 4, 5].map((r) => ({
            rating: r,
            count: stats.find((s) => s.rating === r)?._count.rating || 0,
        }));

        return NextResponse.json({
            reviews,
            pagination: {
                page: validPage,
                limit: validLimit,
                totalCount,
                totalPages: Math.ceil(totalCount / validLimit),
            },
            stats: {
                totalReviews: totalCount,
                ratingDistribution,
            },
        });

    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
