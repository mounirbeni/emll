
// Alphanumeric, unambiguous characters (removed O, 0, I, L)
const ALPHABET = '123456789ABCDEFGHJKMNPQRSTUVWXYZ';
const RANDOM_LENGTH = 6;

export const ShortIdPrefix = {
    BOOKING: 'BK',
    SERVICE: 'SRV',
    SUPPORT: 'SUP',
} as const;

export type ShortIdPrefixType = typeof ShortIdPrefix[keyof typeof ShortIdPrefix];

/**
 * Generate a random string from custom alphabet
 */
function generateRandomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return result;
}

/**
 * Generate a short public ID with prefix (e.g., BK-92FQ7M)
 */
export function generateShortId(prefix: ShortIdPrefixType): string {
    return `${prefix}-${generateRandomString(RANDOM_LENGTH)}`;
}

/**
 * Validate format
 */
export function isValidShortId(id: string, prefix?: ShortIdPrefixType): boolean {
    const expectedPrefix = prefix ? `${prefix}-` : null;
    if (expectedPrefix && !id.startsWith(expectedPrefix)) return false;
    if (!/^[-A-Z0-9]+$/i.test(id)) return false;
    if (!/^[A-Z]+-[1-9A-HJKMNPQRSTUVWXYZ]{6}$/i.test(id)) return false;
    return true;
}
