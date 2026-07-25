"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Edit profile.
 *
 * The page previously posted to /api/client/profile/update, which does not
 * exist — saving silently 404'd. This submits to PUT /api/user, the real
 * endpoint.
 */
export function EditProfileForm({
    initialName,
    email,
    initialPhone,
}: {
    initialName: string;
    email: string;
    initialPhone: string;
}) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [phone, setPhone] = useState(initialPhone);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saving) return;

        if (name.trim().length < 2) {
            toast.error("Please enter your full name");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
            });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || "Could not save your profile");
            }

            toast.success("Profile updated");
            router.push("/client/profile");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not save your profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                    <User className="text-ink-400 absolute left-3 top-3 h-4 w-4" />
                    <Input
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        className="bg-surface h-11 rounded-xl pl-9 transition-colors hover:bg-white"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                    <Mail className="text-ink-400 absolute left-3 top-3 h-4 w-4" />
                    <Input
                        id="email"
                        value={email}
                        disabled
                        className="bg-ink-100 text-ink-500 h-11 rounded-xl pl-9"
                    />
                </div>
                <p className="text-ink-400 text-xs">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                    <Phone className="text-ink-400 absolute left-3 top-3 h-4 w-4" />
                    <Input
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+212..."
                        autoComplete="tel"
                        className="bg-surface h-11 rounded-xl pl-9 transition-colors hover:bg-white"
                    />
                </div>
            </div>

            <div className="pt-8">
                <Button
                    type="submit"
                    disabled={saving}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
