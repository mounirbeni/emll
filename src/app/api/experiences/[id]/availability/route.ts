import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id) return null;
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });
    return user?.role === 'ADMIN' ? session : null;
}

// GET /api/experiences/[id]/availability — returns blocked dates and maxCapacity
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const experience = await prisma.experience.findUnique({
            where: { id },
            select: { blockedDates: true, maxCapacity: true },
        });
        if (!experience) {
            return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
        }
        return NextResponse.json(experience);
    } catch (error) {
        console.error('[availability GET]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/experiences/[id]/availability — admin sets blocked dates and maxCapacity
// body: { blockedDates: string[], maxCapacity?: number }
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAdmin();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const blockedDates: Date[] | undefined = body.blockedDates
            ? (body.blockedDates as string[]).map((d) => new Date(d))
            : undefined;
        const maxCapacity: number | undefined =
            body.maxCapacity !== undefined ? Number(body.maxCapacity) : undefined;

        if (blockedDates === undefined && maxCapacity === undefined) {
            return NextResponse.json({ error: 'Provide blockedDates or maxCapacity' }, { status: 400 });
        }

        const updated = await prisma.experience.update({
            where: { id },
            data: {
                ...(blockedDates !== undefined && { blockedDates }),
                ...(maxCapacity !== undefined && { maxCapacity }),
            },
            select: { blockedDates: true, maxCapacity: true },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[availability PATCH]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
