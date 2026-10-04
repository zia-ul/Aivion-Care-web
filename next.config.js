/**
 * NEXT_PUBLIC_API_URL is the one line that switches development and production
 * (see src/lib/api/config.ts). It is inlined into the client bundle at build
 * time, so a wrong value is baked in silently and only fails at runtime, in the
 * browser, as a Mixed Content error. Fail the build instead, while it can still
 * be fixed.
 */
function assertApiUrlIsSecure() {
  if (process.env.NODE_ENV !== 'production') return;

  const value = (process.env.NEXT_PUBLIC_API_URL || '').trim();
  if (!value) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not set. It is inlined into the client bundle at ' +
        'build time, so it cannot be supplied as a runtime variable. Set it in ' +
        '.env.local - see .env.example - then rebuild.'
    );
  }

  let host = '';
  try {
    host = new URL(value).host;
  } catch {
    throw new Error(`NEXT_PUBLIC_API_URL is not a valid URL: ${value}`);
  }

  const localHosts = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;
  if (/^http:\/\//i.test(value) && !localHosts.test(host)) {
    throw new Error(
      `NEXT_PUBLIC_API_URL is plain HTTP (${value}). The site is served over ` +
        `HTTPS, so the browser will block every request as Mixed Content. Use ` +
        `https://api.aivioncare.aiconfidencecure.com, then rebuild.`
    );
  }
}

assertApiUrlIsSecure();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `next dev` and `next build` both default to `.next`, so running one while
  // the other is live corrupts the other's manifests and webpack cache
  // (ENOENT on routes-manifest.json, failed pack renames). Give development its
  // own output directory. Production still uses `.next`, so deploy tooling that
  // expects the default path is unaffected.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
