import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { generateShortId, ShortIdPrefix } from '@/lib/id-generator';
import { createSupportRequestSchema } from '@/lib/validation';
import { safeJsonParse, validateBody } from '@/lib/api-utils';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import { errorResponse, successResponse, createdResponse } from '@/lib/api-response';

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

        return createdResponse({ success: true, request: supportRequest });

    } catch (error) {
        return errorResponse(error);
    }
}
