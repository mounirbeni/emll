import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { conversationService } from '@/services/conversation.service';
import { errorResponse, successResponse } from '@/lib/api-response';

// Get all conversations for the logged-in user
export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const conversations = await conversationService.getUserConversations(session.user.id);
        return successResponse(conversations);
    } catch (error) {
        return errorResponse(error);
    }
}

// Create a new conversation
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { subject, content } = await request.json();

        // Service handles validation and creation
        const conversation = await conversationService.createConversation({
            userId: session.user.id,
            subject,
            message: content
        });

        return successResponse(conversation);
    } catch (error) {
        return errorResponse(error);
    }
}
