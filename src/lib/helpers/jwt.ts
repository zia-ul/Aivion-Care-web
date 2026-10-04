/**
 * Minimal JWT helpers used to avoid firing requests we already know will fail.
 * We only decode the payload locally — no signature verification is needed for
 * client-side UX decisions such as "should we call /auth/logout?".
 */

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

function decodePayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = typeof atob === 'function'
      ? atob(padded)
      : Buffer.from(padded, 'base64').toString('binary');
    return JSON.parse(decodeURIComponent(escape(json))) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns true when the token is missing, malformed, or already expired.
 * A small leeway keeps us from racing the server clock.
 */
export function isTokenExpired(token?: string | null, leewaySeconds = 5): boolean {
  if (!token) return true;
  const payload = decodePayload(token);
  if (!payload?.exp) return true;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds + leewaySeconds;
}
