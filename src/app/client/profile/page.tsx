"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Camera, Save, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "+212 600 000 000", // Mock phone data
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API update
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update session simulation
        if (session) {
            await update({
                ...session,
                user: {
                    ...session.user,
                    name: formData.name,
                    email: formData.email
                }
            });
        }

        setIsLoading(false);
        // Toast would go here
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-500 text-lg">Manage your personal information and preferences.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer">
                            <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-orange-50 bg-gray-100 relative">
                                {session?.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={formData.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold">
                                        {formData.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.name}</h2>
                        <p className="text-sm text-gray-500 mb-6">Travel Enthusiast</p>

                        <div className="w-full pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center text-sm mb-3">
                                <span className="text-gray-500">Member Since</span>
                                <span className="font-bold text-gray-900">Oct 2025</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Verified Identity</span>
                                <span className="font-bold text-green-600 flex items-center gap-1">
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Personal Details
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                                    <div className="relative">
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="pl-10 h-11 rounded-xl border-gray-200 focus-visible:ring-primary"
                                        />
                                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                                    <div className="relative">
                                        <Input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10 h-11 rounded-xl border-gray-200 focus-visible:ring-primary"
                                        />
                                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                    <div className="relative">
                                        <Input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="pl-10 h-11 rounded-xl border-gray-200 focus-visible:ring-primary"
                                        />
                                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary hover:bg-orange-600 text-white font-bold rounded-xl h-11 px-8 shadow-brand min-w-[120px]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
