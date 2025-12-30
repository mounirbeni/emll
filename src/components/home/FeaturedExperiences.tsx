"use client";

import { ActivityCard } from "@/components/shared/ActivityCard";
import { activitiesData } from "@/lib/data/activities-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturedExperiences() {
    // Flatten and take top items
    const allActivities = Object.values(activitiesData).flat().filter(activity => activity.id).slice(0, 8); // Just take 8 items for the grid

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-[1400px]">
                <h2 className="text-[24px] font-bold text-black mb-6">
                    Top Experiences in Marrakech
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </section>
    );
}
