"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { MobileAppContainer } from "@/components/mobile/MobileAppContainer";
import { MobileTopBar } from "@/components/mobile/MobileTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Change password. The form previously had no onSubmit and no action, so the
 * "Update Password" button did nothing — /api/user/password already existed.
 */
export default function PasswordPage() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saving) return;

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/user/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Could not update password");

            toast.success("Password updated");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            router.push("/client/profile");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not update password");
        } finally {
            setSaving(false);
        }
    };

    const field = (
        id: string,
        label: string,
        value: string,
        onChange: (v: string) => void,
        autoComplete: string
    ) => (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Lock className="text-ink-400 absolute left-3 top-3 h-4 w-4" />
                <Input
                    id={id}
                    type="password"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    required
                    className="bg-surface h-11 rounded-xl pl-9 transition-colors hover:bg-white"
                />
            </div>
        </div>
    );

    return (
        <MobileAppContainer className="bg-white">
            <MobileTopBar title="Change Password" showBack />

            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-brand-50 border-brand-100 text-brand-800 mb-6 rounded-xl border p-4 text-sm">
                        Use a strong password with at least 8 characters, including numbers and
                        symbols.
                    </div>

                    {field("current-password", "Current Password", currentPassword, setCurrentPassword, "current-password")}
                    {field("new-password", "New Password", newPassword, setNewPassword, "new-password")}
                    {field("confirm-password", "Confirm New Password", confirmPassword, setConfirmPassword, "new-password")}

                    <div className="pt-8">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="h-12 w-full rounded-xl text-base font-semibold"
                        >
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </MobileAppContainer>
    );
}
