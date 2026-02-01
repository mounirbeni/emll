'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AdminError({
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
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground">
                    An error occurred while loading this page.
                </p>
            </div>
            <Button onClick={() => reset()} variant="default">
                Try again
            </Button>
            <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-md max-w-lg text-sm font-mono overflow-auto">
                {error.message}
            </div>
        </div>
    );
}
