import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const service = await prisma.service.findUnique({
            where: { id },
        })

        if (!service) {
            return NextResponse.json(
                { error: 'Service not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(service)
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch service' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const data: any = {}

        if (body.title !== undefined) data.title = body.title
        if (body.description !== undefined) data.description = body.description
        if (body.price !== undefined) data.price = parseFloat(body.price)
        if (body.images !== undefined) data.images = body.images
        if (body.category !== undefined) data.category = body.category
        if (body.duration !== undefined) data.duration = body.duration
        if (body.location !== undefined) data.location = body.location
        if (body.latitude !== undefined) data.latitude = body.latitude ? parseFloat(body.latitude) : null
        if (body.longitude !== undefined) data.longitude = body.longitude ? parseFloat(body.longitude) : null
        if (body.features !== undefined) data.features = body.features
        if (body.included !== undefined) data.included = body.included
        if (body.excluded !== undefined) data.excluded = body.excluded
        if (body.whatToBring !== undefined) data.whatToBring = body.whatToBring
        if (body.highlights !== undefined) data.highlights = body.highlights
        if (body.tags !== undefined) data.tags = body.tags
        if (body.itinerary !== undefined) data.itinerary = body.itinerary
        if (body.host !== undefined) data.host = body.host

        const service = await prisma.service.update({
            where: { id },
            data,
        })

        return NextResponse.json(service)
    } catch {
        return NextResponse.json(
            { error: 'Failed to update service' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        await prisma.service.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json(
            { error: 'Failed to delete service' },
            { status: 500 }
        )
    }
}