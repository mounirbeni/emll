import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Calendar, ArrowRight } from 'lucide-react'
import { BlogPost } from '@prisma/client'

interface BlogCardProps {
    post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group h-full">
            <div className="flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                        src={post.coverImage || '/placeholder-blog.jpg'}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-gray-600 line-clamp-3 mb-6 flex-1 text-sm">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto">
                        <span className="inline-flex items-center text-[#FF5F00] font-semibold text-sm group-hover:gap-2 transition-all">
                            Read Article <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
