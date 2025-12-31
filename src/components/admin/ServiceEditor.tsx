'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, ArrowLeft, Image as ImageIcon, List } from 'lucide-react';
import { Service } from '@/types/admin';
import Link from 'next/link';

interface ServiceEditorProps {
    initialData?: Service | null;
    isNew?: boolean;
}

export function ServiceEditor({ initialData, isNew = false }: ServiceEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Service>>({
        title: '',
        description: '',
        price: 0,
        category: '',
        duration: '',
        location: '',
        images: [],
        features: [],
        included: [],
        whatToBring: [],
        tags: [],
        itinerary: [], // TODO: Complex itinerary builder later
        ...initialData
    });

    const [tagInput, setTagInput] = useState('');
    const [imageInput, setImageInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isNew ? '/api/admin/services' : `/api/admin/services/${initialData?.id}`;
            const method = isNew ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save');

            router.push('/admin/services');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    const handleArrayInput = (field: keyof Service, value: string, action: 'add' | 'remove', index?: number) => {
        const currentArray = (formData[field] as string[]) || [];
        if (action === 'add') {
            if (value.trim()) {
                setFormData({ ...formData, [field]: [...currentArray, value.trim()] });
            }
        } else if (action === 'remove' && typeof index === 'number') {
            setFormData({ ...formData, [field]: currentArray.filter((_, i) => i !== index) });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/services">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isNew ? 'Create Service' : 'Edit Service'}
                        </h2>
                        <p className="text-muted-foreground">
                            {isNew ? 'Add a new experience.' : `Editing ${initialData?.title}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/services">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description (Markdown)</Label>
                                <Textarea
                                    id="description"
                                    className="min-h-[200px] font-mono"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gallery</CardTitle>
                            <CardDescription>Add image URLs for the slider.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://..."
                                    value={imageInput}
                                    onChange={e => setImageInput(e.target.value)}
                                />
                                <Button type="button" onClick={() => {
                                    handleArrayInput('images', imageInput, 'add');
                                    setImageInput('');
                                }}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {(formData.images || []).map((img, i) => (
                                    <div key={i} className="relative aspect-video group rounded-md overflow-hidden bg-muted border">
                                        <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button type="button" variant="destructive" size="icon" onClick={() => handleArrayInput('images', '', 'remove', i)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details & Lists</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ArrayInput
                                label="Included"
                                items={formData.included || []}
                                onAdd={val => handleArrayInput('included', val, 'add')}
                                onRemove={idx => handleArrayInput('included', '', 'remove', idx)}
                            />
                            <ArrayInput
                                label="Features"
                                items={formData.features || []}
                                onAdd={val => handleArrayInput('features', val, 'add')}
                                onRemove={idx => handleArrayInput('features', '', 'remove', idx)}
                            />
                            <ArrayInput
                                label="What To Bring"
                                items={formData.whatToBring || []}
                                onAdd={val => handleArrayInput('whatToBring', val, 'add')}
                                onRemove={idx => handleArrayInput('whatToBring', '', 'remove', idx)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    placeholder="e.g. 4 Hours"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. Marrakech Medina"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2">
                                    <span>📍 Map Pinning</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label htmlFor="latitude" className="text-xs text-muted-foreground">Latitude</Label>
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="0.000001"
                                            placeholder="31.6295"
                                            value={formData.latitude || ''}
                                            onChange={e => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="longitude" className="text-xs text-muted-foreground">Longitude</Label>
                                        <Input
                                            id="longitude"
                                            type="number"
                                            step="0.000001"
                                            placeholder="-7.9811"
                                            value={formData.longitude || ''}
                                            onChange={e => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                                        />
                                    </div>
                                </div>
                                {formData.latitude && formData.longitude && (
                                    <a
                                        href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        View on Google Maps →
                                    </a>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label>Smart Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add tag..."
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleArrayInput('tags', tagInput, 'add');
                                                setTagInput('');
                                            }
                                        }}
                                    />
                                    <Button type="button" size="icon" onClick={() => {
                                        handleArrayInput('tags', tagInput, 'add');
                                        setTagInput('');
                                    }}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(formData.tags || []).map((tag, i) => (
                                        <Badge key={i} variant="secondary">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleArrayInput('tags', '', 'remove', i)}
                                                className="ml-2 hover:text-destructive"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}

function ArrayInput({ label, items, onAdd, onRemove }: {
    label: string,
    items: string[],
    onAdd: (val: string) => void,
    onRemove: (idx: number) => void
}) {
    const [val, setVal] = useState('');
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Input value={val} onChange={e => setVal(e.target.value)} placeholder={`Add ${label.toLowerCase()}...`} />
                <Button type="button" onClick={() => { onAdd(val); setVal(''); }}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <ul className="list-disc pl-5 text-sm space-y-2 mt-2">
                {items.map((item, i) => (
                    <li key={i} className="group flex justify-between items-start gap-2">
                        <span className="mt-1.5">{item}</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(i)}
                            className="text-muted-foreground hover:text-destructive h-8 px-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                        >
                            <span className="lg:hidden">Remove</span>
                            <X className="h-4 w-4 hidden lg:block" />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
