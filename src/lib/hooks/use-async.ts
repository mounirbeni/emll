'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * Result of an async operation
 */
interface AsyncState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

/**
 * Hook for handling async operations with loading, error, and success states.
 * Prevents duplicate submissions and handles errors gracefully.
 */
export function useAsync<T, Args extends unknown[] = []>(
    asyncFunction: (...args: Args) => Promise<T>
) {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        error: null,
        isLoading: false,
        isSuccess: false,
        isError: false,
    });

    // Track if a request is in flight to prevent duplicates
    const inFlightRef = useRef(false);

    const execute = useCallback(
        async (...args: Args): Promise<T | null> => {
            // Prevent duplicate submissions
            if (inFlightRef.current) {
                console.warn('Request already in progress, skipping duplicate submission');
                return null;
            }

            inFlightRef.current = true;
            setState({
                data: null,
                error: null,
                isLoading: true,
                isSuccess: false,
                isError: false,
            });

            try {
                const result = await asyncFunction(...args);
                setState({
                    data: result,
                    error: null,
                    isLoading: false,
                    isSuccess: true,
                    isError: false,
                });
                return result;
            } catch (error) {
                const errorObj = error instanceof Error ? error : new Error(String(error));
                setState({
                    data: null,
                    error: errorObj,
                    isLoading: false,
                    isSuccess: false,
                    isError: true,
                });
                return null;
            } finally {
                inFlightRef.current = false;
            }
        },
        [asyncFunction]
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            error: null,
            isLoading: false,
            isSuccess: false,
            isError: false,
        });
    }, []);

    return { ...state, execute, reset };
}

/**
 * Hook for form submissions with automatic duplicate prevention
 */
export function useFormSubmit<T>(
    submitFn: (formData: FormData | Record<string, unknown>) => Promise<T>,
    options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
        resetOnSuccess?: boolean;
    }
) {
    const { execute, ...state } = useAsync(submitFn);

    const handleSubmit = useCallback(
        async (data: FormData | Record<string, unknown>) => {
            const result = await execute(data);
            if (result && options?.onSuccess) {
                options.onSuccess(result);
            }
            if (state.isError && state.error && options?.onError) {
                options.onError(state.error);
            }
            return result;
        },
        [execute, options, state.error, state.isError]
    );

    return { ...state, submit: handleSubmit };
}

/**
 * Safe fetch wrapper with automatic error handling
 */
export async function safeFetch<T>(
    url: string,
    options?: RequestInit
): Promise<{ data: T | null; error: Error | null }> {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(
                errorBody?.error?.message ||
                errorBody?.message ||
                `Request failed with status ${response.status}`
            );
        }

        const data = await response.json();
        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error : new Error(String(error))
        };
    }
}
