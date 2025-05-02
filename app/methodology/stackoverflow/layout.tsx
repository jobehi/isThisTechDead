import { Metadata } from 'next';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Stack Overflow Methodology | Is This Tech Dead?',
  description:
    'How we measure digital decay on Stack Overflow - our snarky but precise methodology for quantifying tech zombification.',
  openGraph: {
    title: 'Stack Overflow Methodology | Is This Tech Dead?',
    description:
      'How we measure digital decay on Stack Overflow - our snarky but precise methodology for quantifying tech zombification.',
    url: `${config.site.url}/methodology/stackoverflow`,
    images: [
      {
        url: '/is_this_tech_dead_cover.png',
        width: 1200,
        height: 630,
        alt: 'Stack Overflow Methodology | Is This Tech Dead?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stack Overflow Methodology | Is This Tech Dead?',
    description:
      'How we measure digital decay on Stack Overflow - our snarky but precise methodology for quantifying tech zombification.',
    images: ['/is_this_tech_dead_cover.png'],
  },
};

export default function StackOverflowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
