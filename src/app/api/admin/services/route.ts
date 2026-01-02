import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse, createdResponse } from '@/lib/api-response';
import { serviceService } from '@/services/service.service';

export async function GET(request: Request) {
    try {
        // Require admin authentication
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const services = await serviceService.getServices({
            category: category || undefined
        });

        return successResponse(services);
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: Request) {
    try {
        // Require admin authentication
        await requireAdmin();

        const body = await request.json();

        const serviceData = {
            title: body.title,
            description: body.description,
            price: parseFloat(body.price),
            category: body.category,
            duration: body.duration,
            location: body.location,
            latitude: body.latitude ? parseFloat(body.latitude) : undefined,
            longitude: body.longitude ? parseFloat(body.longitude) : undefined,
            images: body.images || [],
            features: body.features || [],
            included: body.included || [],
            excluded: body.excluded || [],
            whatToBring: body.whatToBring || [],
            highlights: body.highlights || [],
            tags: body.tags || [],
            itinerary: body.itinerary || [],
            host: body.host || 'Explore Marrakesh'
        };

        const service = await serviceService.createService(serviceData);

        return createdResponse(service);
    } catch (error) {
        return errorResponse(error);
    }
}
