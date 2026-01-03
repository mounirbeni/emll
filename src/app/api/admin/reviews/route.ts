import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/reviews - list reviews for moderation
export async function GET(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
        const status = searchParams.get('status') as 'PENDING' | 'APPROVED' | 'HIDDEN' | undefined
        const serviceId = searchParams.get('serviceId') || undefined

        const where: any = {}
        if (status) where.status = status
        if (serviceId) where.serviceId = serviceId

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    },
                    service: {
                        select: { id: true, title: true }
                    },
                    booking: {
                        select: { id: true, date: true }
                    }
                }
            }),
            prisma.review.count({ where })
        ])

        return NextResponse.json({
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Failed to fetch reviews', error)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
}

// POST /api/admin/reviews/bulk-action - bulk approve/hide reviews
export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { reviewIds, action } = body

        if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
            return NextResponse.json({ error: 'Invalid review IDs' }, { status: 400 })
        }

        if (!['approve', 'hide', 'delete'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        let updated
        if (action === 'delete') {
            updated = await prisma.review.deleteMany({
                where: { id: { in: reviewIds } }
            })
        } else {
            const status = action === 'approve' ? 'APPROVED' : 'HIDDEN'
            updated = await prisma.review.updateMany({
                where: { id: { in: reviewIds } },
                data: { status }
            })
        }

        // Recalculate service ratings for affected services
        const affectedServices = await prisma.review.findMany({
            where: { id: { in: reviewIds } },
            select: { serviceId: true, id: true }
        })
        const serviceIds = [...new Set(affectedServices.map(r => r.serviceId))]

        for (const serviceId of serviceIds) {
            const approvedStats = await prisma.review.aggregate({
                where: { serviceId, status: 'APPROVED' },
                _avg: { rating: true },
                _count: { rating: true }
            })
            const avgRating = approvedStats._avg.rating || 0
            const reviewCount = approvedStats._count.rating || 0

            await prisma.service.update({
                where: { id: serviceId },
                data: {
                    rating: Math.round(avgRating * 10) / 10,
                    reviews: reviewCount
                }
            })
        }

        return NextResponse.json({ success: true, updatedCount: updated.count })
    } catch (error) {
        console.error('Failed to perform bulk action on reviews', error)
        return NextResponse.json({ error: 'Failed to perform bulk action' }, { status: 500 })
    }
}
