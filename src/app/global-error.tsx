"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen bg-background flex items-center justify-center px-4 font-sans text-foreground">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="mx-auto h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-foreground">Critical Error</h1>
                            <p className="text-muted-foreground">
                                A critical system error occurred. We apologize for the inconvenience.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => reset()}
                                className="w-full gap-2 rounded-full"
                                size="lg"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                Try again
                            </Button>
                        </div>

                        {error.digest && (
                            <p className="text-sm text-muted-foreground">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
