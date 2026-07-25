import { Suspense } from 'react';
import ExperienceCard from '@/components/experiences/ExperienceCard';
import ExperienceFilterBar from '@/components/experiences/ExperienceFilterBar';
import { prisma } from '@/lib/prisma';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PageHero, Section } from '@/components/layout/PageShell';

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
        <>
            <PageHero
                eyebrow="Explore Marrakech"
                title="Unforgettable Experiences"
                subtitle="Discover the best activities, tours, and hidden gems in Marrakech. Curated by locals, loved by travelers."
            />

            <Section size="sm">
                <ExperienceFilterBar />

                <div className="text-muted-foreground mb-6 mt-8 flex items-center justify-between text-sm">
                    <span>
                        Showing {experiences.length} experience{experiences.length === 1 ? "" : "s"}
                    </span>
                </div>

                <Suspense
                    fallback={
                        <div className="text-muted-foreground py-20 text-center">
                            Loading experiences...
                        </div>
                    }
                >
                    {experiences.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {experiences.map((experience) => (
                                <ExperienceCard key={experience.id} experience={experience as any} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </Suspense>
            </Section>

            {/* Concierge CTA */}
            <Section tone="brand" size="sm">
                <div className="flex flex-col items-center gap-5 text-center">
                    <h2 className="type-h2 text-white">Can&apos;t find what you&apos;re looking for?</h2>
                    <p className="type-lead max-w-2xl text-white/90">
                        Our concierge team can help you plan the perfect custom trip.
                    </p>
                    <Link
                        href="/support"
                        className="text-brand-600 inline-flex items-center rounded-full bg-white px-8 py-4 font-bold transition-colors hover:bg-white/90"
                    >
                        Contact Concierge <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </Section>
        </>
    );
}

function EmptyState() {
    return (
        <div className="border-border bg-surface flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-24 text-center">
            <div className="ring-border mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1">
                <Search className="text-ink-400 h-8 w-8" />
            </div>
            <h3 className="type-h3 mb-3">No experiences found</h3>
            <p className="text-muted-foreground mb-8 max-w-md">
                We couldn&apos;t find any experiences matching your search filters. Try adjusting your
                dates, price range, or category.
            </p>
            <Link
                href="/experiences"
                className="bg-primary hover:bg-brand-600 rounded-full px-6 py-3 text-sm font-bold text-white transition-colors"
            >
                Clear All Filters
            </Link>
        </div>
    )
}
