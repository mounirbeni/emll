import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';
import { supportRepository } from '@/repositories/support.repository';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await params;
        const { status } = await request.json();

        if (!status) {
            return errorResponse(new Error('Status is required'), 400);
        }

        const updated = await supportRepository.updateStatus(id, status);
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
        await supportRepository.delete(id);
        return successResponse({ success: true });
    } catch (error) {
        return errorResponse(error);
    }
}

