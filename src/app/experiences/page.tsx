import { Suspense } from 'react';
import ExperienceCard from '@/components/experiences/ExperienceCard';
import ExperienceFilterBar from '@/components/experiences/ExperienceFilterBar';
import { prisma } from '@/lib/prisma';
import { Search } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering as search params change
export const dynamic = 'force-dynamic';

async function getExperiences(searchParams: { [key: string]: string | string[] | undefined }) {
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
    const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;

    const where: any = {
        enabled: true,
    };

    if (category && category !== 'All') {
        where.category = {
            equals: category,
            mode: 'insensitive',
        };
    }

    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { shortDescription: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
        ];
    }

    try {
        // Direct DB call is faster than API fetch for Server Components
        const experiences = await prisma.experience.findMany({
            where,
            orderBy: { popularity: 'desc' },
        });
        return experiences;
    } catch (error) {
        console.error("DB Error:", error);
        return [];
    }
}

export default async function ExperiencesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams; // Next.js 15+ requirement
    const experiences = await getExperiences(resolvedSearchParams);

    return (
        <div className="min-h-screen bg-white pb-20 pt-20">

            {/* Hero Section - Centered & Modern */}
            <div className="bg-gray-50 py-16 text-center md:py-24">
                <div className="container mx-auto px-4">
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                        Unforgettable Experiences
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
                        Discover the best activities, tours, and hidden gems in Marrakech, curated just for you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Filter Bar */}
                <ExperienceFilterBar />

                {/* Grid Section */}
                <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading experiences...</div>}>
                    {
                        experiences.length > 0 ? (
                            <div className="mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {
                                    experiences.map((experience) => (
                                        <ExperienceCard key={experience.id} experience={experience as any} />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">No experiences found</h3>
                                <p className="max-w-md text-gray-500">We couldn't find any experiences matching your search. Try adjusting your filters or checking back later.</p>
                                <Link
                                    href="/experiences"
                                    className="mt-6 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                                >
                                    View All Experiences
                                </Link>
                            </div>
                        )
                    }
                </Suspense>
            </div>
        </div>
    );
}
