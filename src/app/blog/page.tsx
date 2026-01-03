import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { BlogCard } from '@/components/blog/BlogCard'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
    title: 'Marrakech Travel Blog | Expert Guides & Tips',
    description: 'Discover the best of Marrakech with our expert travel guides. From hidden gems in the Medina to Agafay desert adventures and food tours.',
}

export const dynamic = 'force-dynamic'

async function getBlogPosts() {
    return await prisma.blogPost.findMany({
        orderBy: { publishedAt: 'desc' },
        include: { author: true }
    })
}

import { BlogPost } from '@prisma/client'

export default async function BlogPage() {
    let posts: (BlogPost & { author: { id: string; name: string | null; email: string; password: string | null; phone: string | null; role: "ADMIN" | "CUSTOMER"; canMessage: boolean; conversationStatus: "OPEN" | "CLOSED" | "ARCHIVED" | "NONE"; createdAt: Date; updatedAt: Date; loyaltyPoints: number; wishlist: string[]; } })[] = []
    let error = null

    try {
        posts = await getBlogPosts()
    } catch (e) {
        console.error('Failed to fetch blog posts:', e)
        error = 'Unable to load blog posts at this time.'
    }

    // Determine featured and rest based on successful fetch
    const featured = posts.length > 0 ? posts[0] : null
    const rest = posts.length > 0 ? posts.slice(1) : []

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="border-b border-border bg-gradient-to-b from-white to-cream py-14 sm:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 mb-4">
                                Travel Magazine
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-charcoal mb-5">
                                Explore Marrakech <span className="text-primary">Journal</span>
                            </h1>
                            <p className="text-lg text-medium-gray max-w-2xl mx-auto">
                                Expert guides, hidden gems, and local secrets to help you plan the perfect trip to the Red City.
                            </p>
                        </div>

                        {/* Featured Story */}
                        {featured && (
                            <div className="mt-10 sm:mt-14">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                    <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-border bg-white shadow-sm">
                                        <a href={`/blog/${featured.slug}`} className="block group">
                                            <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                                                <img
                                                    src={featured.coverImage || '/placeholder-blog.jpg'}
                                                    alt={featured.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                                                <div className="absolute bottom-5 left-5 right-5">
                                                    <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm text-charcoal text-xs font-semibold px-3 py-1">
                                                        Featured Story
                                                    </div>
                                                    <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight">
                                                        {featured.title}
                                                    </h2>
                                                    <p className="mt-2 text-white/85 line-clamp-2 max-w-2xl">
                                                        {featured.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>

                                    <div className="lg:col-span-5 rounded-2xl border border-border bg-white shadow-sm p-6 sm:p-8 flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-medium-gray uppercase tracking-wider">Editor’s pick</p>
                                            <h3 className="mt-2 text-2xl font-bold text-charcoal">
                                                Plan your perfect Marrakech trip
                                            </h3>
                                            <p className="mt-3 text-medium-gray">
                                                Discover the best seasons to visit, how to move around the Medina, and the experiences worth booking early.
                                            </p>
                                        </div>
                                        <a
                                            href="/services"
                                            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary text-white font-bold px-6 py-3 shadow-md shadow-primary/20 hover:bg-accent transition-colors"
                                        >
                                            Browse Experiences
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="container mx-auto px-4 py-12 sm:py-16">
                    {rest.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rest.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-semibold text-charcoal">No articles found</h3>
                            <p className="text-medium-gray mt-2">Check back soon for new content!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
