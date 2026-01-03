export function decimalToNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }

    if (typeof value === 'object' && value && 'toNumber' in value && typeof (value as any).toNumber === 'function') {
        return (value as any).toNumber();
    }

    const n = Number(value as any);
    return Number.isFinite(n) ? n : 0;
}
