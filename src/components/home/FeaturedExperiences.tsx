import Link from "next/link";

import { Button } from "@/components/ui/button";
import ExperienceCard from "@/components/experiences/ExperienceCard";
import { prisma } from "@/lib/prisma";

/**
 * Top experiences on the homepage.
 *
 * This used to render hardcoded mock rows whose ids (1–4) matched nothing in the
 * database, so the cards could never link anywhere. It now reads real featured
 * experiences and reuses ExperienceCard, which keeps the booking CTA identical
 * to the listing page.
 */
async function getFeaturedExperiences() {
    try {
        const featured = await prisma.experience.findMany({
            where: { enabled: true, featured: true },
            orderBy: { popularity: "desc" },
            take: 4,
        });

        if (featured.length >= 4) return featured;

        // Not enough curated picks yet — top up with the most popular ones.
        const fill = await prisma.experience.findMany({
            where: {
                enabled: true,
                id: { notIn: featured.map((e) => e.id) },
            },
            orderBy: { popularity: "desc" },
            take: 4 - featured.length,
        });

        return [...featured, ...fill];
    } catch (error) {
        console.error("[FeaturedExperiences] Failed to load experiences:", error);
        return [];
    }
}

export async function FeaturedExperiences() {
    const experiences = await getFeaturedExperiences();

    // Nothing to show (e.g. an empty database) — skip the section entirely
    // rather than rendering an empty grid.
    if (experiences.length === 0) return null;

    return (
        <section className="app-section bg-surface">
            <div className="app-container">
                <div className="mb-10 flex items-end justify-between gap-4">
                    <div>
                        <span className="eyebrow">Hand-picked</span>
                        <h2 className="type-h2 text-foreground mb-2 mt-3">Top Experiences</h2>
                        <p className="text-muted-foreground">Handpicked activities for your trip</p>
                    </div>
                    <Button asChild variant="outline" className="hidden shrink-0 md:flex">
                        <Link href="/experiences">View All</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {experiences.map((exp) => (
                        <ExperienceCard
                            key={exp.id}
                            experience={{
                                id: exp.id,
                                title: exp.title,
                                category: exp.category,
                                location: exp.location,
                                duration: exp.duration,
                                price: exp.price,
                                currency: exp.currency,
                                shortDescription: exp.shortDescription,
                                gallery: exp.gallery,
                                reviewCount: exp.reviewCount,
                                avgRating: exp.avgRating,
                                featured: exp.featured,
                            }}
                        />
                    ))}
                </div>

                <div className="mt-10 flex justify-center md:hidden">
                    <Button asChild variant="outline" size="lg" className="w-full rounded-full">
                        <Link href="/experiences">View All Experiences</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
