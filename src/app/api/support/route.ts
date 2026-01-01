import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateShortId, ShortIdPrefix } from '@/lib/id-generator';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { subject, message, name, email, phone } = body;

        if (!subject || !message || !name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supportRequest = await prisma.supportRequest.create({
            data: {
                shortId: generateShortId(ShortIdPrefix.SUPPORT),
                name,
                email,
                phone: phone || null,
                subject,
                message,
                status: 'PENDING'
            }
        });

        return NextResponse.json({ success: true, request: supportRequest });

    } catch (error) {
        console.error('Support request creation error:', error);
        return NextResponse.json({ error: 'Failed to submit support request' }, { status: 500 });
    }
}
