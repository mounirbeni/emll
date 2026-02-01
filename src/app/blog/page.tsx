"use client";

import { BLOG_POSTS } from "@/lib/data/blog-data";
import { BlogCard } from "@/components/blog/BlogCard";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white pt-24 pb-12 px-4 shadow-sm relative z-10">
                <div className="max-w-[1400px] mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Marrakech <span className="text-primary">Travel Journal</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
                        Insider tips, hidden gems, and local secrets for your perfect trip.
                    </p>

                    {/* Search & Filter */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                        <div className="relative w-full md:w-auto flex-1">
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar px-1">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                        selectedCategory === cat
                                            ? "bg-primary text-white shadow-md shadow-orange-500/20"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {filteredPosts.length > 0 ? (
                    <div className="space-y-12">
                        {/* Featured Post (if any) */}
                        {featuredPost && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-primary rounded-full block"></span>
                                    Featured Story
                                </h2>
                                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row group cursor-pointer hover:border-primary/20 transition-all">
                                    <div className="md:w-1/2 relative min-h-[300px] md:min-h-[400px]">
                                        <Image
                                            src={featuredPost.image}
                                            alt={featuredPost.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    </div>
                                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                        <span className="text-primary font-bold tracking-wide uppercase text-sm mb-3">
                                            {featuredPost.category}
                                        </span>
                                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                                            {featuredPost.title}
                                        </h3>
                                        <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 mt-auto">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary font-bold text-sm">
                                                {featuredPost.author.charAt(0)}
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-bold text-gray-900">{featuredPost.author}</p>
                                                <p className="text-gray-400">{featuredPost.readTime} • {new Date(featuredPost.publishedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Other Posts Grid */}
                        {otherPosts.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {otherPosts.map(post => (
                                        <BlogCard key={post.id} post={post} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-gray-900">No articles found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
