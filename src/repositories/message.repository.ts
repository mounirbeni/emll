/**
 * Message Repository
 * Handles all database operations for messages
 */

import prisma from '@/lib/prisma';
import { Message, Prisma } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

export class MessageRepository implements BaseRepository<
    Message,
    Prisma.MessageCreateInput,
    Prisma.MessageUpdateInput,
    Prisma.MessageWhereInput
> {
    /**
     * Create a new message
     */
    async create(data: Prisma.MessageCreateInput): Promise<Message> {
        return await prisma.message.create({ data });
    }

    /**
     * Find message by ID
     */
    async findById(id: string): Promise<Message | null> {
        return await prisma.message.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                conversation: {
                    select: {
                        id: true,
                        subject: true,
                    }
                }
            }
        });
    }

    /**
     * Find many messages with options
     */
    async findMany(options?: FindManyOptions<Prisma.MessageWhereInput>): Promise<Message[]> {
        const query: Record<string, unknown> = {
            where: options?.where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { createdAt: 'asc' },
        };

        if (options?.include) {
            query.include = options.include;
        } else if (options?.select) {
            query.select = options.select;
        }

        return await prisma.message.findMany(query as Prisma.MessageFindManyArgs);
    }

    /**
     * Find messages by conversation ID
     */
    async findByConversationId(conversationId: string): Promise<Message[]> {
        return await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
    }

    /**
     * Find unread messages in a conversation
     */
    async findUnreadByConversation(conversationId: string): Promise<Message[]> {
        return await prisma.message.findMany({
            where: {
                conversationId,
                read: false
            },
            orderBy: { createdAt: 'asc' }
        });
    }

    /**
     * Find unread messages for a user
     */
    async findUnreadByUser(userId: string): Promise<Message[]> {
        return await prisma.message.findMany({
            where: {
                userId,
                read: false
            },
            orderBy: { createdAt: 'desc' },
            include: {
                conversation: {
                    select: {
                        id: true,
                        subject: true,
                    }
                }
            }
        });
    }

    /**
     * Get unread message count for a conversation
     */
    async getUnreadCount(conversationId: string): Promise<number> {
        return await prisma.message.count({
            where: {
                conversationId,
                read: false
            }
        });
    }

    /**
     * Get unread message count for a user
     */
    async getUnreadCountByUser(userId: string): Promise<number> {
        return await prisma.message.count({
            where: {
                userId,
                read: false
            }
        });
    }

    /**
     * Mark message as read
     */
    async markAsRead(id: string): Promise<Message> {
        return await prisma.message.update({
            where: { id },
            data: { read: true }
        });
    }

    /**
     * Mark all messages in conversation as read
     */
    async markAllAsReadInConversation(conversationId: string): Promise<number> {
        const result = await prisma.message.updateMany({
            where: {
                conversationId,
                read: false
            },
            data: { read: true }
        });
        return result.count;
    }

    /**
     * Mark multiple messages as read
     */
    async markManyAsRead(ids: string[]): Promise<number> {
        const result = await prisma.message.updateMany({
            where: {
                id: { in: ids }
            },
            data: { read: true }
        });
        return result.count;
    }

    /**
     * Update message
     */
    async update(id: string, data: Prisma.MessageUpdateInput): Promise<Message> {
        return await prisma.message.update({
            where: { id },
            data
        });
    }

    /**
     * Delete message
     */
    async delete(id: string): Promise<void> {
        await prisma.message.delete({
            where: { id }
        });
    }

    /**
     * Delete all messages in a conversation
     */
    async deleteByConversation(conversationId: string): Promise<number> {
        const result = await prisma.message.deleteMany({
            where: { conversationId }
        });
        return result.count;
    }

    /**
     * Count messages
     */
    async count(where?: Prisma.MessageWhereInput): Promise<number> {
        return await prisma.message.count({ where });
    }

    /**
     * Check if message exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.message.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Get latest message in conversation
     */
    async getLatestInConversation(conversationId: string): Promise<Message | null> {
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'desc' },
            take: 1
        });
        return messages[0] || null;
    }

    /**
     * Find messages by sender
     */
    async findBySender(conversationId: string, sender: string): Promise<Message[]> {
        return await prisma.message.findMany({
            where: {
                conversationId,
                sender
            },
            orderBy: { createdAt: 'asc' }
        });
    }
}

// Export singleton instance
export const messageRepository = new MessageRepository();
