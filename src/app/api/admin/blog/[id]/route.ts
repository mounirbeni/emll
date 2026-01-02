import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog/[id] - get a single blog post
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const post = await prisma.blogPost.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        if (!post) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error('Failed to fetch blog post', error)
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
    }
}

// PUT /api/admin/blog/[id] - update a blog post
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { title, slug, content, excerpt, coverImage, category, featured, metaTitle, metaDescription, keywords } = body

        if (!title || !slug || !content || !excerpt || !coverImage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Ensure slug is unique (excluding current post)
        const existing = await prisma.blogPost.findFirst({ where: { slug, NOT: { id } } })
        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
        }

        const post = await prisma.blogPost.update({
            where: { id },
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
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error('Failed to update blog post', error)
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
    }
}

// DELETE /api/admin/blog/[id] - delete a blog post
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await prisma.blogPost.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete blog post', error)
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
    }
}
