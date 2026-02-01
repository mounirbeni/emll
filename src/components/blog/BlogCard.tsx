"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/types";
import { format } from "date-fns";
import { ArrowRight, Clock } from "lucide-react";

interface BlogCardProps {
    post: BlogPost;
}

function BlogCardComponent({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group h-full block">
            <div className="bg-white h-full flex flex-col rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/20 hover:-translate-y-1">
                {/* Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-50">
                    <Image
                        src={post.image === "IMAGE_PLACEHOLDER_PENDING_UPLOAD" ? "/images/placeholder-blog.svg" : post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
