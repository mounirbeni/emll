import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import ReviewForm from '@/components/experiences/reviews/ReviewForm';
import { canUserReview } from '@/lib/reviews/rating-utils';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

interface ReviewPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
    const { id } = await params;
    const experience = await prisma.experience.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        select: { title: true },
    });

    return {
        title: experience ? `Review ${experience.title}` : 'Write a Review',
    };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
    const session = await auth();
    const { id } = await params;

    // If not logged in, redirect to login
    if (!session?.user?.id) {
        redirect(`/auth/login?callbackUrl=/experiences/${id}/review`);
    }

    // Find the experience
    const experience = await prisma.experience.findFirst({
        where: {
            OR: [{ id }, { slug: id }],
        },
        select: {
            id: true,
            title: true,
            slug: true,
            gallery: true,
        },
    });

    if (!experience) {
        notFound();
    }

    // Check if user can review
    const eligibility = await canUserReview(session.user.id, experience.id);

    if (!eligibility.canReview) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-16">
                <div className="container mx-auto px-4 max-w-2xl">
                    <Link
                        href={`/experiences/${experience.slug}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF6900] mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Experience
                    </Link>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Cannot Write Review
                        </h1>
                        <p className="text-gray-600 mb-6">{eligibility.reason}</p>
                        <Link
                            href={`/experiences/${experience.slug}`}
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#E55A00] transition-colors"
                        >
                            View Experience
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-16">
            <div className="container mx-auto px-4">
                <Link
                    href={`/experiences/${experience.slug}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF6900] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Experience
                </Link>

                {/* Experience summary */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-4">
                        {experience.gallery[0] && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={experience.gallery[0]}
                                    alt={experience.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {experience.title}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Share your experience to help other travelers
                            </p>
                        </div>
                    </div>
                </div>

                {/* Review Form */}
                <ReviewForm
                    experienceId={experience.id}
                    experienceTitle={experience.title}
                />
            </div>
        </div>
    );
}
