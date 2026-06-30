'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Loader2, ArrowLeft, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ExperienceData {
    id: string;
    title: string;
    category: string;
    location: string;
    duration: string;
    price: number;
    currency: string;
    shortDescription: string;
    fullDescription: string;
    meetingPoint: string;
    pickupAvailable: boolean;
    enabled: boolean;
    featured: boolean;
    highlights: string[];
    included: string[];
    notIncluded: string[];
    blockedDates?: string[];
    maxCapacity?: number;
}

const CATEGORIES = ['Wellness', 'City Tours', 'Food & Drink', 'Desert', 'Adventure', 'Workshops', 'Transfers', 'Entertainment', 'Day Trips', 'Sports'];

export default function ExperienceEditForm({ experience }: { experience: ExperienceData }) {
    const router = useRouter();
    const [form, setForm] = useState({
        title: experience.title,
        category: experience.category,
        location: experience.location,
        duration: experience.duration,
        price: experience.price,
        currency: experience.currency,
        shortDescription: experience.shortDescription,
        fullDescription: experience.fullDescription,
        meetingPoint: experience.meetingPoint,
        pickupAvailable: experience.pickupAvailable,
        enabled: experience.enabled,
        featured: experience.featured,
        highlights: experience.highlights.join('\n'),
        included: experience.included.join('\n'),
        notIncluded: experience.notIncluded.join('\n'),
    });
    const [loading, setLoading] = useState(false);
    const [blockedDates, setBlockedDates] = useState<string[]>(
        (experience.blockedDates ?? []).map((d) => new Date(d).toISOString().slice(0, 10))
    );
    const [maxCapacity, setMaxCapacity] = useState(experience.maxCapacity ?? 0);
    const [newBlockedDate, setNewBlockedDate] = useState('');
    const [availabilitySaving, setAvailabilitySaving] = useState(false);

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
            const res = await fetch(`/api/experiences/${experience.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                toast.success('Experience updated successfully');
                router.push('/admin/experiences');
                router.refresh();
            } else {
                toast.error('Failed to update experience');
            }
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addBlockedDate = () => {
        if (!newBlockedDate || blockedDates.includes(newBlockedDate)) return;
        setBlockedDates((prev) => [...prev, newBlockedDate].sort());
        setNewBlockedDate('');
    };

    const removeBlockedDate = (date: string) => {
        setBlockedDates((prev) => prev.filter((d) => d !== date));
    };

    const saveAvailability = async () => {
        setAvailabilitySaving(true);
        try {
            const res = await fetch(`/api/experiences/${experience.id}/availability`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blockedDates: blockedDates.map((d) => new Date(d).toISOString()),
                    maxCapacity,
                }),
            });
            if (res.ok) {
                toast.success('Availability settings saved');
            } else {
                toast.error('Failed to save availability');
            }
        } catch {
            toast.error('Network error');
        } finally {
            setAvailabilitySaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Back */}
            <Link href="/admin/experiences" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Experiences
            </Link>

            {/* Basic Info */}
            <section className="bg-white rounded-xl border border-border p-6 space-y-5 shadow-sm">
                <h2 className="text-base font-semibold text-foreground">Basic Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Title" required>
                        <input name="title" value={form.title} onChange={handleChange} required className="form-input" />
                    </FormField>
                    <FormField label="Category" required>
                        <select name="category" value={form.category} onChange={handleChange} className="form-input">
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Location" required>
                        <input name="location" value={form.location} onChange={handleChange} required className="form-input" />
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
                    <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} required className="form-input resize-none" />
                </FormField>
                <FormField label="Full Description" required>
                    <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} rows={6} required className="form-input" />
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
                    <input name="meetingPoint" value={form.meetingPoint} onChange={handleChange} className="form-input" />
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

            {/* Availability */}
            <section className="bg-white rounded-xl border border-border p-6 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-foreground">Availability</h2>
                    <Button
                        type="button"
                        onClick={saveAvailability}
                        disabled={availabilitySaving}
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                    >
                        {availabilitySaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Availability'}
                    </Button>
                </div>

                <FormField label="Max Capacity (guests per day, 0 = unlimited)">
                    <input
                        type="number"
                        min={0}
                        value={maxCapacity}
                        onChange={(e) => setMaxCapacity(Number(e.target.value))}
                        className="form-input"
                    />
                </FormField>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Blocked Dates (unavailable for booking)</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            min={new Date().toISOString().slice(0, 10)}
                            value={newBlockedDate}
                            onChange={(e) => setNewBlockedDate(e.target.value)}
                            className="form-input flex-1"
                        />
                        <Button type="button" onClick={addBlockedDate} size="sm" className="rounded-lg shrink-0">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {blockedDates.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {blockedDates.map((date) => (
                                <span key={date} className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg px-2 py-1">
                                    {date}
                                    <button type="button" onClick={() => removeBlockedDate(date)} className="hover:text-red-900">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Submit */}
            <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="rounded-xl bg-primary text-white font-bold h-11 px-8">
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
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
