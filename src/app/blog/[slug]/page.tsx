import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ChevronLeft, Calendar, User as UserIcon, Clock, Tag } from 'lucide-react'
import prisma from '@/lib/prisma'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { RelatedActivities } from '@/components/blog/RelatedActivities'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
    params: {
        slug: string
    }
}

async function getPost(slug: string) {
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: true }
    })
    if (!post) return null
    return post
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    try {
        const post = await getPost(params.slug)
        if (!post) {
            return {
                title: 'Article Not Found | Explore Marrakesh',
                description: 'The requested article could not be found.',
            }
        }

        return {
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.excerpt,
            keywords: post.keywords,
            openGraph: {
                title: post.metaTitle || post.title,
                description: post.metaDescription || post.excerpt,
                images: [post.coverImage],
                type: 'article',
                publishedTime: post.publishedAt.toISOString(),
                authors: [post.author?.name || 'Marrakech Expert'],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.metaTitle || post.title,
                description: post.metaDescription || post.excerpt,
                images: [post.coverImage],
            }
        }
    } catch (error) {
        console.error('Error generating metadata for blog post:', error)
        return {
            title: 'Explore Marrakesh Blog',
            description: 'Discover the best of Marrakech with our expert travel guides.',
        }
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    // Await params here (Next.js 15+ requirement, good practice for the future)
    // Actually current Next.js stable might not require it but it's safe.
    // However, params is passed as prop, in Next 13/14 it's object.
    const { slug } = await Promise.resolve(params); // Handle potential future async params

    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    const category = (post as unknown as { category?: string | null }).category
    const plainText = String(post.content || '').replace(/<[^>]*>?/gm, '')
    const words = plainText.trim().split(/\s+/).filter(Boolean).length
    const readingTime = Math.max(1, Math.round(words / 220))

    // JSON-LD Structured Data for Google SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: [post.coverImage],
        datePublished: post.publishedAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: [{
            '@type': 'Person',
            name: post.author?.name || 'Marrakech Expert',
        }],
        description: post.excerpt,
        articleBody: post.content.replace(/<[^>]*>?/gm, '') // Strip HTML for simple body text representation
    }

    return (
        <div className="min-h-screen bg-cream">
            <Header />

            <article className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                {/* Breadcrumb */}
                <Link href="/blog" className="inline-flex items-center text-sm text-medium-gray hover:text-primary mb-8 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Blog
                </Link>

                {/* Header */}
                <header className="mb-8">
                    {category && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-3 py-1 text-xs font-semibold text-charcoal">
                            <Tag className="h-3.5 w-3.5 text-primary" />
                            {category}
                        </div>
                    )}
                    <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-charcoal leading-tight">
                        {post.title}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-medium-gray border-b border-border pb-8">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-charcoal">{post.author?.name || 'Team Explore'}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime} min read</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="relative aspect-[16/9] mb-10 rounded-2xl overflow-hidden shadow-lg border border-border bg-white">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / Left Column (Share) */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <ShareButtons
                                title={post.title}
                                url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://explore-marrakesh.com'}/blog/${post.slug}`}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div
                            className="prose prose-lg prose-slate max-w-none 
                            prose-headings:font-bold prose-headings:text-charcoal 
                            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                            prose-p:text-charcoal/80 prose-p:leading-relaxed prose-p:mb-6
                            prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-orange-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
                            prose-strong:text-charcoal prose-strong:font-bold
                            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                            prose-li:text-charcoal/80 prose-li:mb-2"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Author Bio Card */}
                        <div className="mt-12 p-6 bg-white border border-border rounded-2xl flex items-start gap-4 shadow-sm">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary text-xl font-bold">
                                {post.author?.name?.[0] || 'E'}
                            </div>
                            <div>
                                <h3 className="font-bold text-charcoal text-lg mb-1">Written by {post.author?.name || 'Explore Marrakesh Team'}</h3>
                                <p className="text-medium-gray text-sm leading-relaxed">
                                    Our team of local experts shares the best tips, hidden gems, and cultural insights to help you make the most of your trip to the Red City.
                                </p>
                            </div>
                        </div>

                        {/* Mobile Share */}
                        <div className="lg:hidden mt-8 border-t pt-8">
                            <h4 className="font-bold text-charcoal mb-4">Share this article</h4>
                            <ShareButtons
                                title={post.title}
                                url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://explore-marrakesh.com'}/blog/${post.slug}`}
                            />
                        </div>
                    </div>

                    {/* Right Sidebar (Toc or Ads - Empty for now) */}
                    <div className="lg:col-span-3">
                        {/* Improved Sticky Booking CTA */}
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
                                <div className="bg-primary p-4">
                                    <h3 className="font-bold text-white text-lg">Plan Your Trip</h3>
                                    <p className="text-white/90 text-sm">Experience the real Marrakech</p>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center gap-2 text-sm text-charcoal">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            Certfied Local Guides
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-charcoal">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            Authentic Experiences
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-charcoal">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            Instant Confirmation
                                        </li>
                                    </ul>
                                    <Link href="/services" className="block w-full py-3 px-4 bg-charcoal text-white text-center font-bold rounded-xl hover:bg-primary transition-colors shadow-md">
                                        Browse Experiences
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Activities */}
                <RelatedActivities />
            </article>

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Footer />
        </div>
    )
}
