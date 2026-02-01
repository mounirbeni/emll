export type TravelerIdentity = {
  author: string
  nationality: string
  countryCode: string
}

const TRAVELERS: TravelerIdentity[] = [
  { author: 'Sarah Johnson', nationality: 'United States', countryCode: 'US' },
  { author: 'Pierre Dubois', nationality: 'France', countryCode: 'FR' },
  { author: 'Emma Thompson', nationality: 'United Kingdom', countryCode: 'GB' },
  { author: 'Carlos Rodríguez', nationality: 'Spain', countryCode: 'ES' },
  { author: 'Yuki Tanaka', nationality: 'Japan', countryCode: 'JP' },
  { author: 'Michael Chen', nationality: 'Canada', countryCode: 'CA' },
  { author: 'Giulia Romano', nationality: 'Italy', countryCode: 'IT' },
  { author: 'Lena Müller', nationality: 'Germany', countryCode: 'DE' },
  { author: 'Sofia Andersson', nationality: 'Sweden', countryCode: 'SE' },
  { author: 'Noah van Dijk', nationality: 'Netherlands', countryCode: 'NL' },
  { author: 'Aisha Al-Farsi', nationality: 'United Arab Emirates', countryCode: 'AE' },
  { author: 'Omar El Khouri', nationality: 'Lebanon', countryCode: 'LB' },
  { author: 'Fatima Zahra', nationality: 'Morocco', countryCode: 'MA' },
  { author: 'Inés Silva', nationality: 'Portugal', countryCode: 'PT' },
  { author: 'Lucas Martin', nationality: 'Argentina', countryCode: 'AR' },
  { author: 'Priya Nair', nationality: 'India', countryCode: 'IN' },
  { author: 'James Walker', nationality: 'Australia', countryCode: 'AU' },
  { author: 'Anna Kowalska', nationality: 'Poland', countryCode: 'PL' },
  { author: 'Leila Haddad', nationality: 'Tunisia', countryCode: 'TN' },
  { author: 'Nora Berg', nationality: 'Norway', countryCode: 'NO' },
]

function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export function getTravelerIdentity(seed: string): TravelerIdentity {
  const idx = hashString(seed || 'seed') % TRAVELERS.length
  return TRAVELERS[idx]
}
