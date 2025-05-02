'use client';

import { useEffect, useState } from 'react';

type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * JsonLd component for structured data markup.
 * Renders JSON-LD data for SEO and structured data purposes.
 *
 * @example
 * ```tsx
 * import { JsonLd } from '@/components/atoms';
 *
 * <JsonLd data={{
 *   "@context": "https://schema.org",
 *   "@type": "WebPage",
 *   "name": "Is This Tech Dead?"
 * }} />
 * ```
 */
export function JsonLd({ data }: JsonLdProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on client to prevent hydration mismatch
  if (!isClient) return null;

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
