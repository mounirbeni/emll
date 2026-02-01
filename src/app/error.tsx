"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="mx-auto h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Something went wrong!</h1>
                    <p className="text-muted-foreground">
                        We encountered an unexpected error. Please try again.
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={reset}
                        className="w-full gap-2 rounded-full"
                        size="lg"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try again
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/")}
                        className="w-full rounded-full"
                        size="lg"
                    >
                        Go to homepage
                    </Button>
                </div>

                {error.digest && (
                    <p className="text-sm text-muted-foreground">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
