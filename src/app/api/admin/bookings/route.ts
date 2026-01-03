import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/authorization'
import { errorResponse, successResponse, noContentResponse } from '@/lib/api-response'
import { BadRequestError } from '@/lib/errors'

export async function GET() {
    try {
        // Require admin authentication
        await requireAdmin()

        const bookings = await prisma.booking.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return successResponse(bookings)
    } catch (error) {
        return errorResponse(error)
    }
}

export async function PATCH(request: Request) {
    try {
        // Require admin authentication
        await requireAdmin()

        const body = await request.json()
        const { id, status } = body

        if (!id || !status) {
            throw new BadRequestError('Booking ID and status are required')
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: { status }
        })

        return successResponse(booking)
    } catch (error) {
        return errorResponse(error)
    }
}

export async function DELETE(request: Request) {
    try {
        // Require admin authentication
        await requireAdmin()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            throw new BadRequestError('Booking ID is required')
        }

        await prisma.booking.delete({
            where: { id }
        })

        return noContentResponse()
    } catch (error) {
        return errorResponse(error)
    }
}
