
"use client";

import { useSearchParams } from "next/navigation";
import { ActivityCard } from "@/components/shared/ActivityCard";
import { activitiesData } from "@/lib/data/activities-data";
import { Activity } from "@/lib/types";

export function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || searchParams.get("category");
    const categoriesParam = searchParams.get("categories");
    const durationsParam = searchParams.get("durations");
    const maxPriceParam = searchParams.get("maxPrice");
    const minPriceParam = searchParams.get("minPrice");
    const dateParam = searchParams.get("date");

    // Transform static data to flat array for now
    const allActivities = Object.values(activitiesData).flat();

    const selectedCategories = categoriesParam
        ? categoriesParam.split(",").map((cat) => cat.trim().toLowerCase()).filter(Boolean)
        : [];
    const selectedDurations = durationsParam
        ? durationsParam.split(",").map((dur) => dur.trim().toLowerCase()).filter(Boolean)
        : [];
    const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
    const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
    const selectedDate = dateParam ? new Date(dateParam) : undefined;

    const normalizeValue = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const getDurationBucket = (duration: string): string | null => {
        const normalized = duration.toLowerCase();
        if (normalized.includes("multi")) return "multi-day";
        if (normalized.includes("full day")) return "full-day";
        if (normalized.includes("half day")) return "half-day";

        const dayMatch = normalized.match(/(\d+)\s*day/);
        if (dayMatch) {
            const days = Number(dayMatch[1]);
            if (days >= 2) return "multi-day";
            return "full-day";
        }

        const hourMatch = normalized.match(/(\d+(\.\d+)?)\s*h/);
        if (hourMatch) {
            const hours = Number(hourMatch[1]);
            if (hours <= 4) return "half-day";
            return "full-day";
        }

        return null;
    };

    const matchesSeason = (activity: Activity, date?: Date) => {
        if (!date) return true;
        if (Number.isNaN(date.getTime())) return true;
        const notes = activity.seasonalNotes?.toLowerCase();
        if (!notes) return true;

        const monthName = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
        const monthShort = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
        const seasonKeywords = ["winter", "spring", "summer", "autumn", "fall"];
        const hasSeasonOrMonth = seasonKeywords.some((season) => notes.includes(season))
            || notes.includes(monthName)
            || notes.includes(monthShort);

        if (!hasSeasonOrMonth) return true;

        const month = date.getMonth();
        const season =
            month === 11 || month <= 1
                ? "winter"
                : month <= 4
                    ? "spring"
                    : month <= 7
                        ? "summer"
                        : "autumn";

        return notes.includes(monthName) || notes.includes(monthShort) || notes.includes(season);
    };

    const filteredActivities = allActivities.filter(activity => {
        if (!query) return true;
        const normalizedQuery = query.toLowerCase();
        return (
            activity.title.toLowerCase().includes(normalizedQuery) ||
            activity.category.toLowerCase().includes(normalizedQuery) ||
            (activity.tags || []).some(tag => tag.toLowerCase().includes(normalizedQuery))
        );
    }).filter((activity) => {
        if (!selectedCategories.length) return true;
        return selectedCategories.includes(normalizeValue(activity.category));
    }).filter((activity) => {
        if (!selectedDurations.length) return true;
        const bucket = getDurationBucket(activity.duration);
        return bucket ? selectedDurations.includes(bucket) : false;
    }).filter((activity) => {
        if (typeof maxPrice === "number" && activity.price > maxPrice) return false;
        if (typeof minPrice === "number" && activity.price < minPrice) return false;
        return true;
    }).filter((activity) => matchesSeason(activity, selectedDate));

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
