// import { NextResponse } from 'next/server' // unused
import prisma from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'
import { successResponse, errorResponse } from '@/lib/api-response'
import { BadRequestError, NotFoundError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

/**
 * GET: Check booking availability for a specific service and date/time
 * Query params: serviceId, date (ISO string)
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const serviceId = searchParams.get('serviceId')
        const dateParam = searchParams.get('date')

        if (!serviceId || !dateParam) {
            return errorResponse(new BadRequestError('serviceId and date are required'))
        }

        const requestedDate = new Date(dateParam)
        if (isNaN(requestedDate.getTime())) {
            return errorResponse(new BadRequestError('Invalid date format'))
        }

        // Check if service exists
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        })

        if (!service) {
            return errorResponse(new NotFoundError('Service not found'))
        }

        // Check for existing bookings at the same time (within 30 minutes window)
        // This prevents double bookings for the same time slot
        const timeWindowStart = new Date(requestedDate)
        timeWindowStart.setMinutes(timeWindowStart.getMinutes() - 30)

        const timeWindowEnd = new Date(requestedDate)
        timeWindowEnd.setMinutes(timeWindowEnd.getMinutes() + 30)

        const conflictingBookings = await prisma.booking.findMany({
            where: {
                activityId: serviceId,
                date: {
                    gte: timeWindowStart,
                    lte: timeWindowEnd
                },
                status: {
                    in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
                }
            }
        })

        const isAvailable = conflictingBookings.length === 0

        return successResponse({
            available: isAvailable,
            conflictingBookings: conflictingBookings.length,
            requestedDate: requestedDate.toISOString()
        })
    } catch (error) {
        return errorResponse(error)
    }
}
