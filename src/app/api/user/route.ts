import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("User API Error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await request.json();
        const { name, phone } = body;

        // Basic validation
        if (name && name.length < 2) {
            return new NextResponse('Name too short', { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                phone
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("User Update Error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
