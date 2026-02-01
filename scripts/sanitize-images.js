const fs = require('fs');
const path = require('path');

const experiencesPath = path.join(process.cwd(), 'prisma', 'experiences-final.json');
const publicDir = path.join(process.cwd(), 'public');
const PLACEHOLDER = 'IMAGE_PLACEHOLDER_PENDING_UPLOAD';

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    return false;
}

function sanitizeExperiences() {
    if (!fs.existsSync(experiencesPath)) {
        console.error('experiences-final.json not found!');
        return;
    }

    const rawData = fs.readFileSync(experiencesPath, 'utf-8');
    let experiences = JSON.parse(rawData);
    let updatedCount = 0;

    experiences = experiences.map(exp => {
        let modified = false;

        // Expected directory for this experience
        // We will TRY to match existing local files to this structure or check if they exist elsewhere locally
        // But per instructions: "Sanitize and Normalize All Image Paths... Ensure that all image paths follow this format: /images/experiences/[id]/main.jpg"
        // If the folder doesn't exist, use placeholder.

        const expId = exp.id || exp.slug; // Use slug if ID not present, or construct ID? The JSON has 'slug'. The example in prompt used 'id'. DetailedJSON has slugs. 
        // Logic: The prompt said: "Ensure that all image paths follow this format: /images/experiences/[id]/main.jpg"
        // In the JSON inspected, there is no 'id' field, only 'slug'. I will use 'slug' as the identifier for the folder as it mimics the URL structure usually. 
        // If the user meant literal 'id' but only slug exists, I'll stick to slug for now or generate an ID? 
        // Looking at the codebase file `experiences.data.ts`, it has `id: "exp-wellness-001"` etc. But `experiences-final.json` does NOT have `id`.
        // The prompt says: "Example of corrected experience structure: { id: "ct-01" ... }"
        // This implies I might need to ADD ids or use slugs. 
        // Since I'm not supposed to invent data that breaks relations, and `seed.ts` upserts by `slug`, I will use `slug` as the folder name part.

        // Clean Gallery
        if (exp.gallery && Array.isArray(exp.gallery)) {
            const newGallery = exp.gallery.map((img, index) => {
                // If it's already a placeholder, keep it
                if (img === PLACEHOLDER) return img;

                // If it's external, kill it
                if (img.startsWith('http') || img.includes('unsplash') || img.includes('cdn')) {
                    return PLACEHOLDER;
                }

                // It is a local path. Check if it exists.
                // We also need to normalize it to /images/experiences/[slug]/...
                // BUT, checking if the file exists at the CURRENT path is step 1.
                // If it exists at the current path, we might want to MOVE it to the normalized path?
                // The instructions say: "If the folder doesn't exist, do NOT create it — instead use the placeholder text."
                // This implies we aren't moving files around this time, just referencing valid likely-already-normalized paths OR removing them.
                // Wait, "Ensure that all image paths follow this format". 
                // If I have `/images/experiences/sidecar-1.jpg` and the requirement is `/images/experiences/[slug]/main.jpg`...
                // The instruction says "If the folder doesn't exist... use placeholder".
                // So I will check if the normalized path exists. If not, placeholder. 

                // Construct the STRICT normalized path we WANT
                // For gallery, maybe gallery-1.jpg, gallery-2.jpg? 
                // The prompt example just showed "main.jpg" for `image` field. Gallery was separate.

                // Let's just check if the REFERENCED local file exists.
                // If the current path `img` exists, we KEEP it?
                // OR do we enforce the new naming convention strictly?
                // "Sanitize and Normalize All Image Paths... Ensure that all image paths follow this format... If the folder doesn't exist, do NOT create it — instead use the placeholder text."
                // This strongly suggests: Check the Normalized Path. If it exists, use it. If not, Placeholder. 
                // Even if a file exists at `old_path.jpg`, if it isn't at `new_path.jpg`, we might lose it?
                // That seems destructive.
                // However, Step 2 says "Keep local images... /public/...". 
                // Step 4 says "Sanitize and Normalize...".

                // Compromise: I will check the exact path provided in the JSON (if local). 
                // If it exists, I'll allow it but rename it in the JSON? 
                // No, renaming in JSON without renaming the file breaks the link.
                // Renaming the file without moving it?
                // The prompt "If the folder doesn't exist, do NOT create it" implies I shouldn't be creating folders/moving files. 
                // So I will just validate validity of CURRENT local paths. 
                // AND if I can, I'll update the text to match the folder structure IF matches are found.
                // Actually, the prompt is: "Ensure that all image paths follow this format: /images/experiences/[id]/main.jpg. If the folder doesn't exist, do NOT create it — instead use the placeholder text."
                // This sounds like: "Try to find the image at the standardized path. If not found, use placeholder." 
                // This would mean if images are currently loose in `/images/experiences/sidecar-1.jpg`, and I check `/images/experiences/vintage-sidecar-tour/main.jpg` (which doesn't exist), I replace it with placeholder.
                // This results in wiping out all images if they aren't ALREADY organized. 
                // I will assume the user MIGHT have organized them, or wants me to purely look for the standard.
                // BUT, the goal is "Keep ONLY Local Images".
                // I'll implement a check: 
                // 1. Is it a valid local file? 
                // 2. EXCEPT: If it's external, use placeholder.
                // 3. Update the path in JSON to be the existent local path.

                // Wait, "Sanitize and Normalize All Image Paths... Ensure that all image paths follow this format" seems like a requirement for the final state.
                // If I don't move files, I can't satisfy this without breaking images.
                // The prompt says "If the folder doesn't exist, do NOT create it — instead use the placeholder text."
                // This confirms: DO NOT move files or create folders. Just check if the *Standardized Path* has content. If not, placeholder.
                // This effectively means "Turn off all images that aren't already in the correct folder structure."
                // That's a harsh cleanup! But it matches "Remove All External Images...".
                // Okay, I will follow this strict interpretation.

                // EXPECTED path logic:
                // We'll trust the current `img` string if it starts with `/`. 
                // Verify if `public` + `img` exists.
                // If YES -> Keep `img`.
                // If NO -> Placeholder.

                // Additional explicit instruction: "Ensure that all image paths follow this format: /images/experiences/[id]/main.jpg"
                // My interpretation: Update the JSON to point to this path. 
                // THEN check if that path exists. If not, use placeholder.
                // This implies checking `public/images/experiences/[slug]/[filename]`.
                // The gallery filenames aren't specified, but `main.jpg` is for the main image.
                // For gallery, I'll assume `gallery-1.jpg`, `gallery-2.jpg`, etc. or keep original filenames if they are already local and standard.

                // Let's go with the safer "Verify Existent Local" approach first. 

                const absolutePath = path.join(publicDir, img.startsWith('/') ? img.slice(1) : img);
                if (fs.existsSync(absolutePath)) {
                    return img;
                }
                return PLACEHOLDER;
            });

            // Now filter/update
            if (JSON.stringify(newGallery) !== JSON.stringify(exp.gallery)) {
                exp.gallery = newGallery;
                modified = true;
            }
        }

        // Sanitize 'image' field if it exists (some entries might have it, or 'imageConcepts'?)
        // The prompt says "Example ... image: ...". The JSON I read has 'imageConcepts' (text) but 'image' (main image) was not in the 800 lines I read for `experiences-final.json`.
        // `FeaturedExperiences.tsx` used a mock data with `image`.
        // `experiences.data.ts` (TS file) has `gallery` but no `image`.
        // `ExperienceCard` uses `gallery[0]` as main image.
        // So `image` field might be synthetic or non-existent in the JSON. 
        // If I see it, I'll sanitize it.

        if (exp.image) {
            const img = exp.image;
            if (img.startsWith('http') || img.includes('cdn')) {
                exp.image = PLACEHOLDER;
                modified = true;
            } else {
                const absolutePath = path.join(publicDir, img.startsWith('/') ? img.slice(1) : img);
                if (!fs.existsSync(absolutePath)) {
                    exp.image = PLACEHOLDER;
                    modified = true;
                }
            }
        } else {
            // "Ensure that all image paths follow this format: /images/experiences/[id]/main.jpg"
            // Maybe I should ADD an `image` field if it's missing, pointing to the strict path?
            // "Add placeholder if no image exists"
            // So if `exp.image` is undefined, I should set it? 
            // The prompt example shows `image: ...`.
            // I will set `exp.image` to `/images/experiences/${exp.slug}/main.jpg`.
            // Check existence. If not -> placeholder.

            const standardPath = `/images/experiences/${exp.slug}/main.jpg`;
            const absoluteStandardPath = path.join(publicDir, 'images/experiences', exp.slug, 'main.jpg');

            if (fs.existsSync(absoluteStandardPath)) {
                exp.image = standardPath;
            } else {
                exp.image = PLACEHOLDER;
            }
            modified = true;
        }

        if (modified) updatedCount++;
        return exp;
    });

    fs.writeFileSync(experiencesPath, JSON.stringify(experiences, null, 2));
    console.log(`Sanitization complete. Updated ${updatedCount} experiences.`);
}

sanitizeExperiences();
