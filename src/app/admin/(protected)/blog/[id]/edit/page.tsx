import { BlogPostEditor } from '@/components/admin/BlogPostEditor'
import { blogService } from '@/services/blog.service'
import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'

interface EditBlogPostPageProps {
    params: {
        id: string
    }
}

export const metadata = {
    title: "Edit Blog Post | Admin Panel",
};

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/auth/login')
    }

    const post = await blogService.getPostById(params.id)

    if (!post) {
        notFound()
    }

    return <BlogPostEditor isNew={false} post={post} />
}
