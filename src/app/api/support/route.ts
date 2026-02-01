import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateShortId, ShortIdPrefix } from '@/lib/id-generator';
import { createSupportRequestSchema } from '@/lib/validation';
import { safeJsonParse, validateBody } from '@/lib/api-utils';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import { errorResponse, createdResponse } from '@/lib/api-response';
import { adminNotificationService } from '@/services/admin-notification.service';

export async function POST(request: NextRequest) {
    try {
        // Safely parse and validate body
        const body = await safeJsonParse(request);
        const data = validateBody(createSupportRequestSchema, body);

        // Sanitize inputs
        const supportRequest = await prisma.supportRequest.create({
            data: {
                shortId: generateShortId(ShortIdPrefix.SUPPORT),
                name: sanitizeString(data.name),
                email: sanitizeEmail(data.email),
                phone: data.phone ? sanitizePhone(data.phone) : null,
                subject: sanitizeString(data.subject),
                message: sanitizeString(data.message),
                status: 'PENDING'
            }
        });

        // Create admin notification for new message
        await adminNotificationService.notifyNewMessage(
            data.name,
            data.subject,
            supportRequest.id
        ).catch(e => console.error("Failed to create admin notification:", e));

        return createdResponse({ success: true, request: supportRequest });

    } catch (error) {
        return errorResponse(error);
    }
}
