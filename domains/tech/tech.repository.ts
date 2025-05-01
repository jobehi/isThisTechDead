import supabase from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/errors';
import { Project, Snapshot, Tech, TechDetails } from './tech.types';

/**
 * Tech Repository
 *
 * Handles data access for the tech domain.
 */
export class TechRepository {
  /**
   * Get a tech by its ID
   */
  static async getTechById(id: string): Promise<Tech | null> {
    try {
      const { data, error } = await supabase
        .from('tech_registry')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      // Convert to not found if single() didn't find anything
      if (error instanceof Error && error.message.includes('not found')) {
        return null;
      }
      handleSupabaseError(error, 'Get tech by id');
    }
  }

  /**
   * Get all techs
   */
  static async getAllTechs(): Promise<Tech[]> {
    try {
      const { data, error } = await supabase
        .from('tech_registry')
        .select('*')
        .order('name')
        .limit(1000);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'Get all techs');
    }
  }

  /**
   * Get snapshots for a tech
   */
  static async getSnapshotsByTechId(techId: string): Promise<Snapshot[]> {
    try {
      const { data, error } = await supabase
        .from('tech_snapshots')
        .select('*')
        .eq('tech_id', techId)
        .order('snapshot_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'Get snapshots by tech id');
    }
  }

  /**
   * Get the latest snapshot for a tech
   */
  static async getLatestSnapshotByTechId(techId: string): Promise<Snapshot | null> {
    try {
      const { data, error } = await supabase
        .from('tech_snapshots')
        .select('*')
        .eq('tech_id', techId)
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // Not found is expected for new techs with no snapshots
        if (error.message?.includes('not found')) {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      // Single not found is expected and should return null
      if (error instanceof Error && error.message.includes('not found')) {
        return null;
      }
      handleSupabaseError(error, 'Get latest snapshot by tech id');
    }
  }

  /**
   * Get approved projects for a tech
   */
  static async getProjectsByTechId(techId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('tech_projects')
        .select('*')
        .eq('tech_id', techId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'Get projects by tech id');
    }
  }

  /**
   * Get the count of approved projects for a tech
   */
  static async getProjectCountByTechId(techId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('tech_projects')
        .select('*', { count: 'exact', head: true })
        .eq('tech_id', techId)
        .eq('is_approved', true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      handleSupabaseError(error, 'Get project count by tech id');
    }
  }

  /**
   * Get the count of respects paid to a tech
   */
  static async getRespectCount(techId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('respect_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('tech_id', techId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      handleSupabaseError(error, 'Get respect count');
    }
  }

  /**
   * Get all details for a tech by ID
   */
  static async getTechDetails(techId: string): Promise<TechDetails> {
    const tech = await this.getTechById(techId);

    if (!tech) {
      return { tech: null, snapshots: [], projects: [] };
    }

    // Parallel fetching for better performance
    const [snapshots, projects] = await Promise.all([
      this.getSnapshotsByTechId(tech.id),
      this.getProjectsByTechId(tech.id),
    ]);

    return { tech, snapshots, projects };
  }
}
