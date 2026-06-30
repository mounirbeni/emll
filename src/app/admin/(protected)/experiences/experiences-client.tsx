'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Star,
    CalendarDays,
    TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Experience {
    id: string;
    title: string;
    category: string;
    price: number;
    currency: string;
    duration: string;
    enabled: boolean;
    featured: boolean;
    avgRating: number;
    reviewCount: number;
    _count: { bookings: number };
}

export default function ExperiencesClient({ experiences: initial }: { experiences: Experience[] }) {
    const router = useRouter();
    const [experiences, setExperiences] = useState(initial);
    const [search, setSearch] = useState('');
    const [isPending, startTransition] = useTransition();

    const filtered = experiences.filter(
        (e) =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggleEnabled = async (id: string, current: boolean) => {
        startTransition(async () => {
            try {
                const res = await fetch(`/api/experiences/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ enabled: !current }),
                });
                if (res.ok) {
                    setExperiences((prev) =>
                        prev.map((e) => (e.id === id ? { ...e, enabled: !current } : e))
                    );
                    toast.success(`Experience ${!current ? 'enabled' : 'disabled'}`);
                } else {
                    toast.error('Failed to update');
                }
            } catch {
                toast.error('Network error');
            }
        });
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        startTransition(async () => {
            try {
                const res = await fetch(`/api/experiences/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ featured: !current }),
                });
                if (res.ok) {
                    setExperiences((prev) =>
                        prev.map((e) => (e.id === id ? { ...e, featured: !current } : e))
                    );
                    toast.success(`Experience ${!current ? 'featured' : 'unfeatured'}`);
                } else {
                    toast.error('Failed to update');
                }
            } catch {
                toast.error('Network error');
            }
        });
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        startTransition(async () => {
            try {
                const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setExperiences((prev) => prev.filter((e) => e.id !== id));
                    toast.success('Experience deleted');
                } else {
                    toast.error('Failed to delete');
                }
            } catch {
                toast.error('Network error');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Experiences</h1>
                    <p className="text-muted-foreground text-sm">
                        {experiences.length} total · {experiences.filter((e) => e.enabled).length} active
                    </p>
                </div>
                <Link href="/admin/experiences/new">
                    <Button className="rounded-xl bg-primary text-white font-bold">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Experience
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-white rounded-xl border border-border px-4 py-2.5 shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                    type="text"
                    placeholder="Search by title or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground"
                />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: experiences.length, icon: TrendingUp },
                    { label: 'Active', value: experiences.filter((e) => e.enabled).length, icon: Eye },
                    { label: 'Featured', value: experiences.filter((e) => e.featured).length, icon: Star },
                    { label: 'Total Bookings', value: experiences.reduce((s, e) => s + e._count.bookings, 0), icon: CalendarDays },
                ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white rounded-xl border border-border p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-foreground">Title</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-foreground">Category</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-foreground">Price</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-foreground">Duration</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-foreground">Rating</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-foreground">Bookings</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-foreground">Status</th>
                                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider text-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-muted-foreground">
                                        {search ? `No results for "${search}"` : 'No experiences found.'}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-foreground max-w-[200px] truncate">{exp.title}</div>
                                            {exp.featured && (
                                                <Badge variant="secondary" className="mt-1 text-[10px] bg-amber-100 text-amber-700 border-0">
                                                    Featured
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 font-medium">
                                            {exp.currency === 'EUR' ? '€' : exp.currency}{exp.price}
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground">{exp.duration}</td>
                                        <td className="px-5 py-3">
                                            {exp.reviewCount > 0 ? (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                    <span className="font-medium">{exp.avgRating.toFixed(1)}</span>
                                                    <span className="text-muted-foreground text-xs">({exp.reviewCount})</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">No reviews</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{exp._count.bookings}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${exp.enabled
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {exp.enabled ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-lg"
                                                    title={exp.featured ? 'Unfeature' : 'Feature'}
                                                    onClick={() => handleToggleFeatured(exp.id, exp.featured)}
                                                    disabled={isPending}
                                                >
                                                    <Star className={`h-4 w-4 ${exp.featured ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-lg"
                                                    title={exp.enabled ? 'Disable' : 'Enable'}
                                                    onClick={() => handleToggleEnabled(exp.id, exp.enabled)}
                                                    disabled={isPending}
                                                >
                                                    {exp.enabled
                                                        ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        : <Eye className="h-4 w-4 text-emerald-600" />
                                                    }
                                                </Button>
                                                <Link href={`/admin/experiences/${exp.id}/edit`}>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 rounded-lg text-blue-600 hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50"
                                                    title="Delete"
                                                    onClick={() => handleDelete(exp.id, exp.title)}
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
