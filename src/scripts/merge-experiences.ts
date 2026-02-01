// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { experiences } from '../prisma/experiences-data';

// Helper to slugify consistent with seed.ts
function generateSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function merge() {
    const rewrittenPath = path.join(__dirname, '../prisma/experiences-rewritten.json');
    const finalPath = path.join(__dirname, '../prisma/experiences-final.json');

    const rewrittenRaw = fs.readFileSync(rewrittenPath, 'utf-8');
    const rewrittenExperiences = JSON.parse(rewrittenRaw);

    const merged = [];
    const missing = [];

    console.log(`Loading ${experiences.length} original experiences.`);
    console.log(`Loading ${rewrittenExperiences.length} rewritten experiences.`);

    for (const newExp of rewrittenExperiences) {
        let match = experiences.find(e => generateSlug(e.title) === newExp.id);

        if (!match) {
            match = experiences.find(e => e.title.toLowerCase() === newExp.title.toLowerCase());
        }

        if (!match) {
            match = experiences.find(e => {
                const s = generateSlug(e.title);
                return s.includes(newExp.id) || newExp.id.includes(s);
            });
        }

        if (match) {
            console.log(`✅ Matched: "${newExp.title}" with "${match.title}"`);

            const mergedExp = {
                ...match,
                title: newExp.title,
                id: undefined,

                slug: newExp.id,
                shortDescription: newExp.summary,
                fullDescription: newExp.description,
                highlights: newExp.highlights,
                itinerary: newExp.itinerary,
                included: newExp.included,
                notIncluded: newExp.notIncluded,
                meetingPoint: newExp.meetingPoint,
                importantInfo: newExp.importantInfo,
                faqs: newExp.faqs,
                relatedExperiences: newExp.relatedExperiences,
                imageConcepts: newExp.imageConcepts,
            };

            merged.push(mergedExp);
        } else {
            console.warn(`WARNING: NO MATCH FOUND FOR: "${newExp.title}" (ID: ${newExp.id})`);
            missing.push(newExp);
        }
    }

    if (merged.length === rewrittenExperiences.length) {
        console.log('SUCCESS: All rewritten experiences were matched.');
    } else {
        console.log(`WARNING: Only ${merged.length} of ${rewrittenExperiences.length} matched.`);
    }

    fs.writeFileSync(finalPath, JSON.stringify(merged, null, 2));
    console.log(`Saved merged data to ${finalPath}`);
}

merge();
