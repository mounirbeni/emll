import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email-client';
import { getEmailTemplate } from '@/lib/email-templates';
import { z } from 'zod';
import { requireAdminResponse } from '@/lib/api-guard';

// Schema for promo request
const promoSchema = z.object({
    userIds: z.array(z.string()).min(1),
    promoCode: z.string().min(1),
    discountAmount: z.string().min(1), // e.g. "20%" or "50€"
    expirationDate: z.string().min(1),
});

export async function POST(req: Request) {
    const denied = await requireAdminResponse();
    if (denied) return denied;

    try {
        const body = await req.json();
        const result = promoSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
        }

        const { userIds, promoCode, discountAmount, expirationDate } = result.data;

        // Fetch users
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, email: true, name: true }
        });

        console.info(`Sending promo "${promoCode}" to ${users.length} users...`);

        let sentCount = 0;

        await Promise.all(users.map(async (user) => {
            try {
                const html = await getEmailTemplate('promo', {
                    name: user.name || 'Traveler',
                    promoCode,
                    discountAmount,
                    expirationDate
                } as Record<string, any>);

                await sendEmail({
                    to: user.email,
                    subject: `A Special Gift For You: ${discountAmount} OFF`,
                    html,
                    userId: user.id,
                    type: 'PROMO'
                });
                sentCount++;
            } catch (err) {
                console.error(`Failed to send promo to ${user.email}`, err);
            }
        }));

        return NextResponse.json({ success: true, count: sentCount, total: users.length });
    } catch (error) {
        console.error('Promo error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
