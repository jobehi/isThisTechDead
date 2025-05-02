/**
 * Meta Builder Service
 *
 * Shared utilities for generating SEO metadata and OG image paths
 * used by both the web UI and OG image generation scripts.
 */
import { formatScore } from './ratings';
import { formatTechFilename } from './utils';
import config from '../config';

/**
 * Basic tech info needed for metadata generation
 */
export interface TechMetaInfo {
  id: string;
  name: string;
}

/**
 * Result of metadata content generation
 */
export interface MetadataContent {
  title: string;
  description: string;
  ogImage: string;
}

export class MetaBuilder {
  private siteUrl: string;

  constructor(options?: { siteUrl?: string }) {
    this.siteUrl = options?.siteUrl || config.site.url;
  }

  /**
   * Format a score for display
   */
  formatTechScore(score: number): string {
    return formatScore(score);
  }

  /**
   * Get the OG image path for a tech
   */
  getTechOGImagePath(techName: string, score: number | null): string {
    const scoreText = score !== null ? this.formatTechScore(score) : 'Unknown';
    return `${this.siteUrl}/og-images/${formatTechFilename(techName, scoreText)}.png`;
  }

  /**
   * Get the OG image path for not found
   */
  getNotFoundOGImagePath(): string {
    return `${this.siteUrl}/og-images/not-found.png`;
  }

  /**
   * Generate metadata content for a tech
   */
  generateMetadataContent(tech: TechMetaInfo | null, score: number | null): MetadataContent {
    if (!tech) {
      return {
        title: 'Technology Not Found',
        description: 'The requested technology was not found in our database.',
        ogImage: this.getNotFoundOGImagePath(),
      };
    }

    const scoreText = score !== null ? this.formatTechScore(score) : 'Unknown';

    return {
      title: `Is ${tech.name} Dead? - Deaditude Score: ${scoreText}%`,
      description: `Find out if ${tech.name} is still relevant or dying with our data-driven obsolescence metrics. Current deaditude score: ${scoreText}%.`,
      ogImage: this.getTechOGImagePath(tech.name, score),
    };
  }

  /**
   * Get the status description based on score
   */
  getTechStatusDescription(score: number): string {
    if (score >= 75) return 'basically rotting in the sun.';
    if (score >= 50) return 'hanging on by a deprecated thread.';
    if (score >= 25) return 'still twitching a little.';
    return 'surprisingly lively, despite the haters.';
  }

  /**
   * Generate structured data for SEO
   */
  generateStructuredData(
    tech: TechMetaInfo,
    score: number,
    datePublished: string | null,
    slug: string
  ): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `Is ${tech.name} Dead?`,
      description: `Find out if ${tech.name} is still relevant or dying with our data-driven obsolescence metrics.`,
      author: {
        '@type': 'Organization',
        name: config.site.name,
        url: this.siteUrl,
      },
      datePublished,
      dateModified: datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.siteUrl}/${slug}`,
      },
      image: this.getTechOGImagePath(tech.name, score),
      mainEntity: [
        {
          '@type': 'Question',
          name: `Is ${tech.name} dead?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `According to our very scientific Deaditude Score™ of ${this.formatTechScore(score)}%, it's ${this.getTechStatusDescription(
              score
            )}`,
          },
        },
        {
          '@type': 'Question',
          name: `What is the Deaditude Score based on?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `We analyze GitHub activity, Reddit despair, YouTube hype, Stack Overflow neglect, and sprinkle in some pure, unfiltered developer existentialism.`,
          },
        },
        {
          '@type': 'Question',
          name: `Should I still use ${tech.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `We legally can't tell you what to do. But let's just say: if the score smells like a corpse, maybe don't build your startup on it.`,
          },
        },
      ],
    };
  }
}
