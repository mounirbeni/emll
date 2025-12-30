"use client";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="relative">
                    <div className="h-16 w-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                </div>
                <p className="text-muted-foreground font-medium">Loading...</p>
            </div>
        </div>
    );
}
