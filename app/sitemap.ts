import { MetadataRoute } from 'next';
import { TechService } from '@/domains/tech';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all tech entries
  const techs = await TechService.getAllTechs();

  const siteUrl = process.env.SITE_URL || 'https://isthistechdead.com';

  // Create sitemap entries for each tech page
  const techEntries = techs.map(tech => ({
    url: `${siteUrl}/${tech.id}`,
    lastModified: tech.latest_snapshot_date || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Static pages
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/methodology`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return [...staticPages, ...techEntries];
}
