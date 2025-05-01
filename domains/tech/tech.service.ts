import { TechRepository } from './tech.repository';
import { Snapshot, Tech, TechDetails, TechWithScore } from './tech.types';
import { AppError } from '@/lib/errors';
import { config } from '@/lib/config';
import { calculateDeaditudeScore, formatScore, formatTechFilename } from '@/lib/shared';

/**
 * Tech Service
 *
 * Manages business logic for the tech domain.
 */
export class TechService {
  /**
   * Get a list of all technologies with their scores
   */
  static async getAllTechs(): Promise<TechWithScore[]> {
    const techs = await TechRepository.getAllTechs();

    // Transform to include scores and metrics - doing this in parallel for better performance
    const techsWithScores = await Promise.all(
      techs.map(async tech => {
        // Get latest snapshot, respect count, and project count in parallel
        const [latestSnapshot, respectCount, projectCount] = await Promise.all([
          TechRepository.getLatestSnapshotByTechId(tech.id),
          TechRepository.getRespectCount(tech.id),
          TechRepository.getProjectCountByTechId(tech.id),
        ]);

        return {
          ...tech,
          latest_score: latestSnapshot?.deaditude_score || null,
          latest_snapshot_date: latestSnapshot?.snapshot_date || null,
          respect_count: respectCount,
          project_count: projectCount,
        };
      })
    );

    // Sort by deaditude score (most dead first)
    return techsWithScores.sort((a, b) => {
      if (a.latest_score === null && b.latest_score === null) return 0;
      if (a.latest_score === null) return 1;
      if (b.latest_score === null) return -1;
      return b.latest_score - a.latest_score;
    });
  }

  /**
   * Get the complete details for a technology by ID
   */
  static async getTechDetails(techId: string): Promise<TechDetails> {
    const details = await TechRepository.getTechDetails(techId);

    if (!details.tech) {
      throw AppError.notFound(`Technology with ID "${techId}" not found`);
    }

    return details;
  }

  /**
   * Get the latest snapshot for a tech
   */
  static getLatestSnapshot(snapshots: Snapshot[]): Snapshot | null {
    return snapshots.length > 0 ? snapshots[0] : null;
  }

  /**
   * Calculate the deaditude score (0-100)
   */
  static calculateDeaditudeScore(snapshot: Snapshot | null): number {
    if (
      !snapshot ||
      typeof snapshot.deaditude_score !== 'number' ||
      isNaN(snapshot.deaditude_score)
    ) {
      return 0;
    }

    return calculateDeaditudeScore(snapshot.deaditude_score);
  }

  /**
   * Format a tech score for display
   */
  static formatTechScore(score: number): string {
    return formatScore(score);
  }

  /**
   * Generate metadata content for a tech page
   */
  static generateMetadataContent(
    tech: Tech | null,
    score: number
  ): {
    title: string;
    description: string;
    ogImage: string;
  } {
    if (!tech) {
      return {
        title: 'Technology Not Found',
        description: 'The requested technology was not found in our database.',
        ogImage: `${config.site.url}/og-images/not-found.png`,
      };
    }

    const scoreText = score ? this.formatTechScore(score) : 'Unknown';
    const imageUrl = `${config.site.url}/og-images/${formatTechFilename(tech.name, scoreText)}.png`;

    return {
      title: `Is ${tech.name} Dead? - Deaditude Score: ${scoreText}%`,
      description: `Find out if ${tech.name} is still relevant or dying with our data-driven obsolescence metrics. Current deaditude score: ${scoreText}%.`,
      ogImage: imageUrl,
    };
  }

  /**
   * Generate structured data for SEO
   */
  static generateStructuredData(
    tech: Tech,
    score: number,
    latestSnapshot: Snapshot | null,
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
        url: config.site.url,
      },
      datePublished: latestSnapshot?.created_at,
      dateModified: latestSnapshot?.created_at,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${config.site.url}/${slug}`,
      },
      image: `${config.site.url}/og-images/${formatTechFilename(tech.name, score ? this.formatTechScore(score) : 'Unknown')}.png`,
      mainEntity: [
        {
          '@type': 'Question',
          name: `Is ${tech.name} dead?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `According to our very scientific Deaditude Score™ of ${this.formatTechScore(score)}%, it's ${
              score >= 75
                ? 'basically rotting in the sun.'
                : score >= 50
                  ? 'hanging on by a deprecated thread.'
                  : score >= 25
                    ? 'still twitching a little.'
                    : 'surprisingly lively, despite the haters.'
            }`,
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
