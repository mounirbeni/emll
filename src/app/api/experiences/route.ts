import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const duration = searchParams.get('duration');
        const q = searchParams.get('q'); // Search query
        const featured = searchParams.get('featured');

        const where: Prisma.ExperienceWhereInput = {};

        // Category filter
        if (category && category !== 'All' && category !== 'all') {
            where.category = {
                equals: category,
                mode: 'insensitive',
            };
        }

        // Price filter
        const priceFilter: any = {};
        if (minPrice) {
            priceFilter.gte = parseFloat(minPrice) || 0;
        }
        if (maxPrice) {
            priceFilter.lte = parseFloat(maxPrice) || 10000;
        }
        if (Object.keys(priceFilter).length > 0) {
            where.price = priceFilter;
        }

        // Duration filter
        if (duration) {
            where.duration = { contains: duration, mode: 'insensitive' };
        }

        // Search query
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { shortDescription: { contains: q, mode: 'insensitive' } },
                { fullDescription: { contains: q, mode: 'insensitive' } },
                // Note: Prisma doesn't support insensitive array contains easily for 'highlights' without raw queries or specific settings, skipping for now to be safe
            ];
        }

        // Featured filter
        if (featured === 'true') {
            where.featured = true;
        }

        // Ensure enabled (unless looking for specific status, but usually public API returns enabled only)
        where.enabled = true;

        const experiences = await prisma.experience.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(experiences);
    } catch (error) {
        console.error('Error fetching experiences:', error);
        return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.price || !body.category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate slug from title if not provided
        let slug = body.slug;
        if (!slug) {
            slug = body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        // Ensure unique slug (simple check)
        const existing = await prisma.experience.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const experience = await prisma.experience.create({
            data: {
                ...body,
                slug,
                enabled: true, // Default to enabled
                highlights: body.highlights || [],
                included: body.included || [],
                notIncluded: body.notIncluded || [],
                gallery: body.gallery || [],
                faqs: body.faqs || [],
            },
        });

        return NextResponse.json(experience, { status: 201 });
    } catch (error) {
        console.error('Error creating experience:', error);
        return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
    }
}
