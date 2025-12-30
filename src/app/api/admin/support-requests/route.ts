import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';
import { supportRepository } from '@/repositories/support.repository';

export async function GET(request: Request) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const requests = await supportRepository.findMany({
            where: status && status !== 'ALL' ? { status } : undefined,
            orderBy: { createdAt: 'desc' }
        });

        return successResponse(requests);
    } catch (error) {
        return errorResponse(error);
    }
}

