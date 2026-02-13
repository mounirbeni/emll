'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface BookingFormProps {
    experienceId: string;
    basePrice: number;
}

export default function BookingForm({ experienceId, basePrice }: BookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        numberOfPersons: 1,
        date: '',
        time: '',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/reservations/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData, // Spread form data
                    numberOfPersons: Number(formData.numberOfPersons), // Ensure number
                    experienceId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create reservation');
            }

            toast.success('Reservation created! Redirecting to payment...');
            router.push(data.redirectUrl);
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="+212 600 000 000"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="numberOfPersons">Guests</Label>
                        <Input
                            id="numberOfPersons"
                            name="numberOfPersons"
                            type="number"
                            min="1"
                            required
                            value={formData.numberOfPersons}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                            id="time"
                            name="time"
                            type="time"
                            required
                            value={formData.time}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Dietary restrictions, special requests..."
                        value={formData.notes}
                        onChange={handleChange}
                        className="mt-1 resize-none"
                        rows={3}
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Total Price (approx)</p>
                    <p className="text-xl font-bold text-orange-600">
                        €{(basePrice * Number(formData.numberOfPersons)).toFixed(0)}
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-8 rounded-xl"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Book Now'
                    )}
                </Button>
            </div>
        </form>
    );
}
