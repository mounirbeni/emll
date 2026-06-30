import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ExperienceEditForm from './experience-edit-form';

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) notFound();

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Experience</h1>
                <p className="text-muted-foreground text-sm">Update the details for &ldquo;{experience.title}&rdquo;</p>
            </div>
            <ExperienceEditForm experience={experience as any} />
        </div>
    );
}
