import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { serviceService } from '@/services/service.service'
import { createServiceSchema } from '@/lib/validation'
import { errorResponse, createdResponse, successResponse } from '@/lib/api-response'
import { getQueryParam, getQueryParamNumber, sanitizeSearchQuery } from '@/lib/sanitize'
import { safeJsonParse, validateBody } from '@/lib/api-utils'
import { ForbiddenError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        // Sanitize and validate query parameters
        const category = getQueryParam(request, 'category') || undefined
        const searchRaw = getQueryParam(request, 'search')
        const search = searchRaw ? sanitizeSearchQuery(searchRaw) : undefined
        
        const sortByParam = getQueryParam(request, 'sortBy')
        const sortBy = sortByParam && ['price', 'rating', 'reviews', 'newest'].includes(sortByParam)
            ? (sortByParam as 'price' | 'rating' | 'reviews' | 'newest')
            : undefined
        
        const sortOrderParam = getQueryParam(request, 'sortOrder')
        const sortOrder = sortOrderParam === 'asc' || sortOrderParam === 'desc' 
            ? (sortOrderParam as 'asc' | 'desc')
            : undefined
        
        const minPrice = getQueryParamNumber(request, 'minPrice', undefined, 0)
        const maxPrice = getQueryParamNumber(request, 'maxPrice', undefined, 0)

        const services = await serviceService.getServices({
            category,
            search,
            sortBy,
            sortOrder,
            minPrice: minPrice > 0 ? minPrice : undefined,
            maxPrice: maxPrice > 0 ? maxPrice : undefined
        })

        return successResponse(services)
    } catch (error) {
        return errorResponse(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new ForbiddenError('Unauthorized')
        }
        
        // Only admins can create services
        if (session.user.role !== 'ADMIN') {
            throw new ForbiddenError('Admin access required')
        }

        // Safely parse and validate body
        const body = await safeJsonParse(request)
        const data = validateBody(createServiceSchema, body)

        // Call Service
        const service = await serviceService.createService({
            ...data,
            host: data.host || 'Explore Marrakesh' // Default host if not provided
        })

        return createdResponse(service)
    } catch (error) {
        return errorResponse(error)
    }
}