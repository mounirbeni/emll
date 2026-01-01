import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { serviceService } from '@/services/service.service'
import { createServiceSchema } from '@/lib/validation'
import { AppError, formatErrorResponse } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category') || undefined
        const search = searchParams.get('search') || undefined
        const sortByParam = searchParams.get('sortBy')
        const sortBy = sortByParam && ['price', 'rating', 'reviews', 'newest'].includes(sortByParam)
            ? (sortByParam as 'price' | 'rating' | 'reviews' | 'newest')
            : undefined

        const services = await serviceService.getServices({
            category,
            search,
            sortBy
        })

        return NextResponse.json(services)
    } catch (error) {
        const { statusCode, body } = formatErrorResponse(error)
        return NextResponse.json(body, { status: statusCode })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse body
        const json = await request.json()

        // Validate payload
        const validationResult = createServiceSchema.safeParse(json)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Validation Error',
                    details: validationResult.error.issues
                },
                { status: 422 }
            )
        }

        const data = validationResult.data

        // Call Service
        const service = await serviceService.createService({
            ...data,
            host: data.host || 'Explore Marrakesh' // Default host if not provided
        })

        return NextResponse.json(service, { status: 201 })
    } catch (error) {
        console.error('Create service error:', error)
        const { statusCode, body } = formatErrorResponse(error)
        return NextResponse.json(body, { status: statusCode })
    }
}