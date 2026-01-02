import { ServiceEditor } from '@/components/admin/ServiceEditor';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Service } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (id === 'new') {
        return <ServiceEditor isNew />;
    }

    const service = await prisma.service.findUnique({
        where: { id }
    });

    if (!service) {
        notFound();
    }

    // Map Prisma Service to Admin Service Type
    const parsedService: Service = {
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        category: service.category,
        duration: service.duration,
        location: service.location,

        // Native arrays don't need parsing
        images: (service.images as unknown as string[]) || [],
        features: (service.features as unknown as string[]) || [],
        included: (service.included as unknown as string[]) || [],
        excluded: ((service as unknown as { excluded?: unknown }).excluded as unknown as string[]) || [],
        whatToBring: (service.whatToBring as unknown as string[]) || [],
        highlights: ((service as unknown as { highlights?: unknown }).highlights as unknown as string[]) || [],
        tags: (service.tags as unknown as string[]) || [],

        // Complex Objects
        itinerary: Array.isArray(service.itinerary)
            ? (service.itinerary as unknown as Service['itinerary'])
            : [],
        // host: service.host ? JSON.parse(service.host) : undefined, // Host not in Admin Type yet?

        // Optionals
        // latitude: service.latitude ?? undefined,
        // longitude: service.longitude ?? undefined,

        // Mapped fields
        // Mapped fields
        // reviews field is not present in the Prisma model; omit it
        rating: service.rating,

        // Dates (not strictly in Service interface shown step 305? Wait, lines 63 has createdAt for User, but Service lines 20-42 doesn't show createdAt/updatedAt?)
        // Let's check Step 305 lines 20-42.
        // It DOES NOT have createdAt/updatedAt in Service interface!
        // So I should OMIT them or Add them to type.
        // Assuming Editor doesn't need them.
    };

    return <ServiceEditor initialData={parsedService} />;
}
