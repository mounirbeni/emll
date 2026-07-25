"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/BlogCard";
import { BLOG_POSTS } from "@/lib/data/blog-data";

/**
 * Latest articles on the homepage.
 *
 * This used to hold its own hardcoded posts whose slugs
 * ("hidden-gems-marrakech", "foodies-guide-marrakech", "atlas-mountains-guide")
 * matched nothing in BLOG_POSTS, so every "Read Article" link 404'd. It now
 * reads the real posts and reuses BlogCard so the cards match /blog exactly.
 */
export function BlogPreview() {
    const posts = [...BLOG_POSTS]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 3);

    if (posts.length === 0) return null;

    return (
        <section className="app-section bg-surface">
            <div className="app-container">
                <div className="mb-10 flex items-end justify-between gap-4">
                    <div>
                        <span className="eyebrow">Travel journal</span>
                        <h2 className="type-h2 text-foreground mb-2 mt-3">
                            Travel Tips &amp; Inspiration
                        </h2>
                        <p className="text-muted-foreground">
                            Get ready for your trip with our latest guides
                        </p>
                    </div>
                    <Button asChild variant="ghost" className="text-primary hidden shrink-0 items-center gap-2 md:flex">
                        <Link href="/blog">
                            Read Journal <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                <div className="mt-10 flex justify-center md:hidden">
                    <Button asChild variant="outline" className="w-full rounded-full">
                        <Link href="/blog">View All Articles</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
