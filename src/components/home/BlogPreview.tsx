"use client";

import Link from "next/link";
import NextImage from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
    {
        id: 1,
        title: "Top 10 Hidden Gems in Marrakech Medina",
        excerpt: "Discover the secret spots that only locals know about in the heart of the old city.",
        image: "IMAGE_PLACEHOLDER_PENDING_UPLOAD",
        date: "October 15, 2025",
        slug: "hidden-gems-marrakech"
    },
    {
        id: 2,
        title: "A Foodie’s Guide to Moroccan Street Food",
        excerpt: "From tangy tajines to sweet pastries, here is what you must try in Jemaa el-Fnaa.",
        image: "IMAGE_PLACEHOLDER_PENDING_UPLOAD",
        date: "November 2, 2025",
        slug: "foodies-guide-marrakech"
    },
    {
        id: 3,
        title: "Day Trip to Atlas Mountains: What to Expect",
        excerpt: "Everything you need to know before booking your adventure to the stunning Atlas Mountains.",
        image: "IMAGE_PLACEHOLDER_PENDING_UPLOAD",
        date: "November 20, 2025",
        slug: "atlas-mountains-guide"
    }
];

export function BlogPreview() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Travel Tips & Inspiration</h2>
                        <p className="text-gray-600">Get ready for your trip with our latest guides</p>
                    </div>
                    <Link href="/blog">
                        <Button variant="ghost" className="text-primary hover:text-primary/80 hidden md:flex items-center gap-2">
                            Read Journal <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group cursor-pointer">
                            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                                    <NextImage
                                        src={post.image === "IMAGE_PLACEHOLDER_PENDING_UPLOAD" ? "/images/placeholder-blog.svg" : post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Overlay effect on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">{post.date}</span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <span className="text-sm font-medium text-primary flex items-center gap-1 mt-auto">
                                        Read Article <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/blog">
                        <Button variant="outline" className="w-full">
                            View All Articles
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
