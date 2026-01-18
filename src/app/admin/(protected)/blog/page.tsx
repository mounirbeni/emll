import { Suspense } from 'react'
import { blogService } from '@/services/blog.service'
import { BlogClient } from './blog-client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
    title: "Blog Management | Admin Panel",
    description: "Manage blog posts and content",
};

export default async function AdminBlogPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/auth/login')
    }

    const { status, category, featured, search } = searchParams

    const posts = await blogService.getAllPosts({
        status: typeof status === 'string' && (status === 'published' || status === 'draft') ? status : undefined,
        category: typeof category === 'string' ? category : undefined,
        featured: typeof featured === 'string' ? featured === 'featured' : undefined,
        search: typeof search === 'string' ? search : undefined,
    })

    return (
        <Suspense fallback={<BlogLoading />}>
            <BlogClient posts={posts} />
        </Suspense>
    )
}

function BlogLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="border rounded-lg">
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
