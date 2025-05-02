// Server component
import { Home } from '@/components/features/home';
import { TechService } from '@/domains/tech/tech.service';
import { Metadata } from 'next';
import { JsonLd } from '@/components/atoms';
import { TechWithScore } from '@/domains/tech';

// Enable ISR with daily revalidation
export const revalidate = 86400; // 24 hours

// Add metadata with explicit image dimensions for Facebook
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: '/is_this_tech_dead_cover.png',
        width: 1200,
        height: 1200,
        alt: 'Is This Tech Dead - Obsolescence Tracker',
      },
    ],
  },
};

export default async function Page() {
  // Server-side data fetching with ISR
  const techsData = await TechService.getAllTechs();

  // Transform the data to match the expected Tech type in the Home component
  const techs = techsData.map(tech => ({
    ...tech,
    latest_snapshot_date: tech.latest_snapshot_date || null,
  })) as TechWithScore[];

  const siteUrl = process.env.SITE_URL || 'https://www.isthistechdead.com';

  // Create JSON-LD data for the home page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Is This Tech Dead?',
    description:
      'Find out how dead your favorite tech really is with our data-driven obsolescence metrics.',
    url: siteUrl,
    logo: `${siteUrl}/is_this_tech_dead_logo_small_2.png`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="relative">
      {/* Structured data for SEO */}
      <JsonLd data={jsonLd} />
      {/* Main content */}
      <Home initialTechs={techs} />
    </div>
  );
}
