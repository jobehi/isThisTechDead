import { Metadata } from 'next';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Is This Tech Dead? | Our Methodology',
  description:
    'Learn how we calculate the Deaditude Score™ to determine how dead your favorite technology really is. Our data-driven approach combines metrics from GitHub, Stack Overflow, job listings, and more.',
  openGraph: {
    title: 'Is This Tech Dead? | Our Methodology',
    description:
      'Learn how we calculate the Deaditude Score™ to determine how dead your favorite technology really is.',
    url: `${config.site.url}/methodology`,
    images: [
      {
        url: '/is_this_tech_dead_cover.png',
        width: 1200,
        height: 630,
        alt: 'Is This Tech Dead? Methodology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is This Tech Dead? | Our Methodology',
    description:
      'Learn how we calculate the Deaditude Score™ to determine how dead your favorite technology really is.',
    images: ['/is_this_tech_dead_cover.png'],
  },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
