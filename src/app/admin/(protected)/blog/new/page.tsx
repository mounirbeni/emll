'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { toast } from 'sonner'

export default function NewBlogPostPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [preview, setPreview] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        category: '',
        featured: false,
        metaTitle: '',
        metaDescription: '',
        keywords: [] as string[],
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleTitleChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            title: value,
            slug: prev.slug || generateSlug(value)
        }))
        if (errors.title) setErrors(prev => ({ ...prev, title: '' }))
    }

    const handleSlugChange = (value: string) => {
        setFormData(prev => ({ ...prev, slug: value }))
        if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }))
    }

    const handleKeywordAdd = (keyword: string) => {
        if (keyword.trim() && !formData.keywords.includes(keyword.trim())) {
            setFormData(prev => ({
                ...prev,
                keywords: [...prev.keywords, keyword.trim()]
            }))
        }
    }

    const handleKeywordRemove = (index: number) => {
        setFormData(prev => ({
            ...prev,
            keywords: prev.keywords.filter((_, i) => i !== index)
        }))
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
        if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
        if (!formData.content.trim()) newErrors.content = 'Content is required'
        if (!formData.coverImage.trim()) newErrors.coverImage = 'Cover image is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = async (publish: boolean = false) => {
        if (!validate()) return

        setSaving(true)
        try {
            const payload = {
                ...formData,
                publishedAt: publish ? new Date().toISOString() : null,
            }

            const res = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to create post')
            }

            const post = await res.json()
            toast.success(publish ? 'Post published successfully!' : 'Post saved as draft!')
            router.push('/admin/blog')
        } catch (error: any) {
            console.error('Failed to save post', error)
            toast.error(error.message || 'Failed to save post')
        } finally {
            setSaving(false)
        }
    }

    const handleCloudinaryUpload = async (file: File) => {
        setUploading(true)
        try {
            // Get upload signature from server
            const signRes = await fetch('/api/admin/cloudinary/signature')
            if (!signRes.ok) throw new Error('Failed to get upload signature')
            const { signature, timestamp, apiKey, cloudName, uploadPreset } = await signRes.json()

            const formData = new FormData()
            formData.append('file', file)
            formData.append('api_key', apiKey)
            formData.append('timestamp', timestamp.toString())
            formData.append('signature', signature)
            formData.append('upload_preset', uploadPreset)

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                { method: 'POST', body: formData }
            )

            if (!uploadRes.ok) throw new Error('Upload failed')
            const result = await uploadRes.json()
            setFormData(prev => ({ ...prev, coverImage: result.secure_url }))
            toast.success('Image uploaded successfully!')
        } catch (error: any) {
            console.error('Upload failed', error)
            toast.error(error.message || 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-32" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Posts
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-charcoal">New Blog Post</h1>
                        <p className="text-sm text-medium-gray">Create a new blog article</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPreview(!preview)}
                        className="gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        {preview ? 'Edit' : 'Preview'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Publishing...' : 'Publish'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter post title..."
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            placeholder="post-url-slug"
                            className={errors.slug ? 'border-red-500' : ''}
                        />
                        {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt *</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, excerpt: e.target.value }))
                                if (errors.excerpt) setErrors(prev => ({ ...prev, excerpt: '' }))
                            }}
                            placeholder="Brief description of the post..."
                            rows={3}
                            className={errors.excerpt ? 'border-red-500' : ''}
                        />
                        {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, content: e.target.value }))
                                if (errors.content) setErrors(prev => ({ ...prev, content: '' }))
                            }}
                            placeholder="Write your blog content here (HTML or Markdown supported)..."
                            rows={20}
                            className={errors.content ? 'border-red-500' : ''}
                        />
                        {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <Label>Cover Image *</Label>
                        {formData.coverImage ? (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                                <Image
                                    src={formData.coverImage}
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                                >
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-medium-gray mb-4">
                                    Click to upload or drag and drop
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleCloudinaryUpload(file)
                                    }}
                                    className="hidden"
                                    id="cover-upload"
                                />
                                <label htmlFor="cover-upload">
                                    <Button variant="outline" disabled={uploading} asChild>
                                        <span>
                                            {uploading ? 'Uploading...' : 'Choose File'}
                                        </span>
                                    </Button>
                                </label>
                            </div>
                        )}
                        {errors.coverImage && <p className="text-sm text-red-500">{errors.coverImage}</p>}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Category</CardTitle>
                            <CardDescription>Choose a category for this post</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">No category</SelectItem>
                                    <SelectItem value="Travel Tips">Travel Tips</SelectItem>
                                    <SelectItem value="Culture">Culture</SelectItem>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Guides">Guides</SelectItem>
                                    <SelectItem value="Events">Events</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Featured */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Featured Post</CardTitle>
                            <CardDescription>Mark this post as featured</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Featured</p>
                                    <p className="text-sm text-medium-gray">Show on homepage</p>
                                </div>
                                <Switch
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">SEO</CardTitle>
                            <CardDescription>Search engine optimization</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="metaTitle">Meta Title</Label>
                                <Input
                                    id="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                    placeholder="SEO title (optional)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="metaDescription">Meta Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                    placeholder="SEO description (optional)"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <Label>Keywords</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.keywords.map((keyword, index) => (
                                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleKeywordRemove(index)}>
                                            {keyword} ×
                                        </Badge>
                                    ))}
                                </div>
                                <Input
                                    placeholder="Add keyword and press Enter"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleKeywordAdd((e.target as HTMLInputElement).value)
                                            ;(e.target as HTMLInputElement).value = ''
                                        }
                                    }}
                                    className="mt-2"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
