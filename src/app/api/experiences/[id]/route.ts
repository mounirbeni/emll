import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminResponse } from '@/lib/api-guard';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const experience = await prisma.experience.findUnique({
            where: { id },
        });

        if (!experience) {
            // Try finding by slug if ID not found (flexible routing)
            const experienceBySlug = await prisma.experience.findUnique({
                where: { slug: id },
            });
            if (experienceBySlug) {
                return NextResponse.json(experienceBySlug);
            }
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }

        return NextResponse.json(experience);
    } catch (error) {
        console.error('Error fetching experience:', error);
        return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    try {
        const { id } = await params;
        const body = await request.json();

        const experience = await prisma.experience.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(experience);
    } catch (error) {
        console.error('Error updating experience:', error);
        return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    try {
        const { id } = await params;
        await prisma.experience.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Experience deleted' });
    } catch (error) {
        console.error('Error deleting experience:', error);
        return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
    }
}
