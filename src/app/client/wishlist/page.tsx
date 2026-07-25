import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import ExperienceCard from "@/components/experiences/ExperienceCard";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { wishlist: true },
    });

    const savedIds = user?.wishlist ?? [];

    // Saved ids can outlive the experiences they point at, so query rather than
    // trusting the stored list.
    const experiences = savedIds.length
        ? await prisma.experience.findMany({
            where: { id: { in: savedIds }, enabled: true },
            orderBy: { popularity: "desc" },
        })
        : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="type-h2">My Wishlist</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    {experiences.length === 0
                        ? "Experiences you save will appear here."
                        : `${experiences.length} saved experience${experiences.length === 1 ? "" : "s"}`}
                </p>
            </div>

            {experiences.length === 0 ? (
                <div className="border-border flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
                    <div className="bg-brand-50 text-brand-600 mb-5 flex h-16 w-16 items-center justify-center rounded-full">
                        <Heart className="h-7 w-7" />
                    </div>
                    <h2 className="type-h3 mb-2">Nothing saved yet</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                        Tap the heart on any experience to keep it here for later.
                    </p>
                    <Button asChild className="rounded-full">
                        <Link href="/experiences">Browse experiences</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
