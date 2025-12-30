
"use client";

import { useSearchParams } from "next/navigation";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { activitiesData } from "@/lib/data/activities-data";
import { Activity } from "@/lib/types";

export function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || searchParams.get("category");
    // Implement more filters logic here

    // Transform static data to flat array for now
    const allActivities = Object.values(activitiesData).flat();

    const filteredActivities = allActivities.filter(activity => {
        if (!query) return true;
        const normalizedQuery = query.toLowerCase();
        return (
            activity.title.toLowerCase().includes(normalizedQuery) ||
            activity.category.toLowerCase().includes(normalizedQuery) ||
            (activity.tags || []).some(tag => tag.toLowerCase().includes(normalizedQuery))
        );
    });

    if (filteredActivities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-xl font-bold text-black mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-lg max-w-md">
                    We are expanding our services and this service will be available soon
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.filter(a => a.id).map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
        </div>
    );
}
