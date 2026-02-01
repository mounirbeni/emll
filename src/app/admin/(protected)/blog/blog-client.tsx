"use client"

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Plus, Search, Edit, Trash2, Star, Calendar, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { toast } from 'sonner'
import { deleteBlogPost } from '@/app/actions/admin-actions'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage: string
    publishedAt: Date | null
    category?: string | null
    featured: boolean
    author: {
        name: string | null
        email: string | null
    }
}

interface BlogClientProps {
    posts: BlogPost[]
}

export function BlogClient({ posts }: BlogClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // State for local inputs (before syncing to URL)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    // Sync other filters directly
    const statusFilter = searchParams.get('status') || 'all'
    const categoryFilter = searchParams.get('category') || 'all'
    const featuredFilter = searchParams.get('featured') || 'all'

    const updateFilters = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        router.push(`${pathname}?${params.toString()}`)
    }, [pathname, router, searchParams])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters({ search: searchQuery })
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, updateFilters])

    const handleDelete = async () => {
        if (!postToDelete) return
        setDeleting(true)
        try {
            const result = await deleteBlogPost(postToDelete)
            if (result.success) {
                toast.success('Post deleted successfully')
                setDeleteDialogOpen(false)
                setPostToDelete(null)
            } else {
                toast.error(result.error || 'Failed to delete post')
            }
        } catch (error) {
            console.error(error)
            toast.error('An error occurred')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Blog Posts</h1>
                    <p className="text-sm text-medium-gray">Manage your blog content and articles</p>
                </div>
                <Link href="/admin/blog/new">
                    <Button className="rounded-full gap-2">
                        <Plus className="h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value) => updateFilters({ status: value })}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={(value) => updateFilters({ category: value })}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Travel Tips">Travel Tips</SelectItem>
                        <SelectItem value="Culture">Culture</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Guides">Guides</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={featuredFilter} onValueChange={(value) => updateFilters({ featured: value })}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="not-featured">Not Featured</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Posts Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Post</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-medium-gray">
                                    No blog posts found
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                {post.coverImage && (
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-charcoal truncate max-w-[200px]" title={post.title}>{post.title}</p>
                                                    {post.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                                </div>
                                                <p className="text-sm text-medium-gray truncate max-w-[250px]">{post.excerpt}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm font-medium text-charcoal">{post.author.name}</p>
                                            <p className="text-xs text-medium-gray">{post.author.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {post.category ? (
                                            <Badge variant="outline">{post.category}</Badge>
                                        ) : (
                                            <span className="text-xs text-medium-gray">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-medium-gray">
                                            <Calendar className="h-3 w-3" />
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/blog/${post.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setPostToDelete(post.id)
                                                    setDeleteDialogOpen(true)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Blog Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this blog post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
