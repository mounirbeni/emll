'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Eye, Edit, Trash2, Star, Calendar } from 'lucide-react'
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
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    coverImage: string
    publishedAt: string
    category?: string | null
    featured: boolean
    author: {
        name: string
        email: string
    }
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not-featured'>('all')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchQuery) params.set('search', searchQuery)
            if (statusFilter !== 'all') params.set('status', statusFilter === 'published' ? 'published' : 'draft')
            if (categoryFilter !== 'all') params.set('category', categoryFilter)
            if (featuredFilter !== 'all') params.set('featured', featuredFilter === 'featured' ? 'true' : 'false')

            const res = await fetch(`/api/admin/blog?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch posts')
            const data = await res.json()
            setPosts(data.data || [])
        } catch (error) {
            console.error('Failed to fetch posts', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [searchQuery, statusFilter, categoryFilter, featuredFilter])

    const handleDelete = async () => {
        if (!postToDelete) return
        setDeleting(true)
        try {
            const res = await fetch(`/api/admin/blog/${postToDelete}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete post')
            setPosts(posts.filter(p => p.id !== postToDelete))
            setDeleteDialogOpen(false)
            setPostToDelete(null)
        } catch (error) {
            console.error('Failed to delete post', error)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Post</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-12 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
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
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                <Select value={featuredFilter} onValueChange={(value: any) => setFeaturedFilter(value)}>
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
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-charcoal truncate">{post.title}</p>
                                                    {post.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                                </div>
                                                <p className="text-sm text-medium-gray truncate">{post.excerpt}</p>
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
                                            {new Date(post.publishedAt).toLocaleDateString()}
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
