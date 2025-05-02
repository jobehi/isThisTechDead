/**
 * Project Domain Types
 *
 * Type definitions for the project domain model.
 */

/**
 * Project entity with optional tech relation
 */
export interface Project {
  id: number;
  tech_id: string;
  name: string;
  url: string | null;
  github_url: string | null;
  description: string;
  self_roast: string;
  screenshot_url: string | null;
  is_approved: boolean;
  created_at: string;
  approved_at: string | null;

  // Relations (optional)
  tech?: {
    id: string;
    name: string;
  };
}

/**
 * Project creation payload
 */
export type ProjectCreateInput = Omit<
  Project,
  'id' | 'is_approved' | 'created_at' | 'approved_at' | 'tech'
>;

/**
 * Project with additional metadata
 */
export interface ProjectWithMeta extends Project {
  tech_name: string;
  time_ago: string;
}

/**
 * Project filters for listing
 */
export interface ProjectFilters {
  tech_id?: string;
  is_approved?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'name';
  sort_order?: 'asc' | 'desc';
}

/**
 * Project listing response
 */
export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
