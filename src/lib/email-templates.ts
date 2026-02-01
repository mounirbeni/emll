import fs from 'fs';
import path from 'path';

type TemplateName =
    | 'welcome'
    | 'booking-received'
    | 'booking-confirmed'
    | 'booking-rejected'
    | 'booking-modified'
    | 'booking-reminder'
    | 'announcement'
    | 'promo';

export async function getEmailTemplate(templateName: TemplateName, data: Record<string, string | number | boolean | null | undefined>) {
    try {
        const templatePath = path.join(process.cwd(), 'src', 'emails', 'templates', `${templateName}.html`);
        let html = await fs.promises.readFile(templatePath, 'utf8');

        // Add common data
        const commonData = {
            appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            year: new Date().getFullYear().toString(),
            ...data
        };

        // Replace {{key}} with value
        Object.keys(commonData).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            html = html.replace(regex, String((commonData as any)[key]));
        });

        // Handle simple conditionals like {{#if ctaLink}}...{{/if}}
        // This is a basic regex implementation for boolean checks only checking existence/truthiness
        html = html.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (_match, key, content) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value = (commonData as any)[key];
            return value ? content : '';
        });

        // Also remove any remaining conditionals that weren't true
        // (This simple regex might need refinement if nested, but for these templates it's likely fine)

        return html;
    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
        return `
      <h1>System Notification</h1>
      <p>This is a fallback email because the template '${templateName}' could not be loaded.</p>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    }
}
