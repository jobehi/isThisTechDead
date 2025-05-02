import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  },

  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico|favicon.svg|public/).*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.isthistechdead.com https://scripts.simpleanalyticscdn.com https://buttondown.com/api/emails/embed-subscribe/is-this-tech-dead https://media.ethicalads.io https://server.ethicalads.io https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob: https:; " +
              "font-src 'self'; " +
              "connect-src 'self' https://*.supabase.co https://buttondown.com/api/emails/embed-subscribe/is-this-tech-dead https://server.ethicalads.io https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " +
              'frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; ' +
              "object-src 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self' https://buttondown.com; " +
              "frame-ancestors 'none'; " +
              'upgrade-insecure-requests;',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
      {
        source: '/:all*\\.(jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default config;
