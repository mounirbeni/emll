/**
 * Conversation Repository
 * Handles all database operations for conversations
 */

import prisma from '@/lib/prisma';
import { Conversation, ConversationStatus, Prisma } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

export class ConversationRepository implements BaseRepository<
    Conversation,
    Prisma.ConversationCreateInput,
    Prisma.ConversationUpdateInput,
    Prisma.ConversationWhereInput
> {
    /**
     * Create a new conversation
     */
    async create(data: Prisma.ConversationCreateInput): Promise<Conversation> {
        return await prisma.conversation.create({ data });
    }

    /**
     * Find conversation by ID
     */
    async findById(id: string): Promise<Conversation | null> {
        return await prisma.conversation.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Find many conversations with options
     */
    async findMany(options?: FindManyOptions<Prisma.ConversationWhereInput>): Promise<Conversation[]> {
        const query: Record<string, unknown> = {
            where: options?.where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { updatedAt: 'desc' },
        };

        if (options?.include) {
            query.include = options.include;
        } else if (options?.select) {
            query.select = options.select;
        }

        return await prisma.conversation.findMany(query as Prisma.ConversationFindManyArgs);
    }

    /**
     * Find conversations by user ID
     */
    async findByUserId(userId: string): Promise<Conversation[]> {
        return await prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1 // Get last message for preview
                }
            }
        });
    }

    /**
     * Find conversations by status
     */
    async findByStatus(status: ConversationStatus): Promise<Conversation[]> {
        return await prisma.conversation.findMany({
            where: { status },
            orderBy: { updatedAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
    }

    /**
     * Find open conversations
     */
    async findOpen(): Promise<Conversation[]> {
        return await this.findByStatus(ConversationStatus.OPEN);
    }

    /**
     * Find conversations with unread messages
     */
    async findWithUnreadMessages(userId?: string): Promise<Conversation[]> {
        return await prisma.conversation.findMany({
            where: {
                ...(userId && { userId }),
                messages: {
                    some: {
                        read: false,
                        sender: 'ADMIN' // Unread messages from admin
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                messages: {
                    where: { read: false },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    /**
     * Update conversation
     */
    async update(id: string, data: Prisma.ConversationUpdateInput): Promise<Conversation> {
        return await prisma.conversation.update({
            where: { id },
            data
        });
    }

    /**
     * Update conversation status
     */
    async updateStatus(id: string, status: ConversationStatus): Promise<Conversation> {
        return await prisma.conversation.update({
            where: { id },
            data: { status }
        });
    }

    /**
     * Close conversation
     */
    async close(id: string): Promise<Conversation> {
        return await this.updateStatus(id, ConversationStatus.CLOSED);
    }

    /**
     * Archive conversation
     */
    async archive(id: string): Promise<Conversation> {
        return await this.updateStatus(id, ConversationStatus.ARCHIVED);
    }

    /**
     * Reopen conversation
     */
    async reopen(id: string): Promise<Conversation> {
        return await this.updateStatus(id, ConversationStatus.OPEN);
    }

    /**
     * Delete conversation
     */
    async delete(id: string): Promise<void> {
        await prisma.conversation.delete({
            where: { id }
        });
    }

    /**
     * Count conversations
     */
    async count(where?: Prisma.ConversationWhereInput): Promise<number> {
        return await prisma.conversation.count({ where });
    }

    /**
     * Check if conversation exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.conversation.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Get conversation count by status
     */
    async countByStatus(status: ConversationStatus): Promise<number> {
        return await prisma.conversation.count({
            where: { status }
        });
    }

    /**
     * Find recent conversations
     */
    async findRecent(limit: number = 10): Promise<Conversation[]> {
        return await prisma.conversation.findMany({
            take: limit,
            orderBy: { updatedAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
    }
}

// Export singleton instance
export const conversationRepository = new ConversationRepository();
