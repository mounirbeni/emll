'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSettings } from "@/app/actions/admin-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SettingsData {
    businessName?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    cancellationPolicy?: string;
    socialFacebook?: string;
    socialInstagram?: string;
}

export function SettingsForm({ initialData }: { initialData: SettingsData }) {
    const [formData, setFormData] = useState({
        businessName: initialData?.businessName || 'Marrakech Activities',
        contactEmail: initialData?.contactEmail || 'infoexploremarrakesh@gmail.com',
        contactPhone: initialData?.contactPhone || '+212 601 439 975',
        address: initialData?.address || 'Marrakech, Morocco',
        cancellationPolicy: initialData?.cancellationPolicy || 'Free cancellation up to 24 hours before the experience.',
        socialFacebook: initialData?.socialFacebook || '',
        socialInstagram: initialData?.socialInstagram || ''
    });

    const [isPending, startTransition] = useTransition();
    // Router removed as it was unused

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const res = await updateSettings(formData);
            if (res.success) {
                toast.success("Settings saved successfully");
            } else {
                toast.error("Failed to save settings");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Cancellation Policy (Default)</Label>
                <Textarea
                    id="cancellationPolicy"
                    className="h-24"
                    value={formData.cancellationPolicy}
                    onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="socialFacebook">Facebook URL</Label>
                    <Input
                        id="socialFacebook"
                        value={formData.socialFacebook}
                        onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="socialInstagram">Instagram URL</Label>
                    <Input
                        id="socialInstagram"
                        value={formData.socialInstagram}
                        onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                    />
                </div>
            </div>

            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </form>
    );
}
