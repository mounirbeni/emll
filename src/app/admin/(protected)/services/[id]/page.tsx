import { ServiceEditor } from '@/components/admin/ServiceEditor';
import { notFound } from 'next/navigation';
import { serviceService } from "@/services/service.service";
import { Service } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
    // Note: In Next.js 15 params is a Promise, usually in 14 it's an object. 
    // Adapting to standard 14 usage unless strict 15. The user environment seems 14ish?
    // I'll assume standard access. If it breaks I'll fix.

    // Check if new (legacy route handling or user mistake)
    if (params.id === 'new') {
        return <ServiceEditor isNew />;
    }

    const service = await serviceService.getServiceById(params.id);

    if (!service) {
        notFound();
    }

    // Map Prisma Service to Admin Service Type
    // Note: The Service type in service.service.ts returns Prisma Service.
    // The Admin Service type might expect string[] for JSON fields if they are stored as JSON in DB 
    // or native arrays if using Postgres/Mongo arrays.
    // Prisma schema showed `images String[]`, `features String[]`, etc.
    // So simple casting or passing is fine for arrays.
    // But `itinerary` is `Json` type in Prisma often? 
    // Let's assume serviceService returns it correctly typed or as Json.
    // Admin Generic Service type usually expects specific structure.

    // Safe casting helper
    const toArray = (val: any) => Array.isArray(val) ? val : [];

    const parsedService: Service = {
        id: service.id,
        title: service.title,
        description: service.description,
        price: Number(service.price),
        category: service.category,
        duration: service.duration,
        location: service.location,

        images: toArray(service.images),
        features: toArray(service.features),
        included: toArray(service.included),
        excluded: toArray(service.excluded), // Cast if needed
        whatToBring: toArray(service.whatToBring),
        highlights: toArray((service as any).highlights), // Optional in some schemas
        tags: toArray(service.tags),

        itinerary: Array.isArray(service.itinerary) ? service.itinerary : [],

        rating: service.rating,
        reviews: 0, // Placeholder

        // Host might be missing in DB, default it
        host: (service as any).host || undefined,

        latitude: (service as any).latitude || undefined,
        longitude: (service as any).longitude || undefined
    };

    return <ServiceEditor initialData={parsedService} />;
}
