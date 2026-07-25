'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ClientError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>

            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
                <p className="text-gray-500">
                    We encountered an error while loading your content. Please try again or contact support if the issue persists.
                </p>
            </div>

            <div className="flex gap-4">
                <Button onClick={() => reset()} size="lg" className="rounded-full shadow-brand">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs font-mono text-gray-500 max-w-lg break-all">
                Error ID: {error.digest || 'Unknown'} <br />
                {error.message}
            </div>
        </div>
    );
}
