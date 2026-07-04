import supabase, { withSupabaseErrorContext } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/errors';
import { Snapshot, Tech, TechDetails } from './tech.types';
import { Project } from '../project';
import { DB_TABLES } from '@/lib/config';

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
    return withSupabaseErrorContext<Tech | null>('Get tech by id')(async () => {
      const { data, error } = await supabase
        .from(DB_TABLES.TECH_REGISTRY)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    });
  }

  /**
   * Get all techs
   */
  static async getAllTechs(): Promise<Tech[]> {
    try {
      // Query techs that have at least one snapshot in the v2 table
      const { data, error } = await supabase
        .from(DB_TABLES.TECH_REGISTRY)
        .select(
          `
          *,
          snapshots:${DB_TABLES.TECH_SNAPSHOTS}(id)
        `
        )
        .not('snapshots', 'is', null)
        .order('name')
        .limit(1000);

      if (error) throw error;

      return data;
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
        .from(DB_TABLES.TECH_SNAPSHOTS)
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
        .from(DB_TABLES.TECH_SNAPSHOTS)
        .select('*')
        .eq('tech_id', techId)
        .order('snapshot_date', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching latest snapshot:', error);
      // If there's an error, return null instead of throwing
      return null;
    }
  }

  /**
   * Get approved projects for a tech
   */
  static async getProjectsByTechId(techId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.TECH_PROJECTS)
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
        .from(DB_TABLES.TECH_PROJECTS)
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
        .from(DB_TABLES.RESPECT_TRACKING)
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
