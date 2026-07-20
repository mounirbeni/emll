"use client";

import { useMemo, useState } from "react";
import {
    MapPin,
    Star,
    ExternalLink,
    UtensilsCrossed,
    Martini,
    Sparkles,
    Gamepad2,
    BedDouble,
    Mountain,
    Search,
    type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    RECOMMENDATION_CATEGORIES,
    recommendations,
    type Recommendation,
    type RecommendationCategory,
} from "@/lib/data/recommendations.data";

type FilterValue = RecommendationCategory | "All";

const CATEGORY_META: Record<
    RecommendationCategory,
    { icon: LucideIcon; gradient: string; accent: string }
> = {
    "Eat & Drink": {
        icon: UtensilsCrossed,
        gradient: "from-orange-400 to-amber-500",
        accent: "text-orange-600 bg-orange-50",
    },
    "Rooftops & Nightlife": {
        icon: Martini,
        gradient: "from-fuchsia-500 to-purple-600",
        accent: "text-fuchsia-600 bg-fuchsia-50",
    },
    "Spa & Wellness": {
        icon: Sparkles,
        gradient: "from-teal-400 to-emerald-500",
        accent: "text-teal-600 bg-teal-50",
    },
    "Gaming & Entertainment": {
        icon: Gamepad2,
        gradient: "from-indigo-500 to-blue-600",
        accent: "text-indigo-600 bg-indigo-50",
    },
    "Hotels & Riads": {
        icon: BedDouble,
        gradient: "from-rose-400 to-red-500",
        accent: "text-rose-600 bg-rose-50",
    },
    "Outdoor & Adventure": {
        icon: Mountain,
        gradient: "from-lime-500 to-green-600",
        accent: "text-lime-700 bg-lime-50",
    },
};

function RecommendationCard({ item }: { item: Recommendation }) {
    const meta = CATEGORY_META[item.category];
    const Icon = meta.icon;
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapsQuery)}`;

    return (
        <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Visual header */}
            <div className={cn("relative flex h-36 items-center justify-center bg-gradient-to-br", meta.gradient)}>
                <Icon className="h-12 w-12 text-white/90 drop-shadow-sm" strokeWidth={1.5} />
                <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center rounded-lg bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm backdrop-blur-sm">
                        {item.category}
                    </span>
                </div>
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-800 shadow-sm backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                    {item.rating.toFixed(1)}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{item.area}</span>
                    </div>
                    <span className="shrink-0 font-bold text-gray-700">{item.priceRange}</span>
                </div>

                <h3 className="mb-1.5 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-orange-600">
                    {item.name}
                </h3>

                <p className={cn("mb-3 inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold", meta.accent)}>
                    {item.highlight}
                </p>

                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {item.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[11px] font-medium text-gray-600">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                    View on Google Maps
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}

export default function RecommendationsClient() {
    const [activeCategory, setActiveCategory] = useState<FilterValue>("All");
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        return recommendations.filter((item) => {
            const matchesCategory = activeCategory === "All" || item.category === activeCategory;
            const q = query.trim().toLowerCase();
            const matchesQuery =
                q.length === 0 ||
                item.name.toLowerCase().includes(q) ||
                item.area.toLowerCase().includes(q) ||
                item.tags.some((t) => t.toLowerCase().includes(q));
            return matchesCategory && matchesQuery;
        });
    }, [activeCategory, query]);

    const featured = useMemo(() => recommendations.filter((r) => r.featured), []);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-amber-600 py-16 md:py-24">
                <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:24px_24px]" />
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                        Local Recommendations
                    </span>
                    <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-bold leading-tight text-white drop-shadow-sm md:text-6xl">
                        The Best of Marrakech
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-white/90 md:text-xl">
                        Our team&apos;s hand-picked guide to where to eat, relax, play, sleep and explore in the Red City.
                    </p>

                    {/* Search */}
                    <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-xl">
                        <Search className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, area, or vibe..."
                            className="w-full bg-transparent px-1 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </section>

            {/* Category filters */}
            <section className="sticky top-[56px] z-30 border-b border-gray-100 bg-white/95 backdrop-blur-sm md:top-20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {(["All", ...RECOMMENDATION_CATEGORIES] as FilterValue[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                                    activeCategory === cat
                                        ? "bg-primary text-white shadow-md shadow-orange-500/20"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured strip */}
            {activeCategory === "All" && query.trim() === "" && featured.length > 0 && (
                <section className="container mx-auto px-4 pt-10">
                    <h2 className="mb-5 text-2xl font-bold text-gray-900">Editor&apos;s Picks</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {featured.map((item) => (
                            <RecommendationCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            )}

            {/* All results */}
            <section className="container mx-auto px-4 py-10">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {activeCategory === "All" ? "All Recommendations" : activeCategory}
                    </h2>
                    <span className="text-sm font-medium text-gray-500">
                        {filtered.length} {filtered.length === 1 ? "place" : "places"}
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                        <p className="text-gray-500">No matches found. Try a different search or category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((item) => (
                            <RecommendationCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>

            {/* Disclaimer */}
            <section className="container mx-auto px-4 pb-16">
                <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-gray-400">
                    These are editorial picks curated by our local team, not paid placements. Opening hours, prices,
                    and availability can change — we recommend confirming details before you go.
                </p>
            </section>
        </div>
    );
}
