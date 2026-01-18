import { BlogPostEditor } from '@/components/admin/BlogPostEditor'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata = {
    title: "New Blog Post | Admin Panel",
    description: "Create a new blog article",
};

export default async function NewBlogPostPage() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/auth/login')
    }

    return <BlogPostEditor isNew={true} />
}
