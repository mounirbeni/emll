

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    publishedAt: string;
    readTime: string;
    featured?: boolean;
}
