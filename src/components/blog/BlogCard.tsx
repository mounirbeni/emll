"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";
import { format } from "date-fns";
import { ArrowRight, Clock } from "lucide-react";

interface BlogCardProps {
    post: BlogPost;
}

const PLACEHOLDER = "/images/placeholder-blog.svg";

/** Only real URLs can resolve; anything else falls back to the placeholder. */
function resolveImage(src?: string) {
    if (!src) return PLACEHOLDER;
    const value = src.trim();
    if (value.startsWith("/")) return value;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return PLACEHOLDER;
}

function BlogCardComponent({ post }: BlogCardProps) {
    // Remote images can be slow, blocked or removed — never leave a broken frame.
    const [imgSrc, setImgSrc] = useState(() => resolveImage(post.image));

    return (
        <Link href={`/blog/${post.slug}`} className="group h-full block">
            <div className="surface-card-interactive h-full flex flex-col overflow-hidden">
                {/* Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-ink-100">
                    <Image
                        src={imgSrc}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => setImgSrc(PLACEHOLDER)}
                    />
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-bold text-primary uppercase tracking-wide shadow-sm">
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-gray-500 text-sm line-clamp-3 mb-5 flex-grow leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center text-primary font-bold text-sm mt-auto">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export const BlogCard = memo(BlogCardComponent);
