
// Alphanumeric, unambiguous characters (removed O, 0, I, L)
const ALPHABET = '123456789ABCDEFGHJKMNPQRSTUVWXYZ';
const ID_LENGTH = 4; // Prefix (2) + Random (4) = 6

export const ShortIdPrefix = {
    BOOKING: 'BK',
    SERVICE: 'AC',
    SUPPORT: 'SP',
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
 * Generate a short 6-character ID with prefix (e.g., BK92FQ)
 */
export function generateShortId(prefix: ShortIdPrefixType): string {
    return `${prefix}${generateRandomString(ID_LENGTH)}`;
}

/**
 * Validate format
 */
export function isValidShortId(id: string, prefix?: ShortIdPrefixType): boolean {
    if (id.length !== 6) return false;
    if (prefix && !id.startsWith(prefix)) return false;
    return true;
}
