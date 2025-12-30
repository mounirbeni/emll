import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();

    if (session?.user) {
        return NextResponse.json({
            authenticated: true,
            user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role
            }
        });
    }

    return NextResponse.json({
        authenticated: false,
        user: null
    });
}
