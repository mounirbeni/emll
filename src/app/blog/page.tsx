"use client";

import { BLOG_POSTS } from "@/lib/data/blog-data";
import { BlogCard } from "@/components/blog/BlogCard";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
    Container,
    PageHero,
    Section,
    SectionHeader,
} from "@/components/layout/PageShell";

const CATEGORIES = ["All", "Travel Guide", "Food & Drink", "Tips", "Excursions"];

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = useMemo(() =>
        BLOG_POSTS.filter(post => {
            const matchesCategory = selectedCategory === "All" || post.category === selectedCategory || (selectedCategory === "Tips" && (post.category === "Travel Tips" || post.category === "Budget Travel"));
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        }), [selectedCategory, searchQuery]);

    const { featuredPost, otherPosts } = useMemo(() => {
        const featured = filteredPosts.find(p => p.featured) || filteredPosts[0];
        const others = filteredPosts.filter(p => p.id !== featured?.id);
        return { featuredPost: featured, otherPosts: others };
    }, [filteredPosts]);

    return (
        <>
            <PageHero
                eyebrow="Travel journal"
                title="Marrakech Travel Journal"
                subtitle="Insider tips, hidden gems, and local secrets for your perfect trip."
            >
                <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 md:flex-row">
                    <div className="relative w-full flex-1">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search articles"
                            className="text-foreground placeholder:text-ink-400 w-full rounded-full bg-white py-3 pl-10 pr-4 shadow-lg outline-none"
                        />
                        <Search className="text-ink-400 absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
                    </div>
                </div>
            </PageHero>

            <div className="border-border bg-background/95 sticky top-[56px] z-30 border-b backdrop-blur-sm md:top-20">
                <Container className="py-4">
                    <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                aria-pressed={selectedCategory === cat}
                                className={cn(
                                    "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                                    selectedCategory === cat
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

            {filteredPosts.length === 0 ? (
                <Section tone="surface">
                    <div className="py-16 text-center">
                        <h3 className="type-h3">No articles found</h3>
                        <p className="text-muted-foreground mt-2">
                            Try adjusting your search terms.
                        </p>
                    </div>
                </Section>
            ) : (
                <>
                    {featuredPost && (
                        <Section tone="surface" size="sm">
                            <SectionHeader eyebrow="Don't miss" title="Featured Story" />

                            <Link
                                href={`/blog/${featuredPost.slug}`}
                                className="surface-card-interactive group flex flex-col overflow-hidden md:flex-row"
                            >
                                <div className="relative min-h-[280px] md:min-h-[400px] md:w-1/2">
                                    <Image
                                        src={featuredPost.image.startsWith('http') || featuredPost.image.startsWith('/') ? featuredPost.image : "/images/placeholder-blog.svg"}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
                                    <span className="eyebrow mb-3">{featuredPost.category}</span>
                                    <h3 className="type-h2 group-hover:text-brand-600 mb-4 transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    <p className="text-muted-foreground type-lead mb-6">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center gap-4">
                                        <div className="bg-brand-100 text-brand-700 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                                            {featuredPost.author.charAt(0)}
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-foreground font-semibold">
                                                {featuredPost.author}
                                            </p>
                                            <p className="text-ink-400">
                                                {featuredPost.readTime} •{" "}
                                                {format(new Date(featuredPost.publishedAt), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Section>
                    )}

                    {otherPosts.length > 0 && (
                        <Section>
                            <SectionHeader
                                title="Latest Articles"
                                action={
                                    <span className="text-muted-foreground text-sm font-medium">
                                        {otherPosts.length} article{otherPosts.length === 1 ? "" : "s"}
                                    </span>
                                }
                            />
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {otherPosts.map(post => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>
                        </Section>
                    )}
                </>
            )}
        </>
    );
}
