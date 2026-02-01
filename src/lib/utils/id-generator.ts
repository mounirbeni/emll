/**
 * Generates a short, unique ID suitable for bookings and other entities
 * Format: BK-XXXXXX where X is alphanumeric
 */
export function generateShortId(prefix: string = ''): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add prefix if provided
  if (prefix) {
    return `${prefix}-${result}`;
  }
  
  return result;
}

/**
 * Generates a short booking ID
 * Format: BK-XXXXXX
 */
export function generateBookingId(): string {
  return generateShortId('BK');
}

/**
 * Generates a short user ID
 * Format: US-XXXXXX
 */
export function generateUserId(): string {
  return generateShortId('US');
}

/**
 * Generates a short service ID
 * Format: SV-XXXXXX
 */
export function generateServiceId(): string {
  return generateShortId('SV');
}

/**
 * Generates a short conversation ID
 * Format: CV-XXXXXX
 */
export function generateConversationId(): string {
  return generateShortId('CV');
}

/**
 * Generates a short message ID
 * Format: MSG-XXXXXX
 */
export function generateMessageId(): string {
  return generateShortId('MSG');
}

/**
 * Generates a short review ID
 * Format: REV-XXXXXX
 */
export function generateReviewId(): string {
  return generateShortId('REV');
}