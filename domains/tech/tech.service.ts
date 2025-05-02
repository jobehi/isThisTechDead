import { TechRepository } from './tech.repository';
import { Snapshot, Tech, TechDetails, TechWithScore } from './tech.types';
import { AppError } from '@/lib/errors';
import { MetaBuilder } from '@/lib/shared';

/**
 * Tech Service
 *
 * Manages business logic for the tech domain.
 */
export class TechService {
  private static metaBuilder = new MetaBuilder();

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
    if (!snapshots || snapshots.length === 0) {
      return null;
    }
    return snapshots[0]!;
  }

  /**
   * Format a tech score for display
   */
  static formatTechScore(score: number): string {
    return this.metaBuilder.formatTechScore(score);
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
    return this.metaBuilder.generateMetadataContent(tech, score);
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
    return this.metaBuilder.generateStructuredData(
      tech,
      score,
      latestSnapshot?.created_at || null,
      slug
    );
  }
}
