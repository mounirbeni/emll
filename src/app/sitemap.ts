import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

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

    // Dynamic Blog Posts
    // Cast to any to avoid IDE caching issues; tsc validates this correctly
    const posts = await (prisma as any).blogPost.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    })

    const blogRoutes = posts.map((post: { slug: string; updatedAt: Date }) => ({
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

    const serviceRoutes = services.map((service) => ({
        url: `${baseUrl}/experiences/${service.id}`,
        lastModified: service.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    return [...staticRoutes, ...blogRoutes, ...serviceRoutes]
}
