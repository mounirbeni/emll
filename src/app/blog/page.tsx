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

export default async function BlogPage() {
    const posts = await getBlogPosts()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="bg-white border-b py-16 sm:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-[#FF5F00] text-sm font-medium mb-4">
                            Travel Magazine
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                            Explore Marrakesh <span className="text-[#FF5F00]">Blog</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Expert guides, hidden gems, and local secrets to help you plan the perfect trip to the Red City.
                        </p>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="container mx-auto px-4 py-16">
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-semibold text-gray-900">No articles found</h3>
                            <p className="text-gray-500 mt-2">Check back soon for new content!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
