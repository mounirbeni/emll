import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const service = await prisma.service.findUnique({
            where: { id }
        });

        if (!service) {
            return errorResponse(new Error('Service not found'), 404);
        }

        // Service already has native arrays, no parsing needed
        return successResponse(service);
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await request.json();

        // Prepare data for update, only updating what's present
        // Note: Prisma uses native arrays, not JSON strings
        const data: any = {};
        if (body.title !== undefined) data.title = body.title;
        if (body.description !== undefined) data.description = body.description;
        if (body.price !== undefined) data.price = parseFloat(body.price);
        if (body.category !== undefined) data.category = body.category;
        if (body.duration !== undefined) data.duration = body.duration;
        if (body.location !== undefined) data.location = body.location;
        if (body.latitude !== undefined) data.latitude = body.latitude ? parseFloat(body.latitude) : null;
        if (body.longitude !== undefined) data.longitude = body.longitude ? parseFloat(body.longitude) : null;
        if (body.images !== undefined) data.images = body.images; // Native array
        if (body.features !== undefined) data.features = body.features; // Native array
        if (body.included !== undefined) data.included = body.included; // Native array
        if (body.whatToBring !== undefined) data.whatToBring = body.whatToBring; // Native array
        if (body.tags !== undefined) data.tags = body.tags; // Native array
        if (body.itinerary !== undefined) data.itinerary = body.itinerary; // JSON type
        if (body.host !== undefined) data.host = body.host;

        const updated = await prisma.service.update({
            where: { id },
            data
        });

        return successResponse(updated);
    } catch (error) {
        return errorResponse(error);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await params;
        await prisma.service.delete({
            where: { id }
        });

        return successResponse({ success: true });
    } catch (error) {
        return errorResponse(error);
    }
}
