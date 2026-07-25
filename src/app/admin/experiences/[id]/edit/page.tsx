import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../../experience-form";

export const metadata = {
    title: "Edit Experience",
};

export default async function EditExperiencePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) notFound();

    return (
        <ExperienceForm
            initial={{
                id: experience.id,
                title: experience.title,
                category: experience.category,
                location: experience.location,
                duration: experience.duration,
                price: experience.price,
                currency: experience.currency,
                shortDescription: experience.shortDescription,
                fullDescription: experience.fullDescription,
                meetingPoint: experience.meetingPoint,
                highlights: experience.highlights.join("\n"),
                included: experience.included.join("\n"),
                notIncluded: experience.notIncluded.join("\n"),
                pickupAvailable: experience.pickupAvailable,
                featured: experience.featured,
                enabled: experience.enabled,
            }}
        />
    );
}
