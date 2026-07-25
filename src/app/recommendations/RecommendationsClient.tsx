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
    Container,
    PageHero,
    Section,
    SectionHeader,
} from "@/components/layout/PageShell";
import {
    RECOMMENDATION_CATEGORIES,
    recommendations,
    type Recommendation,
    type RecommendationCategory,
} from "@/lib/data/recommendations.data";

type FilterValue = RecommendationCategory | "All";

/**
 * Category accents are drawn from a single Marrakech palette — terracotta,
 * saffron, mint tea, Majorelle blue, clay rose and palm olive — all held at a
 * similar saturation and depth. They stay distinguishable without fracturing
 * into a rainbow that would read as six different brands.
 */
const CATEGORY_META: Record<
    RecommendationCategory,
    { icon: LucideIcon; gradient: string; accent: string }
> = {
    "Eat & Drink": {
        icon: UtensilsCrossed,
        gradient: "from-[#FF8434] to-[#E85C00]",
        accent: "text-brand-700 bg-brand-50",
    },
    "Rooftops & Nightlife": {
        icon: Martini,
        gradient: "from-[#4C6FBF] to-[#2A4A99]",
        accent: "text-[#2A4A99] bg-[#EDF1FA]",
    },
    "Spa & Wellness": {
        icon: Sparkles,
        gradient: "from-[#2FB98A] to-[#0B8355]",
        accent: "text-mint-700 bg-mint-50",
    },
    "Gaming & Entertainment": {
        icon: Gamepad2,
        gradient: "from-[#8A62B8] to-[#5D3D8C]",
        accent: "text-[#5D3D8C] bg-[#F3EEF9]",
    },
    "Hotels & Riads": {
        icon: BedDouble,
        gradient: "from-[#D9647A] to-[#B03D55]",
        accent: "text-[#B03D55] bg-[#FBEDF0]",
    },
    "Outdoor & Adventure": {
        icon: Mountain,
        gradient: "from-[#8CA542] to-[#5E7A22]",
        accent: "text-[#5E7A22] bg-[#F3F7E6]",
    },
};

function RecommendationCard({ item }: { item: Recommendation }) {
    const meta = CATEGORY_META[item.category];
    const Icon = meta.icon;
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapsQuery)}`;

    return (
        <div className="surface-card-interactive group relative flex h-full flex-col overflow-hidden">
            {/* Visual header */}
            <div className={cn("relative flex h-36 items-center justify-center bg-gradient-to-br", meta.gradient)}>
                <Icon className="h-12 w-12 text-white/90 drop-shadow-sm" strokeWidth={1.5} />
                <div className="absolute left-3 top-3">
                    <span className="type-eyebrow text-ink-800 inline-flex items-center rounded-lg bg-white/95 px-3 py-1 uppercase shadow-sm backdrop-blur-sm">
                        {item.category}
                    </span>
                </div>
                <div className="text-ink-800 absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-sm">
                    <Star className="fill-saffron-400 text-saffron-400 h-3.5 w-3.5" />
                    {item.rating.toFixed(1)}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <div className="text-ink-500 mb-2 flex items-center justify-between gap-2 text-xs font-medium">
                    <div className="flex min-w-0 items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{item.area}</span>
                    </div>
                    <span className="text-ink-700 shrink-0 font-bold">{item.priceRange}</span>
                </div>

                <h3 className="type-h4 group-hover:text-brand-600 mb-1.5 transition-colors">
                    {item.name}
                </h3>

                <p className={cn("mb-3 inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold", meta.accent)}>
                    {item.highlight}
                </p>

                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                    {item.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-ink-600 text-[11px] font-medium">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-border bg-surface text-ink-700 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 mt-auto flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors"
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

    const showFeatured =
        activeCategory === "All" && query.trim() === "" && featured.length > 0;

    return (
        <>
            <PageHero
                eyebrow="Local recommendations"
                title="The Best of Marrakech"
                subtitle="Our team's hand-picked guide to where to eat, relax, play, sleep and explore in the Red City."
            >
                <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-xl">
                    <Search className="text-ink-400 ml-2 h-5 w-5 shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, area, or vibe..."
                        aria-label="Search recommendations"
                        className="text-foreground placeholder:text-ink-400 w-full bg-transparent px-1 py-2 text-sm outline-none"
                    />
                </div>
            </PageHero>

            {/* Category filters */}
            <div className="border-border bg-background/95 sticky top-[56px] z-30 border-b backdrop-blur-sm md:top-20">
                <Container className="py-4">
                    <div className="scrollbar-hide flex gap-2 overflow-x-auto">
                        {(["All", ...RECOMMENDATION_CATEGORIES] as FilterValue[]).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                aria-pressed={activeCategory === cat}
                                className={cn(
                                    "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                                    activeCategory === cat
                                        ? "bg-primary text-white"
                                        : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            {showFeatured && (
                <Section tone="surface" size="sm">
                    <SectionHeader
                        eyebrow="Hand-picked"
                        title="Editor's Picks"
                        subtitle="The handful of places we recommend first, every time."
                    />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featured.map((item) => (
                            <RecommendationCard key={item.id} item={item} />
                        ))}
                    </div>
                </Section>
            )}

            <Section size="sm">
                <SectionHeader
                    title={activeCategory === "All" ? "All Recommendations" : activeCategory}
                    action={
                        <span className="text-muted-foreground text-sm font-medium">
                            {filtered.length} {filtered.length === 1 ? "place" : "places"}
                        </span>
                    }
                />

                {filtered.length === 0 ? (
                    <div className="border-border rounded-2xl border border-dashed py-16 text-center">
                        <p className="text-muted-foreground">
                            No matches found. Try a different search or category.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((item) => (
                            <RecommendationCard key={item.id} item={item} />
                        ))}
                    </div>
                )}

                <p className="text-ink-400 mx-auto mt-12 max-w-3xl text-center text-xs leading-relaxed">
                    These are editorial picks curated by our local team, not paid placements. Opening
                    hours, prices, and availability can change — we recommend confirming details
                    before you go.
                </p>
            </Section>
        </>
    );
}
