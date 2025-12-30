/**
 * Conversation Service
 * Contains business logic for messaging/conversations
 */

import { Conversation } from '@prisma/client';
import { conversationRepository } from '@/repositories/conversation.repository';
import { messageRepository } from '@/repositories/message.repository';
import { BadRequestError } from '@/lib/errors';

export interface CreateConversationDTO {
    userId: string;
    subject: string;
    message: string;
}

export class ConversationService {
    /**
     * Get all conversations for a user
     */
    async getUserConversations(userId: string) {
        return await conversationRepository.findByUserId(userId);
    }

    /**
     * Create a new conversation with initial message and auto-reply
     */
    async createConversation(data: CreateConversationDTO): Promise<Conversation> {
        if (!data.subject || !data.message) {
            throw new BadRequestError('Subject and message are required');
        }

        // Create conversation
        const conversation = await conversationRepository.create({
            user: { connect: { id: data.userId } },
            subject: data.subject,
            status: 'OPEN'
        });

        // Create initial message
        await messageRepository.create({
            conversation: { connect: { id: conversation.id } },
            user: { connect: { id: data.userId } },
            content: data.message,
            sender: 'USER',
            read: false
        });

        // Send auto-reply
        await messageRepository.create({
            conversation: { connect: { id: conversation.id } },
            user: { connect: { id: data.userId } },
            content: "Thank you for submitting your support ticket. We've received your request and will respond as soon as possible. Feel free to add any additional information below.",
            sender: 'ADMIN',
            read: true
        });

        return conversation;
    }
}

export const conversationService = new ConversationService();
