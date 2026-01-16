export function decimalToNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }

    if (typeof value === 'object' && value && 'toNumber' in value && typeof (value as Record<string, unknown>).toNumber === 'function') {
        return ((value as Record<string, unknown>).toNumber as () => number)();
    }

    const n = Number(value as unknown);
    return Number.isFinite(n) ? n : 0;
}
