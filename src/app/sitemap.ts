import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://emll.vercel.app'

    // Static Routes
    const staticRoutes = [
        '',
        '/blog',
        '/services', // or /experiences if that's the main listing
        '/search',
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
        // Cast to any to avoid IDE caching issues; tsc validates this correctly
        const posts = await (prisma as any).blogPost.findMany({
            select: {
                slug: true,
                updatedAt: true,
            },
        })

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

        serviceRoutes = services.map((service) => ({
            url: `${baseUrl}/experiences/${service.id}`,
            lastModified: service.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))
    } catch (error) {
        console.error('Failed to fetch dynamic sitemap data:', error)
        // Check if we are in a build environment where DB might be unreachable
        // We gracefully return just the static routes so the build doesn't fail
    }

    return [...staticRoutes, ...blogRoutes, ...serviceRoutes]
}
