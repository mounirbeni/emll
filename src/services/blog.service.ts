/**
 * Blog Service
 * Contains all business logic for blog operations
 */

import { BlogPost } from '@prisma/client';
import { blogRepository } from '@/repositories/blog.repository';
import { NotFoundError, BadRequestError } from '@/lib/errors';

export interface CreateBlogPostDTO {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category?: string;
    featured?: boolean;
    publishedAt?: Date;
    authorId: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
}

export interface UpdateBlogPostDTO {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    category?: string;
    featured?: boolean;
    publishedAt?: Date;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
}

export class BlogService {
    /**
     * Create a new blog post
     */
    async createPost(data: CreateBlogPostDTO): Promise<BlogPost> {
        // Check for duplicate slug
        const existing = await blogRepository.findBySlug(data.slug);
        if (existing) {
            throw new BadRequestError('Slug already exists');
        }

        return await blogRepository.create({
            title: data.title,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt,
            coverImage: data.coverImage,
            category: data.category,
            featured: data.featured || false,
            publishedAt: data.publishedAt || new Date(),
            author: { connect: { id: data.authorId } },
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            keywords: data.keywords || []
        });
    }

    /**
     * Get all posts
     */
    async getAllPosts(params?: {
        status?: 'published' | 'draft' | 'all',
        category?: string,
        featured?: boolean,
        search?: string
    }): Promise<BlogPost[]> {
        const where: any = {};

        if (params?.status === 'published') {
            where.publishedAt = { not: null, lte: new Date() };
        } else if (params?.status === 'draft') {
            where.OR = [
                { publishedAt: null },
                { publishedAt: { gt: new Date() } }
            ];
        }

        if (params?.category && params.category !== 'all') {
            where.category = params.category;
        }

        if (params?.featured !== undefined) {
            where.featured = params.featured;
        }

        if (params?.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { content: { contains: params.search, mode: 'insensitive' } },
            ];
        }

        return await blogRepository.findMany({
            where,
            orderBy: { publishedAt: 'desc' }
        });
    }

    /**
     * Get post by ID
     */
    async getPostById(id: string): Promise<BlogPost> {
        const post = await blogRepository.findById(id);
        if (!post) {
            throw new NotFoundError('Blog post', id);
        }
        return post;
    }

    /**
     * Get post by Slug
     */
    async getPostBySlug(slug: string): Promise<BlogPost> {
        const post = await blogRepository.findBySlug(slug);
        if (!post) {
            throw new NotFoundError('Blog post', slug);
        }
        return post;
    }

    /**
     * Update post
     */
    async updatePost(id: string, data: UpdateBlogPostDTO): Promise<BlogPost> {
        const post = await blogRepository.findById(id);
        if (!post) {
            throw new NotFoundError('Blog post', id);
        }

        if (data.slug && data.slug !== post.slug) {
            const existing = await blogRepository.findBySlug(data.slug);
            if (existing) {
                throw new BadRequestError('Slug already exists');
            }
        }

        return await blogRepository.update(id, {
            ...data
        });
    }

    /**
     * Delete post
     */
    async deletePost(id: string): Promise<void> {
        const exists = await blogRepository.findById(id);
        if (!exists) {
            throw new NotFoundError('Blog post', id);
        }
        await blogRepository.delete(id);
    }
}

// Export singleton instance
export const blogService = new BlogService();
