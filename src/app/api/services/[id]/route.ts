import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

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
        const { title, description, price, images, category } = body

        const service = await prisma.service.update({
            where: { id },
            data: {
                title,
                description,
                price: parseFloat(price),
                images,
                category,
            },
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