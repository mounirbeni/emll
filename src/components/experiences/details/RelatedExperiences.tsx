import { prisma } from '@/lib/prisma';
import ExperienceCard from '../ExperienceCard';

interface RelatedExperiencesProps {
    currentId: string;
    category: string;
}

export default async function RelatedExperiences({ currentId, category }: RelatedExperiencesProps) {
    // Fetch 3 related experiences
    const related = await prisma.experience.findMany({
        where: {
            category: category,
            id: { not: currentId },
            enabled: true
        },
        take: 3,
        orderBy: { popularity: 'desc' }
    });

    // Fallback if not enough related in category (fetch popular ones)
    let experienceList = related;
    if (experienceList.length < 3) {
        const extra = await prisma.experience.findMany({
            where: {
                id: { notIn: [currentId, ...related.map(e => e.id)] },
                enabled: true
            },
            take: 3 - experienceList.length,
            orderBy: { popularity: 'desc' }
        });
        experienceList = [...experienceList, ...extra];
    }

    if (experienceList.length === 0) return null;

    return (
        <section className="mt-12 border-t border-gray-100 pt-12">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">You may also like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {experienceList.map(experience => (
                    <ExperienceCard key={experience.id} experience={experience as any} />
                ))}
            </div>
        </section>
    );
}
