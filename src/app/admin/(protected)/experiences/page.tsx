import { prisma } from '@/lib/prisma';
import ExperiencesClient from './experiences-client';

export const dynamic = 'force-dynamic';

export default async function AdminExperiencesPage() {
    const experiences = await prisma.experience.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            category: true,
            price: true,
            currency: true,
            duration: true,
            enabled: true,
            featured: true,
            avgRating: true,
            reviewCount: true,
            _count: { select: { bookings: true } },
        },
    });

    return <ExperiencesClient experiences={experiences} />;
}
