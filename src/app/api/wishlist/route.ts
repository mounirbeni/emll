import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/wishlist — return full experience objects in user's wishlist
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { wishlist: true },
        });

        if (!user || user.wishlist.length === 0) {
            return NextResponse.json([]);
        }

        const experiences = await prisma.experience.findMany({
            where: { id: { in: user.wishlist }, enabled: true },
            select: {
                id: true,
                title: true,
                category: true,
                location: true,
                duration: true,
                price: true,
                currency: true,
                shortDescription: true,
                gallery: true,
                avgRating: true,
                reviewCount: true,
                featured: true,
                slug: true,
            },
        });

        return NextResponse.json(experiences);
    } catch (error) {
        console.error('[wishlist GET]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/wishlist  body: { experienceId: string }
// Toggles: adds if not present, removes if already in wishlist
// Returns: { inWishlist: boolean, wishlist: string[] }
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const experienceId: string = body.experienceId;
        if (!experienceId) {
            return NextResponse.json({ error: 'experienceId is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { wishlist: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const already = user.wishlist.includes(experienceId);
        const updatedWishlist = already
            ? user.wishlist.filter((id) => id !== experienceId)
            : [...user.wishlist, experienceId];

        await prisma.user.update({
            where: { id: session.user.id },
            data: { wishlist: updatedWishlist },
        });

        return NextResponse.json({ inWishlist: !already, wishlist: updatedWishlist });
    } catch (error) {
        console.error('[wishlist POST]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
