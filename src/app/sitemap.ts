import { MetadataRoute } from 'next'
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://emll.vercel.app'

    // Static Routes
    const staticRoutes = [
        '',
        '/blog',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    let blogRoutes: MetadataRoute.Sitemap = []

    try {
        // Dynamic Blog Posts
        const posts = await prisma.blogPost.findMany({
            select: {
                slug: true,
                updatedAt: true,
            },
        });

        // Check if posts exist


        blogRoutes = posts.map((post: { slug: string; updatedAt: Date }) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    } catch (error) {
        console.error('[SITEMAP] Failed to fetch dynamic sitemap data:', error)
    }

    return [...staticRoutes, ...blogRoutes]
}
