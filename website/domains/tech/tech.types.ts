/**
 * Tech Domain Types
 *
 * Type definitions for the tech domain model.
 */

import { Project } from '../project';

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
  creation_year?: number;
  subreddit?: string;
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
export interface GithubLanguage {
  name: string;
  percentage: number;
}
export interface GitHubMetrics {
  deaditude_score: number;
  statistics?: {
    participation?: {
      all?: number[];
      owner?: number[];
    };
  };
  languages?: GithubLanguage[];

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
  deaditude_score: number;
  raw: {
    posts?: Array<{
      title: string;
      url: string;
      sub: number;
      num_comments: number;
      score: number;
      upvote_ratio: number;
      created: string;
    }>;
  };
  avg_sentiment?: number;
  post_count?: number;
  trend_metrics?: {
    growth_rate?: number;
    trend_direction?: string;
  };
  subreddit_metrics?: {
    subscribers?: number;
    active_users?: number;
  };
  migration_mentions: number;
}

/**
 * Hacker News metrics
 */
export interface HackerNewsMetrics {
  deaditude_score: number;

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
  raw: {
    questions?: Array<StackOverflowQuestion>;
  };
  deaditude_score: number;
}

/**
 * StackOverflow question details
 */
export interface StackOverflowQuestion {
  title: string;
  link: string;
  is_answered: boolean;
  view_count: number;
  tags?: Array<string>;
  answer_count: number;
  last_activity_date: string;
}

/**
 * YouTube metrics
 */
export interface YouTubeMetrics {
  deaditude_score: number;
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
  deaditude_score: number;
}

/**
 * Google Jobs metrics
 */
export interface GoogleJobsMetrics {
  deaditude_score: number;
  by_country?: {
    ca: number;
    us: number;
    gb: number;
    fr: number;
    de: number;
    in: number;
  };
  source: string;
}

/**
 * Tech Snapshot - a point-in-time record of metrics
 */
export interface Snapshot {
  id: string;
  tech_id: string;
  tech_name: string;
  snapshot_date: string;
  created_at: string;

  // Overall scores
  deaditude_score: number;
  component_scores: Record<string, ComponentScore>;
  confidence_score?: number;
  verdict?: string;

  // GitHub metrics
  github_metrics: GitHubMetrics;
  github_stars?: number;
  github_forks?: number;
  github_commits_last_month?: number;
  github_issues_open?: number;
  github_issues_closed_ratio?: number;
  github_days_since_last_commit?: number;
  github_contributors_count?: number;
  github_trend_direction?: string;
  github_trend_growth_rate?: number;
  github_quality?: number;

  // Stack Overflow metrics
  so_metrics: StackOverflowMetrics;
  so_trend_direction?: string;
  so_trend_growth_rate?: number;
  so_period_counts?: Record<string, number>;
  so_total_questions?: number;
  so_answered_ratio?: number;
  so_accepted_ratio?: number;
  so_zero_answer_ratio?: number;
  so_median_response_hr?: number;
  so_last_activity_days?: number;
  so_quality?: number;

  // YouTube metrics
  youtube_metrics: YouTubeMetrics;
  youtube_trend_direction?: string;
  youtube_trend_growth_rate?: number;
  youtube_period_counts?: Record<string, number>;
  youtube_video_count?: number;
  youtube_avg_views?: number;
  youtube_days_since_last?: number;
  youtube_quality?: number;

  // Reddit metrics
  reddit_metrics: RedditMetrics;
  reddit_post_count?: number;
  reddit_avg_upvotes?: number;
  reddit_trend_direction?: string;
  reddit_trend_growth_rate?: number;
  reddit_quality?: number;

  // Hacker News metrics
  hn_metrics: HackerNewsMetrics;
  hn_post_count?: number;
  hn_avg_points?: number;
  hn_avg_comments?: number;
  hn_days_since_last?: number;
  hn_trend_direction?: string;
  hn_quality?: number;

  // StackShare metrics
  stackshare_metrics: StackShareMetrics;
  stackshare_stacks_count?: number;
  stackshare_followers?: number;
  stackshare_upvotes?: number;
  stackshare_mentions?: number;
  stackshare_quality?: number;

  // Google Jobs metrics
  google_jobs: GoogleJobsMetrics;
  google_jobs_count?: number;
  google_jobs_trend_direction?: string;
  google_jobs_trend_growth_rate?: number;
  google_jobs_quality?: number;
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
