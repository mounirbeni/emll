import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse, createdResponse } from '@/lib/api-response';
import { serviceService } from '@/services/service.service';
import { createServiceSchema } from '@/lib/validation';
import { getQueryParam, sanitizeSearchQuery } from '@/lib/sanitize';
import { safeJsonParse, validateBody } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        // Require admin authentication
        await requireAdmin();

        const category = getQueryParam(request, 'category');
        const searchRaw = getQueryParam(request, 'search');
        const search = searchRaw ? sanitizeSearchQuery(searchRaw) : undefined;

        const services = await serviceService.getServices({
            category: category || undefined,
            search
        });

        return successResponse(services);
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        // Require admin authentication
        await requireAdmin();

        // Safely parse and validate body
        const body = await safeJsonParse(request);
        const data = validateBody(createServiceSchema, body);

        const service = await serviceService.createService({
            ...data,
            host: data.host || 'Explore Marrakesh'
        });

        return createdResponse(service);
    } catch (error) {
        return errorResponse(error);
    }
}
