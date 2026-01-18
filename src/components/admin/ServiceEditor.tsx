'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, ArrowLeft, Upload, Loader2, GripVertical } from 'lucide-react';
import { Service } from '@/types/admin';
import Link from 'next/link';
import { toast } from 'sonner';
import { createExperience, updateExperience, generateCloudinarySignature } from '@/app/actions/admin-actions'; // Import Actions

interface ServiceEditorProps {
    initialData?: Service | null;
    isNew?: boolean;
}

export function ServiceEditor({ initialData, isNew = false }: ServiceEditorProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
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
        excluded: [],
        whatToBring: [],
        highlights: [],
        tags: [],
        itinerary: [],
        ...initialData
    });

    const [tagInput, setTagInput] = useState('');
    const [itineraryDraft, setItineraryDraft] = useState({ time: '', title: '', description: '' });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare data strictly according to schema (although Partial<Service> is mostly compatible)
            // Zod schema expects strings, numbers, arrays.
            // Ensure types are correct.
            const payload: any = {
                title: formData.title || '',
                description: formData.description || '',
                price: Number(formData.price) || 0,
                category: formData.category || '',
                duration: formData.duration || '',
                location: formData.location || '',
                images: formData.images || [],
                features: formData.features || [],
                included: formData.included || [],
                excluded: formData.excluded || [],
                whatToBring: formData.whatToBring || [],
                highlights: formData.highlights || [],
                tags: formData.tags || [],
                itinerary: formData.itinerary || [],
                // host: optional
            };

            let res;
            if (isNew) {
                res = await createExperience(payload);
            } else {
                if (!initialData?.id) throw new Error("Missing ID for update");
                res = await updateExperience(initialData.id, payload);
            }

            if (!res.success) {
                throw new Error(res.error || 'Failed to save');
            }

            toast.success(isNew ? 'Service created successfully' : 'Service updated successfully');
            router.push('/admin/services');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async (file: File) => {
        setIsUploading(true);
        try {
            // Use Server Action for signature
            const signRes = await generateCloudinarySignature('services');
            if (!signRes.success || !signRes.data) {
                throw new Error(signRes.error || 'Failed to get upload signature');
            }

            const sign = signRes.data;

            const uploadUrl = `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`;
            const data = new FormData();
            data.append('file', file);
            data.append('api_key', sign.apiKey);
            data.append('timestamp', String(sign.timestamp));
            data.append('signature', sign.signature);
            data.append('upload_preset', sign.uploadPreset);
            data.append('folder', sign.folder);

            const uploadRes = await fetch(uploadUrl, {
                method: 'POST',
                body: data,
            });

            const uploadJson = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadJson?.error?.message || 'Upload failed');

            const url = uploadJson.secure_url as string;
            if (!url) throw new Error('Upload succeeded but no URL returned');

            setFormData((prev) => ({
                ...prev,
                images: [...((prev.images as string[]) || []), url],
            }));

            toast.success('Image uploaded');
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddItineraryStep = () => {
        const time = itineraryDraft.time.trim();
        const title = itineraryDraft.title.trim();
        const description = itineraryDraft.description.trim();

        if (!time || !title || !description) {
            toast.error('Please fill out time, title, and description');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            itinerary: [...((prev.itinerary as any[]) || []), { time, title, description }],
        }));
        setItineraryDraft({ time: '', title: '', description: '' });
    };

    const handleUpdateItineraryStep = (index: number, key: 'time' | 'title' | 'description', value: string) => {
        setFormData((prev) => {
            const itinerary = Array.isArray(prev.itinerary) ? [...(prev.itinerary as any[])] : [];
            const current = itinerary[index] || { time: '', title: '', description: '' };
            itinerary[index] = { ...current, [key]: value };
            return { ...prev, itinerary };
        });
    };

    const handleRemoveItineraryStep = (index: number) => {
        setFormData((prev) => {
            const itinerary = Array.isArray(prev.itinerary) ? [...(prev.itinerary as any[])] : [];
            itinerary.splice(index, 1);
            return { ...prev, itinerary };
        });
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
                            <CardDescription>Upload images from your device.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        handleUploadImage(file);
                                        e.currentTarget.value = '';
                                    }}
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="sm:w-[170px] justify-center"
                                    disabled={isUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Select Image
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground">JPG/PNG/WebP</p>
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
                            <CardTitle>Itinerary</CardTitle>
                            <CardDescription>Add step-by-step itinerary items.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="grid gap-2">
                                    <Label>Time / Day</Label>
                                    <Input
                                        value={itineraryDraft.time}
                                        onChange={(e) => setItineraryDraft((p) => ({ ...p, time: e.target.value }))}
                                        placeholder="Day 1 / 09:00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={itineraryDraft.title}
                                        onChange={(e) => setItineraryDraft((p) => ({ ...p, title: e.target.value }))}
                                        placeholder="Pickup & Welcome"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Action</Label>
                                    <Button type="button" onClick={handleAddItineraryStep} className="mt-6">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Step
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={itineraryDraft.description}
                                    onChange={(e) => setItineraryDraft((p) => ({ ...p, description: e.target.value }))}
                                    placeholder="Describe what happens in this step..."
                                />
                            </div>

                            <div className="space-y-3">
                                {(Array.isArray(formData.itinerary) ? formData.itinerary : []).map((item: any, idx: number) => (
                                    <div key={idx} className="rounded-xl border border-border p-4 bg-muted/20">
                                        <div className="flex items-start gap-3">
                                            <div className="pt-2 text-muted-foreground">
                                                <GripVertical className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="grid gap-2">
                                                    <Label className="text-xs text-muted-foreground">Time / Day</Label>
                                                    <Input
                                                        value={item?.time || ''}
                                                        onChange={(e) => handleUpdateItineraryStep(idx, 'time', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2 md:col-span-2">
                                                    <Label className="text-xs text-muted-foreground">Title</Label>
                                                    <Input
                                                        value={item?.title || ''}
                                                        onChange={(e) => handleUpdateItineraryStep(idx, 'title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid gap-2 md:col-span-3">
                                                    <Label className="text-xs text-muted-foreground">Description</Label>
                                                    <Textarea
                                                        value={item?.description || ''}
                                                        onChange={(e) => handleUpdateItineraryStep(idx, 'description', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={() => handleRemoveItineraryStep(idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
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
                                label="Excluded"
                                items={formData.excluded || []}
                                onAdd={val => handleArrayInput('excluded', val, 'add')}
                                onRemove={idx => handleArrayInput('excluded', '', 'remove', idx)}
                            />
                            <ArrayInput
                                label="Highlights"
                                items={formData.highlights || []}
                                onAdd={val => handleArrayInput('highlights', val, 'add')}
                                onRemove={idx => handleArrayInput('highlights', '', 'remove', idx)}
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
