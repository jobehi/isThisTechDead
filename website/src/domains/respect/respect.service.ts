import { RespectRepository } from './respect.repository';
import { RespectCountResponse, RespectCountsResponse } from './respect.types';
import config from '@/lib/config';

/**
 * Service for handling respect tracking business logic
 */
export class RespectService {
  private repository: RespectRepository;
  private featureEnabled: boolean;

  /**
   * Create a new instance of RespectService
   * @param repository Optional repository instance for dependency injection
   */
  constructor(repository?: RespectRepository) {
    this.repository = repository || new RespectRepository();
    this.featureEnabled = config.features.enablePressF;
  }

  /**
   * Pay respects to a tech
   * @param techId The tech ID to pay respects to
   * @param techName The tech name
   * @returns Response with success status and count
   */
  async payRespects(techId: string, techName: string): Promise<RespectCountResponse> {
    try {
      // Check if the feature is enabled
      if (!this.featureEnabled) {
        return {
          success: false,
          disabled: true,
          message: "The 'Press F to Pay Respects' feature is currently disabled.",
          count: null,
        };
      }

      // Add the respect entry
      await this.repository.addRespect({
        tech_id: techId,
        tech_name: techName,
      });

      // Get the updated count
      const count = await this.repository.getRespectCount(techId);

      return {
        success: true,
        message: 'F to pay respects',
        count,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to pay respects',
        count: null,
      };
    }
  }

  /**
   * Get the respect count for a tech
   * @param techId The tech ID to get the count for
   * @returns Response with success status and count
   */
  async getRespectCount(techId: string): Promise<RespectCountResponse> {
    try {
      const count = await this.repository.getRespectCount(techId);

      return {
        success: true,
        count,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to count respects',
        count: null,
      };
    }
  }

  /**
   * Get respect counts for all techs
   * @returns Response with success status and counts map
   */
  async getAllRespectCounts(): Promise<RespectCountsResponse> {
    try {
      // Get all tech IDs first
      const techIds = await this.repository.getAllTechIds();

      // Get counts for all techs
      const counts = await this.repository.getAllRespectCounts(techIds);

      return {
        success: true,
        counts,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get respect counts',
        counts: {},
      };
    }
  }
}
