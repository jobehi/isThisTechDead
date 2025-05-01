import { ProjectRepository } from './project.repository';
import { Project, ProjectCreateInput, ProjectFilters, ProjectWithMeta } from './project.types';
import { AppError, ValidationError } from '@/lib/errors';
import { formatDistanceToNow } from 'date-fns';
import config from '@/lib/config';

/**
 * Project Service
 *
 * Manages business logic for the project domain.
 */
export class ProjectService {
  /**
   * Get a project by ID
   */
  static async getProjectById(id: number): Promise<Project> {
    const project = await ProjectRepository.getProjectById(id);

    if (!project) {
      throw AppError.notFound(`Project with ID "${id}" not found`);
    }

    return project;
  }

  /**
   * Get projects with filtering and pagination
   */
  static async getProjects(filters: ProjectFilters = {}): Promise<{
    projects: Project[];
    total: number;
  }> {
    return ProjectRepository.getProjects(filters);
  }

  /**
   * Create a new project with validation
   */
  static async createProject(project: ProjectCreateInput): Promise<Project> {
    // Check if project submission is enabled
    if (!config.features.enableProjectSubmission) {
      throw AppError.forbidden('Project submission is currently disabled');
    }

    // Validate project data
    const errors: Record<string, string> = {};

    if (!project.name.trim()) {
      errors.name = 'Project name is required';
    }

    if (!project.description.trim()) {
      errors.description = 'Project description is required';
    }

    if (!project.self_roast.trim()) {
      errors.self_roast = 'Self roast is required';
    }

    if (project.url && !isValidUrl(project.url)) {
      errors.url = 'Invalid URL format';
    }

    if (project.github_url && !isValidUrl(project.github_url)) {
      errors.github_url = 'Invalid GitHub URL format';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid project data', errors);
    }

    // Create the project
    return ProjectRepository.createProject(project);
  }

  /**
   * Get latest approved projects with enhanced metadata
   */
  static async getLatestProjects(limit: number = 6): Promise<ProjectWithMeta[]> {
    const projects = await ProjectRepository.getLatestProjects(limit);

    return projects.map(project => this.enhanceProjectWithMeta(project));
  }


  /**
   * Enhance a project with additional metadata
   */
  static enhanceProjectWithMeta(project: Project): ProjectWithMeta {
    return {
      ...project,
      tech_name: project.tech?.name || 'Unknown Tech',
      time_ago: formatDistanceToNow(new Date(project.created_at), { addSuffix: true }),
    };
  }
}

/**
 * Helper function to validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
