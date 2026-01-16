import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { safeJsonParse, validateBody } from "@/lib/api-utils";
import { sanitizeEmail } from "@/lib/sanitize";
import { errorResponse, createdResponse } from "@/lib/api-response";

const newsletterSchema = z.object({
    email: z.string().email("Invalid email address")
});

export async function POST(request: NextRequest) {
    try {
        // Safely parse and validate body
        const body = await safeJsonParse(request);
        const { email } = validateBody(newsletterSchema, body);

        // Sanitize email
        const sanitizedEmail = sanitizeEmail(email);

        // Upsert to handle duplicates gracefully
        const subscriber = await prisma.newsletterSubscriber.upsert({
            where: { email: sanitizedEmail },
            update: { active: true },
            create: { email: sanitizedEmail },
        });

        return createdResponse({ success: true, subscriber });
    } catch (error) {
        return errorResponse(error);
    }
}
