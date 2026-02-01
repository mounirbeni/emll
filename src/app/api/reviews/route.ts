import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { updateExperienceRating, validateReviewInput, canUserReview } from '@/lib/reviews/rating-utils';
import { sanitizeString } from '@/lib/sanitize';

const createReviewSchema = z.object({
    experienceId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    title: z.string().max(100).optional(),
    comment: z.string().min(30).max(2000),
    images: z.array(z.string().url()).max(5).optional(),
});

/**
 * POST /api/reviews - Create a new verified review
 */
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'You must be logged in to submit a review' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate input schema
        const parseResult = createReviewSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: parseResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { experienceId, rating, title, comment, images } = parseResult.data;

        // Additional validation
        const inputValidation = validateReviewInput({ rating, title, comment });
        if (!inputValidation.valid) {
            return NextResponse.json(
                { error: 'Validation failed', details: inputValidation.errors },
                { status: 400 }
            );
        }

        // Check if user can review this experience
        const eligibility = await canUserReview(session.user.id, experienceId);
        if (!eligibility.canReview) {
            return NextResponse.json(
                { error: eligibility.reason },
                { status: 403 }
            );
        }

        // Sanitize text inputs
        const sanitizedTitle = title ? sanitizeString(title) : null;
        const sanitizedComment = sanitizeString(comment);

        // Create the review
        const review = await prisma.review.create({
            data: {
                rating,
                title: sanitizedTitle,
                comment: sanitizedComment,
                images: images || [],
                userId: session.user.id,
                experienceId,
                bookingId: eligibility.bookingId!,
                verified: true,
            },
            include: {
                user: {
                    select: { name: true },
                },
                experience: {
                    select: { title: true, slug: true },
                },
            },
        });

        // Update experience average rating
        await updateExperienceRating(experienceId);

        // Create admin notification for new review
        await prisma.adminNotification.create({
            data: {
                type: 'REVIEW',
                title: 'New Review Submitted',
                message: `${session.user.name || 'A customer'} left a ${rating}-star review for "${review.experience.title}"`,
                link: `/admin/reviews`,
            },
        });

        return NextResponse.json({
            success: true,
            review: {
                id: review.id,
                rating: review.rating,
                title: review.title,
                comment: review.comment,
                createdAt: review.createdAt,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        );
    }
}
