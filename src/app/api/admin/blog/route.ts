import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog - list all blog posts
export async function GET(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
        const status = searchParams.get('status') || undefined
        const category = searchParams.get('category') || undefined
        const featured = searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined

        const where: any = {}
        if (status) where.publishedAt = status === 'published' ? { not: null } : null
        if (category) where.category = { contains: category, mode: 'insensitive' }
        if (typeof featured === 'boolean') where.featured = featured

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                orderBy: { publishedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    author: {
                        select: { id: true, name: true, email: true }
                    }
                }
            }),
            prisma.blogPost.count({ where })
        ])

        return NextResponse.json({
            data: posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Failed to fetch blog posts', error)
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
    }
}

// POST /api/admin/blog - create a new blog post
export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, slug, content, excerpt, coverImage, category, featured, metaTitle, metaDescription, keywords } = body

        if (!title || !slug || !content || !excerpt || !coverImage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Ensure slug is unique
        const existing = await prisma.blogPost.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                coverImage,
                category: category || null,
                featured: Boolean(featured),
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                keywords: Array.isArray(keywords) ? keywords : [],
                authorId: session.user.id as string
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Failed to create blog post', error)
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
    }
}
