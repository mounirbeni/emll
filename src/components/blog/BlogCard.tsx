import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import { BlogPost } from '@prisma/client'

interface BlogCardProps {
    post: BlogPost
}

function estimateReadingTimeMinutes(text: string): number {
    const words = text.trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.round(words / 220))
    return minutes
}

export function BlogCard({ post }: BlogCardProps) {
    const category = (post as unknown as { category?: string | null }).category
    const readingTime = estimateReadingTimeMinutes(
        String(post.content || '').replace(/<[^>]*>?/gm, '')
    )

    return (
        <Link href={`/blog/${post.slug}`} className="group h-full">
            <div className="flex flex-col h-full bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                        src={post.coverImage || '/placeholder-blog.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {category && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-white/95 backdrop-blur-sm text-charcoal text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                {category}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-medium-gray mb-3">
                        <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {readingTime} min read
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-charcoal mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-medium-gray line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto">
                        <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                            Read Article <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
