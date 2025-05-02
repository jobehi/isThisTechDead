/**
 * Tech Domain Types
 *
 * Type definitions for the tech domain model.
 */

import { Project } from "../project";

/**
 * Core Tech entity
 */
export interface Tech {
  id: string;
  name: string;
  description?: string;
  github_repo?: string;
  owner?: string;
  repo?: string;
  stackshare_slug?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Tech with score and additional metrics
 */
export interface TechWithScore extends Tech {
  latest_score: number | null;
  latest_snapshot_date: string | null;
  respect_count: number;
  project_count: number;
}

/**
 * Component score from various sources
 */
export interface ComponentScore {
  source?: string;
  deaditude_score: number;
}

/**
 * GitHub-specific metrics
 */
export interface GitHubMetrics {
  main_repo?: {
    stars?: number;
    forks?: number;
    open_issues?: number;
    latest_tag?: {
      name: string;
      date: string;
    };
    pr_age_metrics?: {
      avg_days_open: number;
    };
    stats_summary?: {
      active_contributors_last_month: number;
      commits_last_month: number;
    };
  };
}

/**
 * Reddit-specific metrics
 */
export interface RedditMetrics {
  top_internal_posts?: Array<{
    title: string;
    subreddit: string;
    upvotes: number;
    url?: string;
  }>;
}

/**
 * Hacker News metrics
 */
export interface HackerNewsMetrics {
  metrics?: {
    avg_karma: number;
    top_posts?: Array<{
      title: string;
      url: string;
      score: number;
    }>;
  };
}

/**
 * StackOverflow metrics
 */
export interface StackOverflowMetrics {
  so_zero_answer_count?: number;
  so_accepted_answers?: number;
  so_avg_views?: number;
  top_questions?: Array<{
    title: string;
    url: string;
    score: number;
    view_count: number;
  }>;
}

/**
 * YouTube metrics
 */
export interface YouTubeMetrics {
  metrics?: {
    total_views?: number;
    days_since_last_upload?: number;
    top_videos?: Array<{
      title: string;
      url: string;
      view_count: number;
    }>;
  };
}

/**
 * StackShare metrics
 */
export interface StackShareMetrics {
  stackshare_companies_count?: number;
  top_companies?: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Google Jobs metrics
 */
export interface GoogleJobsMetrics {
  count?: number;
  trend?: 'up' | 'down' | 'stable';
  percent_change?: number;
}

/**
 * Tech Snapshot - a point-in-time record of metrics
 */
export interface Snapshot {
  id: string;
  tech_id: string;
  snapshot_date: string;
  created_at: string;
  deaditude_score: number;
  component_scores: Record<string, ComponentScore>;
  github_metrics: GitHubMetrics;
  reddit_metrics: RedditMetrics;
  hn_metrics: HackerNewsMetrics;
  so_metrics: StackOverflowMetrics;
  youtube_metrics: YouTubeMetrics;
  stackshare_metrics: StackShareMetrics;
  google_jobs: GoogleJobsMetrics;
}


/**
 * Complete tech details with snapshots and projects
 */
export interface TechDetails {
  tech: Tech | null;
  snapshots: Snapshot[];
  projects: Project[];
}

/**
 * Respect record - when a user pays respects to a dead tech
 */
export interface Respect {
  id: string;
  tech_id: string;
  message?: string;
  created_at: string;
  ip_hash?: string;
}
