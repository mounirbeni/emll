'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.success("Message sent! We'll get back to you soon.");
                setForm({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                toast.error('Failed to send. Please try again.');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ahmed El Mansouri"
                        required
                        className="input-base"
                    />
                </Field>
                <Field label="Email Address" required>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="input-base"
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Phone (optional)">
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 555 000 0000"
                        className="input-base"
                    />
                </Field>
                <Field label="Subject" required>
                    <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="input-base"
                    >
                        <option value="">Select a subject...</option>
                        <option value="Booking Inquiry">Booking Inquiry</option>
                        <option value="Custom Experience">Custom Experience Request</option>
                        <option value="Group Booking">Group Booking (10+ people)</option>
                        <option value="Partnership">Partnership / Supplier</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                    </select>
                </Field>
            </div>

            <Field label="Message" required>
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your trip, preferred dates, group size, or any special requests..."
                    required
                    rows={5}
                    className="input-base resize-none"
                />
            </Field>

            <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                    </>
                )}
            </Button>

            <p className="text-xs text-gray-400 text-center">
                By submitting this form, you agree to our privacy policy. We&apos;ll never share your information.
            </p>

            <style jsx>{`
                .input-base {
                    width: 100%;
                    border-radius: 12px;
                    border: 1.5px solid #e5e7eb;
                    background: #f9fafb;
                    padding: 0.625rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #111827;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
                }
                .input-base:focus {
                    border-color: #f97316;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
                }
                .input-base::placeholder {
                    color: #9ca3af;
                    font-weight: 400;
                }
            `}</style>
        </form>
    );
}

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="text-orange-500 ml-0.5">*</span>}
            </label>
            {children}
        </div>
    );
}
