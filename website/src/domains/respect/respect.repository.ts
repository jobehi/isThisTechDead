import { supabase } from '@/lib/supabase';
import { RespectEntry, RespectCountsMap } from './respect.types';
import { handleSupabaseError } from '@/lib/errors';
import { DB_TABLES } from '@/lib/config';

// Define the response type from the count query
interface RespectCountResult {
  tech_id: string;
  count: number;
}

/**
 * Repository for handling respect tracking data
 */
export class RespectRepository {
  /**
   * Add a respect entry for a tech
   * @param respectEntry The respect entry to add
   */
  async addRespect(respectEntry: RespectEntry): Promise<void> {
    const { error } = await supabase.from(DB_TABLES.RESPECT_TRACKING).insert({
      tech_id: respectEntry.tech_id,
      tech_name: respectEntry.tech_name,
    });

    if (error) {
      handleSupabaseError(error, 'Adding respect');
    }
  }

  /**
   * Get the respect count for a tech
   * @param techId The tech ID to get the count for
   * @returns The respect count
   */
  async getRespectCount(techId: string): Promise<number> {
    const { count, error } = await supabase
      .from(DB_TABLES.RESPECT_TRACKING)
      .select('*', { count: 'exact', head: true })
      .eq('tech_id', techId);

    if (error) {
      handleSupabaseError(error, 'Getting respect count');
    }

    return count || 0;
  }

  /**
   * Get respect counts for all techs
   * @returns A map of tech IDs to respect counts
   */
  async getAllRespectCounts(techIds: string[]): Promise<RespectCountsMap> {
    const counts: Record<string, number> = {};

    // Initialize all tech IDs with zero count
    techIds.forEach(techId => {
      counts[techId] = 0;
    });

    try {
      // Note: Using raw SQL query via rpc call for aggregation since select count(*)
      // requires different approach with Supabase JS client
      const { data, error } = await supabase.rpc('get_respect_counts_by_tech', {
        tech_ids: techIds,
      });

      if (error) {
        handleSupabaseError(error, 'Getting all respect counts');
      }

      // Update counts from the query results
      if (data && Array.isArray(data)) {
        (data as RespectCountResult[]).forEach(item => {
          counts[item.tech_id] = item.count;
        });
      }
    } catch (error) {
      handleSupabaseError(error, 'Getting all respect counts');
    }

    return counts;
  }

  /**
   * Get all tech IDs from the tech registry
   * @returns An array of tech IDs
   */
  async getAllTechIds(): Promise<string[]> {
    const { data, error } = await supabase.from(DB_TABLES.TECH_REGISTRY).select('id');

    if (error) {
      handleSupabaseError(error, 'Getting all tech IDs');
    }

    return data.map(tech => tech.id);
  }
}
