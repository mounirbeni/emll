'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CATEGORIES = ['Wellness', 'City Tours', 'Food & Drink', 'Desert', 'Adventure', 'Workshops', 'Transfers', 'Entertainment', 'Day Trips', 'Sports'];

const DEFAULT_FORM = {
    title: '',
    category: CATEGORIES[0],
    location: '',
    duration: '',
    price: 0,
    currency: 'EUR',
    shortDescription: '',
    fullDescription: '',
    meetingPoint: '',
    pickupAvailable: false,
    enabled: true,
    featured: false,
    highlights: '',
    included: '',
    notIncluded: '',
};

export default function ExperienceCreateForm() {
    const router = useRouter();
    const [form, setForm] = useState(DEFAULT_FORM);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
                included: form.included.split('\n').map((s) => s.trim()).filter(Boolean),
                notIncluded: form.notIncluded.split('\n').map((s) => s.trim()).filter(Boolean),
            };
            const res = await fetch('/api/experiences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                toast.success('Experience created successfully');
                router.push('/admin/experiences');
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to create experience');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Link href="/admin/experiences" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Experiences
            </Link>

            <div>
                <h1 className="text-2xl font-bold">New Experience</h1>
                <p className="text-muted-foreground text-sm mt-1">Create a new experience listing</p>
            </div>

            {/* Basic Info */}
            <section className="bg-white rounded-xl border border-border p-6 space-y-5 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">Basic Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Title" required>
                        <input name="title" value={form.title} onChange={handleChange} required className="form-input" placeholder="Amazing Desert Tour" />
                    </FormField>
                    <FormField label="Category" required>
                        <select name="category" value={form.category} onChange={handleChange} className="form-input">
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Location" required>
                        <input name="location" value={form.location} onChange={handleChange} required className="form-input" placeholder="Marrakech, Morocco" />
                    </FormField>
                    <FormField label="Duration" required>
                        <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 hours" required className="form-input" />
                    </FormField>
                    <FormField label="Price" required>
                        <input type="number" name="price" value={form.price} onChange={handleChange} min={0} required className="form-input" />
                    </FormField>
                    <FormField label="Currency">
                        <select name="currency" value={form.currency} onChange={handleChange} className="form-input">
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                            <option value="MAD">MAD (DH)</option>
                        </select>
                    </FormField>
                </div>
            </section>

            {/* Descriptions */}
            <section className="bg-white rounded-xl border border-border p-6 space-y-5 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">Descriptions</h2>
                <FormField label="Short Description" required>
                    <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} required className="form-input resize-none" placeholder="Brief summary shown on listing cards..." />
                </FormField>
                <FormField label="Full Description" required>
                    <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} rows={6} required className="form-input" placeholder="Detailed description of the experience..." />
                </FormField>
            </section>

            {/* Lists */}
            <section className="bg-white rounded-xl border border-border p-6 space-y-5 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">Lists (one item per line)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <FormField label="Highlights">
                        <textarea name="highlights" value={form.highlights} onChange={handleChange} rows={5} className="form-input" placeholder="Highlight 1&#10;Highlight 2" />
                    </FormField>
                    <FormField label="What's Included">
                        <textarea name="included" value={form.included} onChange={handleChange} rows={5} className="form-input" placeholder="Item 1&#10;Item 2" />
                    </FormField>
                    <FormField label="Not Included">
                        <textarea name="notIncluded" value={form.notIncluded} onChange={handleChange} rows={5} className="form-input" placeholder="Item 1&#10;Item 2" />
                    </FormField>
                </div>
            </section>

            {/* Logistics & Settings */}
            <section className="bg-white rounded-xl border border-border p-6 space-y-5 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">Logistics & Settings</h2>
                <FormField label="Meeting Point">
                    <input name="meetingPoint" value={form.meetingPoint} onChange={handleChange} className="form-input" placeholder="e.g. Jemaa el-Fna Square" />
                </FormField>
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="pickupAvailable" checked={form.pickupAvailable} onChange={handleChange} className="rounded accent-orange-500 h-4 w-4" />
                        <span className="text-sm font-medium">Pickup Available</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleChange} className="rounded accent-orange-500 h-4 w-4" />
                        <span className="text-sm font-medium">Published (visible to users)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="rounded accent-orange-500 h-4 w-4" />
                        <span className="text-sm font-medium">Featured on homepage</span>
                    </label>
                </div>
            </section>

            <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="rounded-xl bg-primary text-white font-bold h-11 px-8">
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : <><Save className="mr-2 h-4 w-4" />Create Experience</>}
                </Button>
                <Link href="/admin/experiences">
                    <Button type="button" variant="outline" className="rounded-xl h-11">Cancel</Button>
                </Link>
            </div>

            <style jsx>{`
                :global(.form-input) {
                    width: 100%;
                    border-radius: 10px;
                    border: 1.5px solid hsl(var(--border));
                    background: hsl(var(--muted) / 0.3);
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                :global(.form-input:focus) {
                    border-color: #f97316;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
                }
            `}</style>
        </form>
    );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
                {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}
