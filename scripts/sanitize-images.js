
const fs = require('fs');
const path = require('path');

const experiencesPath = path.join(process.cwd(), 'prisma', 'experiences-final.json');
const publicDir = path.join(process.cwd(), 'public');

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

        // Sanitize gallery
        if (exp.gallery && Array.isArray(exp.gallery)) {
            exp.gallery = exp.gallery.map(img => {
                // Remove external links
                if (img.startsWith('http')) {
                    modified = true;
                    return 'IMAGE_PLACEHOLDER_PENDING_UPLOAD';
                }

                // Check if local file exists
                const localPath = path.join(publicDir, img);
                if (!fs.existsSync(localPath)) {
                    console.log(`Missing local file: ${img} -> replacing with placeholder`);
                    modified = true;
                    return 'IMAGE_PLACEHOLDER_PENDING_UPLOAD';
                }

                return img;
            });
        }

        // Sanitize any other potential image fields (none found in inspection but good to be safe)
        // If there were an 'image' field:
        if (exp.image) {
            if (exp.image.startsWith('http') || !fs.existsSync(path.join(publicDir, exp.image))) {
                exp.image = 'IMAGE_PLACEHOLDER_PENDING_UPLOAD';
                modified = true;
            }
        }

        if (modified) updatedCount++;
        return exp;
    });

    fs.writeFileSync(experiencesPath, JSON.stringify(experiences, null, 2));
    console.log(`Sanitization complete. Updated ${updatedCount} experiences.`);
}

sanitizeExperiences();
