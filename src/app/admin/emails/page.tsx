'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminEmailsPage() {
    const [activeTab, setActiveTab] = useState<'broadcast' | 'promo' | 'logs'>('logs');

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Email Management</h1>
            </div>

            <div className="flex space-x-4 border-b">
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`pb-2 px-4 ${activeTab === 'logs' ? 'border-b-2 border-orange-500 font-bold' : ''}`}
                >
                    Email Logs
                </button>
                <button
                    onClick={() => setActiveTab('broadcast')}
                    className={`pb-2 px-4 ${activeTab === 'broadcast' ? 'border-b-2 border-orange-500 font-bold' : ''}`}
                >
                    Broadcast
                </button>
                <button
                    onClick={() => setActiveTab('promo')}
                    className={`pb-2 px-4 ${activeTab === 'promo' ? 'border-b-2 border-orange-500 font-bold' : ''}`}
                >
                    Promo Codes
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                {activeTab === 'logs' && <EmailLogs />}
                {activeTab === 'broadcast' && <BroadcastForm />}
                {activeTab === 'promo' && <PromoForm />}
            </div>
        </div>
    );
}

interface EmailLogItem {
    id: string;
    type: string;
    status: string;
    metadata?: string;
    sentAt: string;
}

function EmailLogs() {
    const { data: logs, error } = useSWR<EmailLogItem[]>('/api/admin/emails', fetcher, { refreshInterval: 5000 });

    if (error) return <div>Failed to load logs</div>;
    if (!logs) return <div>Loading...</div>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Recent Emails</h2>
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Type</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">To</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Metadata</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{log.type}</td>
                            <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs ${log.status === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {log.status}
                                </span>
                            </td>
                            <td className="p-2">{log.metadata ? JSON.parse(log.metadata)?.to || '-' : '-'}</td>
                            <td className="p-2">{new Date(log.sentAt).toLocaleString()}</td>
                            <td className="p-2 text-xs text-gray-500 max-w-xs truncate" title={log.metadata}>
                                {log.metadata}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function BroadcastForm() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch('/api/admin/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    ctaText: formData.get('ctaText'),
                    ctaLink: formData.get('ctaLink'),
                    targetRole: formData.get('targetRole'),
                }),
            });

            if (!res.ok) throw new Error('Failed to send');
            const data = await res.json();
            toast.success(`Broadcast sent to ${data.count} users!`);
            (e.target as HTMLFormElement).reset();
            (e.target as HTMLFormElement).reset();
        } catch {
            toast.error('Failed to send broadcast');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
                <label className="block text-sm font-medium">Subject</label>
                <input name="subject" required className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium">Message (HTML supported)</label>
                <textarea name="message" required className="w-full border p-2 rounded h-32" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">CTA Text (Optional)</label>
                    <input name="ctaText" className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">CTA Link (Optional)</label>
                    <input name="ctaLink" className="w-full border p-2 rounded" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Target Audience</label>
                <select name="targetRole" className="w-full border p-2 rounded">
                    <option value="ALL">All Users</option>
                    <option value="CUSTOMER">Customers Only</option>
                    <option value="ADMIN">Admins Only (Test)</option>
                </select>
            </div>
            <button disabled={loading} className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Broadcast'}
            </button>
        </form>
    );
}

function PromoForm() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const userIds = (formData.get('userIds') as string).split(',').map(s => s.trim());

        try {
            const res = await fetch('/api/admin/promo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userIds,
                    promoCode: formData.get('promoCode'),
                    discountAmount: formData.get('discountAmount'),
                    expirationDate: formData.get('expirationDate'),
                }),
            });

            if (!res.ok) throw new Error('Failed to send');
            const data = await res.json();
            toast.success(`Promo sent to ${data.count} users!`);
            (e.target as HTMLFormElement).reset();
            (e.target as HTMLFormElement).reset();
        } catch {
            toast.error('Failed to send promo');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
                <label className="block text-sm font-medium">User IDs (comma separated)</label>
                <input name="userIds" required className="w-full border p-2 rounded" placeholder="id1, id2, id3" />
            </div>
            <div>
                <label className="block text-sm font-medium">Promo Code</label>
                <input name="promoCode" required className="w-full border p-2 rounded" placeholder="SUMMER2026" />
            </div>
            <div>
                <label className="block text-sm font-medium">Discount Amount</label>
                <input name="discountAmount" required className="w-full border p-2 rounded" placeholder="20% or 50€" />
            </div>
            <div>
                <label className="block text-sm font-medium">Expiration Date</label>
                <input name="expirationDate" type="date" required className="w-full border p-2 rounded" />
            </div>
            <button disabled={loading} className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Promo Code'}
            </button>
        </form>
    );
}
