'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Experience {
    id: string;
    title: string;
    category: string;
    price: number;
    duration: string;
    enabled: boolean;
}

export default function AdminExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await fetch('/api/experiences?category=All'); // Fetch all
            const data = await res.json();
            setExperiences(data);
        } catch (error) {
            console.error('Failed to load experiences', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            const res = await fetch(`/api/experiences/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setExperiences(experiences.filter(e => e.id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            console.error('Delete error', error);
        }
    };

    const filtered = experiences.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Experiences Management</h1>
                <Link
                    href="/admin/experiences/new"
                    className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                    <Plus className="h-4 w-4" /> Add Experience
                </Link>
            </div>

            <div className="mb-6 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search experiences..."
                    className="flex-1 border-none bg-transparent outline-none focus:ring-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Title</th>
                            <th className="px-6 py-3 font-medium">Category</th>
                            <th className="px-6 py-3 font-medium">Price</th>
                            <th className="px-6 py-3 font-medium">Duration</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="p-6 text-center">No experiences found.</td></tr>
                        ) : (
                            filtered.map((exp) => (
                                <tr key={exp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-medium text-gray-900">{exp.title}</td>
                                    <td className="px-6 py-3">
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{exp.category}</span>
                                    </td>
                                    <td className="px-6 py-3">€{exp.price}</td>
                                    <td className="px-6 py-3">{exp.duration}</td>
                                    <td className="px-6 py-3">
                                        {exp.enabled ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                                Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/experiences/${exp.id}/edit`}
                                                aria-label={`Edit ${exp.title}`}
                                                className="text-ink-500 hover:text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Link>
                                            <button
                                                className="text-ink-500 inline-flex h-9 w-9 items-center justify-center rounded-lg hover:text-red-600"
                                                aria-label={`Delete ${exp.title}`}
                                                onClick={() => handleDelete(exp.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
