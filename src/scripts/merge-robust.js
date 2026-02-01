
const fs = require('fs');
const path = require('path');

// Helper to slugify consistent with seed.ts
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function parseTsFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove imports
    content = content.replace(/import .*?;/g, '');
    // Remove export const ... =
    content = content.replace(/export const \w+\s*(:\s*\w+(\[\])?)?\s*=\s*/, 'module.exports = ');
    // Remove type annotations key: type (naive, assuming no complex types inside objects)
    // Actually, the main issue is the first line. Inside objects it's standard JS key: value.
    // There shouldn't be type annotations inside the object values in this data file.

    // Create a temporary module to load this
    const tempPath = filePath.replace('.ts', '.temp.js');
    try {
        fs.writeFileSync(tempPath, content);
        const data = require(tempPath);
        fs.unlinkSync(tempPath);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error(`Failed to parse ${filePath}:`, e.message);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return [];
    }
}

async function merge() {
    const experiencesDir = path.join(__dirname, '../prisma/experiences');
    const files = fs.readdirSync(experiencesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts');

    let allOldExps = [];
    console.log('Parsing original TS files...');

    for (const file of files) {
        const data = parseTsFile(path.join(experiencesDir, file));
        console.log(`Loaded ${data.length} from ${file}`);
        allOldExps = allOldExps.concat(data);
    }

    console.log(`Total original experiences: ${allOldExps.length}`);

    const rewrittenPath = path.join(__dirname, '../prisma/experiences-rewritten.json');
    const finalPath = path.join(__dirname, '../prisma/experiences-final.json');

    const rewrittenRaw = fs.readFileSync(rewrittenPath, 'utf-8');
    const rewrittenExperiences = JSON.parse(rewrittenRaw);

    const merged = [];
    const missing = [];

    for (const newExp of rewrittenExperiences) {
        let match = allOldExps.find(e => generateSlug(e.title) === newExp.id);

        if (!match) {
            match = allOldExps.find(e => e.title.toLowerCase() === newExp.title.toLowerCase());
        }

        if (!match) {
            match = allOldExps.find(e => {
                const s = generateSlug(e.title);
                return s.includes(newExp.id) || newExp.id.includes(s);
            });
        }

        if (match) {
            console.log(`✅ Matched (ID/Title): "${newExp.title}"`);
        } else {
            // Fuzzy match
            match = allOldExps.find(e => {
                const t1 = e.title.toLowerCase().split(/[^\w]+/).filter(w => w.length > 3);
                const t2 = newExp.title.toLowerCase().split(/[^\w]+/).filter(w => w.length > 3);
                const s1 = new Set(t1);
                let intersection = 0;
                for (const w of t2) {
                    if (s1.has(w)) intersection++;
                }
                // Require at least 2 common significant words, or 1 if it's very unique (but 2 is safer)
                // Also handle short titles.
                return intersection >= 2;
            });
            if (match) console.log(`✅ Matched (Fuzzy): "${newExp.title}" -> "${match.title}"`);
        }

        if (match) {
            const mergedExp = {
                ...match,
                title: newExp.title,
                id: undefined, // ensure no ID conflict if mapped

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
            // @ts-ignore
            mergedExp.slug = newExp.id;
            merged.push(mergedExp);
        } else {
            console.warn(`WARNING: NO MATCH FOUND FOR: "${newExp.title}" (ID: ${newExp.id})`);
            missing.push(newExp);
        }
    }

    if (merged.length === rewrittenExperiences.length) {
        console.log('SUCCESS: All rewritten experiences were matched and merged.');
    } else {
        console.log(`WARNING: Only ${merged.length} of ${rewrittenExperiences.length} matched.`);
    }

    fs.writeFileSync(finalPath, JSON.stringify(merged, null, 2));
    console.log(`Saved merged data to ${finalPath}`);
}

merge();
