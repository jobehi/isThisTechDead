import { MetadataRoute } from 'next';

const siteUrl = process.env.SITE_URL || 'https://isthistechdead.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
