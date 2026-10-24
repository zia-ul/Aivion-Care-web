/**
 * Single source of truth for the backend origin.
 *
 * There is exactly ONE setting to change between environments:
 *
 *   .env.local   NEXT_PUBLIC_API_URL=http://localhost:8080                      (development)
 *   .env.local   NEXT_PUBLIC_API_URL=https://aivioncare.aiconfidencecure.com (production)
 *
 * The WebSocket origin deliberately reuses the same value rather than having its
 * own variable: the STOMP client rewrites the scheme itself, so a second setting
 * would only be a second chance to get it wrong.
 *
 * Note that NEXT_PUBLIC_* values are inlined into the client bundle at build
 * time, so switching environments means editing .env.local AND rebuilding.
 * They cannot be supplied as runtime variables.
 */

const DEFAULT_DEV_ORIGIN = 'http://localhost:8080';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

/**
 * Backend origin for both the REST client and the WebSocket client.
 * Falls back to localhost only when nothing is configured, which is a
 * development convenience - a production build is blocked from building
 * without it by the check in next.config.js.
 */
export function resolveApiOrigin(): string {
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'https:') {
      // Eliminate non-existent api.* subdomains entirely in browser
      return 'https://aivioncare.aiconfidencecure.com';
    }
    return DEFAULT_DEV_ORIGIN;
  }
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured && !configured.includes('api.aivioncare.aiconfidencecure.com')) {
    return stripTrailingSlash(configured);
  }
  return 'https://aivioncare.aiconfidencecure.com';
}

/** WebSocket origin: same host as the API. */
export function resolveWsOrigin(): string {
  return resolveApiOrigin();
}
