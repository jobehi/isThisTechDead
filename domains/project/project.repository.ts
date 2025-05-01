import supabase from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/errors';
import { Project, ProjectCreateInput, ProjectFilters } from './project.types';

/**
 * Project Repository
 *
 * Handles data access for the project domain.
 */
export class ProjectRepository {
  /**
   * Get a project by ID
   */
  static async getProjectById(id: number): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('tech_projects')
        .select('*, tech:tech_registry(id, name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return null;
      }
      handleSupabaseError(error, 'Get project by id');
    }
  }

  /**
   * Get projects with filtering and pagination
   */
  static async getProjects(filters: ProjectFilters = {}): Promise<{
    projects: Project[];
    total: number;
  }> {
    try {
      const {
        tech_id,
        is_approved = true,
        limit = 100,
        offset = 0,
        sort_by = 'created_at',
        sort_order = 'desc',
      } = filters;

      // Build query
      let query = supabase
        .from('tech_projects')
        .select('*, tech:tech_registry(id, name)', { count: 'exact' });

      // Apply filters
      query = query.eq('is_approved', is_approved);

      if (tech_id) {
        query = query.eq('tech_id', tech_id);
      }

      // Apply sorting and pagination
      query = query
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        projects: data || [],
        total: count || 0,
      };
    } catch (error) {
      handleSupabaseError(error, 'Get projects');
    }
  }

  /**
   * Create a new project
   */
  static async createProject(project: ProjectCreateInput): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('tech_projects')
        .insert([
          {
            ...project,
            is_approved: false,
          },
        ])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error, 'Create project');
    }
  }

  /**
   * Get latest approved projects
   */
  static async getLatestProjects(limit: number = 6): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('tech_projects')
        .select('*, tech:tech_registry(id, name)')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'Get latest projects');
    }
  }
  
}
