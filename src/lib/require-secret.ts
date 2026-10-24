import crypto from 'crypto';

/**
 * Checks `Authorization: Bearer <secret>` against an environment variable in
 * constant time. Returns false when the variable is unset, so a route that
 * uses it stays closed until it is configured.
 */
export function hasBearerSecret(authorization: string | null, secret: string | undefined): boolean {
  if (!secret || !authorization?.startsWith('Bearer ')) return false;
  const given = crypto.createHash('sha256').update(authorization.slice('Bearer '.length)).digest();
  const expected = crypto.createHash('sha256').update(secret).digest();
  return crypto.timingSafeEqual(given, expected);
}
