import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import config from '@/lib/config';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Is This Tech Dead? | Tech Obsolescence Tracker',
  description:
    'Find out how dead your favorite tech really is with our data-driven obsolescence metrics. Up-to-date insights on technology relevance and adoption.',
  metadataBase: new URL(config.site.url),
  keywords: [
    'technology',
    'software development',
    'obsolescence',
    'tech trends',
    'programming',
    'developer tools',
  ],
  authors: [{ name: 'Is This Tech Dead Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.site.url,
    siteName: config.site.name,
    title: 'Is This Tech Dead? | Tech Obsolescence Tracker',
    description: config.site.description,
    images: [
      {
        url: config.site.ogImage,
        width: 1200,
        height: 1200,
        alt: 'Is This Tech Dead - Obsolescence Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is This Tech Dead? | Tech Obsolescence Tracker',
    description:
      'Find out how dead your favorite tech really is with our data-driven obsolescence metrics.',
    images: ['/is_this_tech_dead_cover.png'],
    creator: '@isthistechdead',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: config.site.url,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/is_this_tech_dead_logo_small_2.png' },
    ],
    apple: '/is_this_tech_dead_logo_small_2.png',
    shortcut: '/is_this_tech_dead_logo_small_2.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080808',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Ensure URL has protocol
  const supabasePreconnect = supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '') : '';

  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to critical third-party services for performance optimization */}

        {/* Simple Analytics */}
        <link rel="preconnect" href="https://scripts.simpleanalyticscdn.com" />
        <link rel="preconnect" href="https://static.simpleanalyticscdn.com" />

        {/* Ethical Ads - both domains needed */}
        <link rel="preconnect" href="https://media.ethicalads.io" />
        <link rel="preconnect" href="https://server.ethicalads.io" />

        {/* Buttondown Newsletter */}
        <link rel="preconnect" href="https://buttondown.com" />

        {/* Google reCAPTCHA */}
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.gstatic.com" />

        {/* Supabase API */}
        {supabasePreconnect && <link rel="preconnect" href={`https://${supabasePreconnect}`} />}

        {/* Vercel Analytics */}
        <link rel="preconnect" href="https://vercel.com" />

        <Script
          id="ethical-ads"
          strategy="beforeInteractive"
          async
          src="https://media.ethicalads.io/media/client/ethicalads.min.js"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100`}
      >
        {children}
        {/* Simple Analytics: load after interactivity */}
        <Script
          src="https://scripts.simpleanalyticscdn.com/latest.js"
          strategy="afterInteractive"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
