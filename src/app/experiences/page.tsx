import { Suspense } from 'react';
import ExperienceCard from '@/components/experiences/ExperienceCard';
import ExperienceFilterBar from '@/components/experiences/ExperienceFilterBar';
import { prisma } from '@/lib/prisma';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering as search params change
export const dynamic = 'force-dynamic';

async function getExperiences(searchParams: { [key: string]: string | string[] | undefined }) {
    const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
    const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
    const minPrice = typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined;
    const maxPrice = typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined;
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'recommended';
    // Duration is tricky without standardized fields, skipping DB filter for duration for now or doing simple string match if needed.
    // We will fetch and then filtered or just rely on basic query if enabled.

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
            { location: { contains: q, mode: 'insensitive' } },
        ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { popularity: 'desc' }; // Default
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'popularity') orderBy = { popularity: 'desc' };

    try {
        const experiences = await prisma.experience.findMany({
            where,
            orderBy,
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
    const resolvedSearchParams = await searchParams;
    const experiences = await getExperiences(resolvedSearchParams);

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <div className="relative bg-gray-50 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-300 blur-3xl"></div>
                    <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-blue-200 blur-3xl"></div>
                </div>

                <div className="container relative mx-auto px-4 text-center">
                    <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold text-orange-600">
                        Explore Marrakech
                    </span>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-7xl">
                        Unforgettable <span className="text-orange-500">Experiences</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                        Discover the best activities, tours, and hidden gems in Marrakech. Curated by locals, loved by travelers.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20 pb-20">

                {/* Filter Bar */}
                <ExperienceFilterBar />

                {/* Results Count & Sort Label (Mobile/Tablet usually shown in filter bar, but good to have a summary) */}
                <div className="mt-8 mb-6 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {experiences.length} experiences</span>
                </div>

                {/* Grid Section */}
                <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading experiences...</div>}>
                    {
                        experiences.length > 0 ? (
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {
                                    experiences.map((experience) => (
                                        <ExperienceCard key={experience.id} experience={experience as any} />
                                    ))
                                }
                            </div>
                        ) : (
                            <EmptyState />
                        )
                    }
                </Suspense>
            </div>

            {/* Newsletter / Bottom CTA Section */}
            <div className="bg-gray-900 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
                    <p className="text-gray-400 mb-8">Our concierge team can help you plan the perfect custom trip.</p>
                    <Link href="/contact" className="inline-flex items-center rounded-xl bg-white text-gray-900 px-8 py-4 font-bold hover:bg-gray-100 transition-colors">
                        Contact Concierge <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
                <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900">No experiences found</h3>
            <p className="max-w-md text-gray-500 mb-8">
                We couldn't find any experiences matching your search filters. Try adjusting your dates, price range, or category.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/experiences"
                    className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                >
                    Clear All Filters
                </Link>
            </div>
        </div>
    )
}
