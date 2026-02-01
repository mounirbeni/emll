const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const dbUrl = 'postgresql://neondb_owner:npg_TDZQvK2glVO4@ep-small-pine-ah90shfm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Note: Removed &channel_binding=require as it can sometimes cause issues with Prisma + Node versions if not fully supported, 
// and sslmode=require is usually sufficient for Neon.
// If it fails, we can add it back.

let content = '';
try {
    content = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.log('.env file not found, creating new one.');
}

const lines = content.split('\n');
let found = false;
const newLines = lines.map(line => {
    if (line.startsWith('DATABASE_URL=')) {
        found = true;
        return `DATABASE_URL="${dbUrl}"`;
    }
    return line;
});

if (!found) {
    newLines.push(`DATABASE_URL="${dbUrl}"`);
}

// Add other missing keys if needed
if (!content.includes('GOOGLE_CLIENT_ID=')) newLines.push('GOOGLE_CLIENT_ID=""');
if (!content.includes('GOOGLE_CLIENT_SECRET=')) newLines.push('GOOGLE_CLIENT_SECRET=""');
if (!content.includes('AUTH_SECRET=')) newLines.push('AUTH_SECRET=""');

fs.writeFileSync(envPath, newLines.join('\n'));
console.log('Updated .env with correct DATABASE_URL');
