import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { canUserReview } from '@/lib/reviews/rating-utils';

/**
 * GET /api/reviews/check?experienceId=xxx - Check if user can review an experience
 */
export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { canReview: false, reason: 'You must be logged in to leave a review' },
                { status: 200 }
            );
        }

        const { searchParams } = new URL(request.url);
        const experienceId = searchParams.get('experienceId');

        if (!experienceId) {
            return NextResponse.json(
                { error: 'experienceId is required' },
                { status: 400 }
            );
        }

        const eligibility = await canUserReview(session.user.id, experienceId);

        return NextResponse.json(eligibility);

    } catch (error) {
        console.error('Error checking review eligibility:', error);
        return NextResponse.json(
            { error: 'Failed to check eligibility' },
            { status: 500 }
        );
    }
}
