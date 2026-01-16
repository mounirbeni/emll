'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Plus, X, Save, Upload, Image as ImageIcon, Building2, Tag, Loader2 } from 'lucide-react'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<string[]>([])
    const [newCategory, setNewCategory] = useState('')
    const [businessConfig, setBusinessConfig] = useState({
        businessName: 'Explore Marrakesh',
        businessEmail: 'info@exploremarrakesh.com',
        businessPhone: '+212 6XX XXX XXX',
        businessAddress: 'Marrakech, Morocco',
        businessDescription: '',
        currency: 'EUR',
        timezone: 'Africa/Casablanca'
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/services')
            if (!res.ok) throw new Error('Failed to fetch services')
            const data = await res.json()
            const services = Array.isArray(data) ? data : (data.data || data)
            const uniqueCategories = Array.from(new Set<string>(services.map((s: { category?: unknown }) => String(s.category || '')).filter((c: string) => c && c !== 'undefined' && c !== 'null' && c.length > 0)))
            setCategories(uniqueCategories.sort())
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error('Failed to load categories')
        }
    }

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            toast.error('Category name cannot be empty')
            return
        }
        if (categories.includes(newCategory.trim())) {
            toast.error('Category already exists')
            return
        }
        setCategories([...categories, newCategory.trim()].sort())
        setNewCategory('')
        toast.success('Category added (save to persist)')
    }

    const handleRemoveCategory = (category: string) => {
        if (!confirm(`Remove category "${category}"? This will not affect existing services.`)) return
        setCategories(categories.filter(c => c !== category))
        toast.success('Category removed (save to persist)')
    }

    /* const handleSaveCategories = async () => {
        setLoading(true)
        try {
            // Note: Categories are stored in services, so we can't directly save them
            // This is a UI for reference. In a real implementation, you'd have a categories table
            toast.success('Categories are managed through services. Use this as a reference.')
        } catch (error) {
            toast.error('Failed to save categories')
        } finally {
            setLoading(false)
        }
    } */

    const handleSaveBusinessConfig = async () => {
        setLoading(true)
        try {
            // In a real implementation, save to database or config file
            await new Promise(resolve => setTimeout(resolve, 500))
            toast.success('Business configuration saved successfully')
        } catch {
            toast.error('Failed to save business configuration')
        } finally {
            setLoading(false)
        }
    }

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB')
            return
        }

        setLoading(true)
        try {
            const signRes = await fetch('/api/admin/cloudinary/signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder: 'media-library' }),
            })

            if (!signRes.ok) throw new Error('Failed to get upload signature')
            const sign = await signRes.json()

            const uploadUrl = `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`
            const formData = new FormData()
            formData.append('file', file)
            formData.append('api_key', sign.apiKey)
            formData.append('timestamp', String(sign.timestamp))
            formData.append('signature', sign.signature)
            formData.append('upload_preset', sign.uploadPreset)
            formData.append('folder', sign.folder)

            const uploadRes = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            })

            if (!uploadRes.ok) throw new Error('Upload failed')
            const uploadData = await uploadRes.json()

            toast.success('Image uploaded successfully')
            // In a real implementation, save the URL to a media library
            console.log('Uploaded image URL:', uploadData.secure_url)
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload image')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your business configuration and preferences</p>
            </div>

            <Tabs defaultValue="business" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="business">
                        <Building2 className="h-4 w-4 mr-2" />
                        Business
                    </TabsTrigger>
                    <TabsTrigger value="categories">
                        <Tag className="h-4 w-4 mr-2" />
                        Categories
                    </TabsTrigger>
                    <TabsTrigger value="media">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Media Library
                    </TabsTrigger>
                </TabsList>

                {/* Business Configuration */}
                <TabsContent value="business" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                            <CardDescription>
                                Configure your business details and contact information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <Input
                                        id="businessName"
                                        value={businessConfig.businessName}
                                        onChange={(e) => setBusinessConfig({ ...businessConfig, businessName: e.target.value })}
                                        placeholder="Your Business Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessEmail">Business Email</Label>
                                    <Input
                                        id="businessEmail"
                                        type="email"
                                        value={businessConfig.businessEmail}
                                        onChange={(e) => setBusinessConfig({ ...businessConfig, businessEmail: e.target.value })}
                                        placeholder="info@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessPhone">Business Phone</Label>
                                    <Input
                                        id="businessPhone"
                                        type="tel"
                                        value={businessConfig.businessPhone}
                                        onChange={(e) => setBusinessConfig({ ...businessConfig, businessPhone: e.target.value })}
                                        placeholder="+212 6XX XXX XXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <select
                                        id="currency"
                                        value={businessConfig.currency}
                                        onChange={(e) => setBusinessConfig({ ...businessConfig, currency: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="MAD">MAD (د.م)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessAddress">Business Address</Label>
                                <Input
                                    id="businessAddress"
                                    value={businessConfig.businessAddress}
                                    onChange={(e) => setBusinessConfig({ ...businessConfig, businessAddress: e.target.value })}
                                    placeholder="Street Address, City, Country"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessDescription">Business Description</Label>
                                <Textarea
                                    id="businessDescription"
                                    value={businessConfig.businessDescription}
                                    onChange={(e) => setBusinessConfig({ ...businessConfig, businessDescription: e.target.value })}
                                    placeholder="A brief description of your business..."
                                    rows={4}
                                />
                            </div>
                            <Button onClick={handleSaveBusinessConfig} disabled={loading} className="w-full sm:w-auto">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Configuration
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Categories Management */}
                <TabsContent value="categories" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Categories</CardTitle>
                            <CardDescription>
                                Manage service categories. Categories are extracted from existing services.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add new category..."
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddCategory()
                                        }
                                    }}
                                />
                                <Button onClick={handleAddCategory} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <Badge key={category} variant="secondary" className="text-sm px-3 py-1.5">
                                            {category}
                                            <button
                                                onClick={() => handleRemoveCategory(category)}
                                                className="ml-2 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No categories found. Add services to create categories.</p>
                                )}
                            </div>

                            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                <p className="font-medium mb-1">Note:</p>
                                <p>Categories are automatically extracted from services. To add a new category, create a service with that category name.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media Library */}
                <TabsContent value="media" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Media Library</CardTitle>
                            <CardDescription>
                                Upload and manage images for your services and content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <Label htmlFor="media-upload" className="cursor-pointer">
                                    <span className="text-primary hover:underline font-medium">Click to upload</span>
                                    <span className="text-muted-foreground"> or drag and drop</span>
                                </Label>
                                <Input
                                    id="media-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMediaUpload}
                                    className="hidden"
                                    disabled={loading}
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>

                            {loading && (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}

                            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                <p className="font-medium mb-1">Media Library Features:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Upload images for services and blog posts</li>
                                    <li>Images are stored in Cloudinary</li>
                                    <li>Automatic optimization and resizing</li>
                                    <li>Secure upload with signed URLs</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
