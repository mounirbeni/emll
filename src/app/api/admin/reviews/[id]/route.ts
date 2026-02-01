import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { updateExperienceRating } from '@/lib/reviews/rating-utils';

/**
 * DELETE /api/admin/reviews/[id] - Delete a review (admin only)
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        // Get the review to find experienceId before deleting
        const review = await prisma.review.findUnique({
            where: { id },
            select: { experienceId: true },
        });

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        // Delete the review
        await prisma.review.delete({
            where: { id },
        });

        // Recalculate experience rating
        await updateExperienceRating(review.experienceId);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json(
            { error: 'Failed to delete review' },
            { status: 500 }
        );
    }
}
