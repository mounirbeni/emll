/**
 * Blog Repository
 * Handles all database operations for blog posts
 */

import prisma from '@/lib/prisma';
import { Prisma, BlogPost } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

export class BlogRepository implements BaseRepository<
    BlogPost,
    Prisma.BlogPostCreateInput,
    Prisma.BlogPostUpdateInput,
    Prisma.BlogPostWhereInput
> {
    /**
     * Create a new blog post
     */
    async create(data: Prisma.BlogPostCreateInput): Promise<BlogPost> {
        return await prisma.blogPost.create({ data });
    }

    /**
     * Find post by ID
     */
    async findById(id: string): Promise<BlogPost | null> {
        return await prisma.blogPost.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });
    }

    /**
     * Find post by Slug
     */
    async findBySlug(slug: string): Promise<BlogPost | null> {
        return await prisma.blogPost.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
    }

    /**
     * Find many posts with options
     */
    async findMany(options?: FindManyOptions<Prisma.BlogPostWhereInput>): Promise<BlogPost[]> {
        const query: Record<string, unknown> = {
            where: options?.where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
            include: options?.include || {
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        };

        if (options?.select) {
            delete query.include; // Select overrides include
            query.select = options.select;
        }

        return await prisma.blogPost.findMany(query as Prisma.BlogPostFindManyArgs);
    }

    /**
     * Update post
     */
    async update(id: string, data: Prisma.BlogPostUpdateInput): Promise<BlogPost> {
        return await prisma.blogPost.update({
            where: { id },
            data
        });
    }

    /**
     * Delete post
     */
    async delete(id: string): Promise<void> {
        await prisma.blogPost.delete({
            where: { id }
        });
    }

    /**
     * Count posts
     */
    async count(where?: Prisma.BlogPostWhereInput): Promise<number> {
        return await prisma.blogPost.count({ where });
    }

    /**
     * Get recent posts
     */
    async findRecent(limit: number = 5): Promise<BlogPost[]> {
        return await prisma.blogPost.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
    }
}

// Export singleton instance
export const blogRepository = new BlogRepository();
