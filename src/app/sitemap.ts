import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://emll.vercel.app'

    // Static Routes
    const staticRoutes = [
        '',
        '/blog',
        '/experiences',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    let blogRoutes: MetadataRoute.Sitemap = []
    let serviceRoutes: MetadataRoute.Sitemap = []

    try {
        // Dynamic Blog Posts
        const posts = await prisma.blogPost.findMany({
            select: {
                slug: true,
                updatedAt: true,
            },
        });

        console.log(`[SITEMAP] Found ${posts.length} blog posts`)

        blogRoutes = posts.map((post: { slug: string; updatedAt: Date }) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        // Dynamic Services / Activities
        const services = await prisma.service.findMany({
            select: {
                id: true,
                updatedAt: true,
            },
        })

        console.log(`[SITEMAP] Found ${services.length} services`)

        serviceRoutes = services.map((service) => ({
            url: `${baseUrl}/experiences/${service.id}`,
            lastModified: service.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))
    } catch (error) {
        console.error('[SITEMAP] Failed to fetch dynamic sitemap data:', error)
        // Check if we are in a build environment where DB might be unreachable
        // We gracefully return just the static routes so the build doesn't fail
    }

    return [...staticRoutes, ...blogRoutes, ...serviceRoutes]
}
