import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { user: null, authenticated: false },
                { status: 200 }
            );
        }

        return NextResponse.json({
            user: session.user,
            authenticated: true,
            expiresAt: (session as any).expiresAt,
        });
    } catch (error) {
        console.error("Session endpoint error:", error);
        return NextResponse.json(
            { error: "Failed to fetch session" },
            { status: 500 }
        );
    }
}
