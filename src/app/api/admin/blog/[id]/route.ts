import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/authorization'
import { errorResponse, successResponse } from '@/lib/api-response'
import { NotFoundError, BadRequestError, ConflictError } from '@/lib/errors'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog/[id] - get a single blog post
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin()

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
            throw new NotFoundError('Blog post not found')
        }

        return successResponse(post)
    } catch (error) {
        return errorResponse(error)
    }
}

// PUT /api/admin/blog/[id] - update a blog post
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin()

        const { id } = await params
        const body = await request.json()
        const { title, slug, content, excerpt, coverImage, category, featured, metaTitle, metaDescription, keywords } = body

        if (!title || !slug || !content || !excerpt || !coverImage) {
            throw new BadRequestError('Missing required fields')
        }

        // Ensure slug is unique (excluding current post)
        const existing = await prisma.blogPost.findFirst({ where: { slug, NOT: { id } } })
        if (existing) {
            throw new ConflictError('Slug already exists')
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

        return successResponse(post)
    } catch (error) {
        return errorResponse(error)
    }
}

// DELETE /api/admin/blog/[id] - delete a blog post
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await requireAdmin()

        const { id } = await params

        await prisma.blogPost.delete({ where: { id } })

        return successResponse({ success: true })
    } catch (error) {
        return errorResponse(error)
    }
}
