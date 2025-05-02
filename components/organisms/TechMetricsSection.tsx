'use client';

import Link from 'next/link';
import { StatsCard, StatItem, StatRow } from '@/components/molecules';
import { Snapshot } from '@/domains/tech';
import { formatDate } from '@/lib/shared/utils';
import { EthicalAd } from './EthicalAd';
import { ScoreIndicator } from '@/components/molecules';
import { GithubIcon } from '../atoms/icons/GithubIcon';
import { RedditIcon } from '../atoms/icons/RedditIcon';
import { YoutubeIcon } from '../atoms/icons/YoutubeIcon';
interface TechMetricsSectionProps {
  latestSnapshot: Snapshot;
  techName: string;
}

/**
 * TechMetricsSection component displays detailed metrics about a technology.
 * Shows component scores, GitHub stats, Stack Overflow data, and more.
 *
 * @example
 * ```tsx
 * import { TechMetricsSection } from '@/components/organisms';
 *
 * <TechMetricsSection
 *   latestSnapshot={snapshotData}
 *   techName="React"
 * />
 * ```
 */
export function TechMetricsSection({ latestSnapshot, techName }: TechMetricsSectionProps) {
  const componentScores = latestSnapshot?.component_scores || {};
  const github_metrics = latestSnapshot?.github_metrics || {};
  const reddit_metrics = latestSnapshot?.reddit_metrics || {};
  const so_metrics = latestSnapshot?.so_metrics || {};
  const youtube_metrics = latestSnapshot?.youtube_metrics || {};
  const stackshare_metrics = latestSnapshot?.stackshare_metrics || {};
  const google_jobs = latestSnapshot?.google_jobs || {};

  return (
    <>
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-lime-300 flex items-center">
            <span className="mr-2">🔬</span>
            Component Breakdown
          </h2>
          <div className="text-xs text-zinc-500 italic">Dissecting the digital corpse</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center items-center">
            <EthicalAd type="image" className="horizontal" />
          </div>
          {(
            Object.entries(componentScores) as [
              string,
              { source?: string; deaditude_score: number },
            ][]
          ).map(([key, value]) => {
            const name = value.source || key;
            const score = value.deaditude_score * 10;
            return (
              <div
                key={key}
                className="bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700 hover:shadow-lime-900/10 transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-3 capitalize text-lime-300">{name}</h3>
                <ScoreIndicator score={score} />
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <StatsCard title="GitHub Vitals" icon={<GithubIcon />}>
          <div className="grid grid-cols-2 gap-3">
            <StatItem
              label="Stars"
              value={
                <Link
                  href={`https://github.com/${github_metrics.main_repo?.stars ? github_metrics.main_repo.stars.toLocaleString() : '—'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {github_metrics.main_repo?.stars?.toLocaleString() ?? '—'}
                </Link>
              }
            />
            <StatItem
              label="Forks"
              value={github_metrics.main_repo?.forks?.toLocaleString() ?? '—'}
              color="text-lime-200"
            />
            <StatItem
              label="Active Contributors"
              value={github_metrics.main_repo?.stats_summary?.active_contributors_last_month ?? '—'}
              color="text-lime-200"
            />
            <StatItem
              label="Recent Commits"
              value={github_metrics.main_repo?.stats_summary?.commits_last_month ?? '—'}
              color="text-lime-200"
            />
          </div>

          <div className="mt-4 text-sm text-zinc-300 space-y-2">
            <StatRow label="Open Issues" value={github_metrics.main_repo?.open_issues ?? '—'} />
            <StatRow
              label="Latest Release"
              value={
                github_metrics.main_repo?.latest_tag?.name
                  ? `${github_metrics.main_repo?.latest_tag?.name} (${formatDate(github_metrics.main_repo?.latest_tag?.date ?? '')})`
                  : '—'
              }
            />
            <StatRow
              label="Avg PR Age"
              value={
                github_metrics.main_repo?.pr_age_metrics?.avg_days_open
                  ? `${github_metrics.main_repo.pr_age_metrics.avg_days_open} days`
                  : '—'
              }
            />
          </div>
        </StatsCard>

        <StatsCard title="Stack Overflow Stats" hoverEffect="hover:shadow-sky-900/20">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatItem
              label="Unanswered"
              value={so_metrics?.so_zero_answer_count ?? '—'}
              color="text-orange-300"
            />
            <StatItem
              label="Accepted"
              value={so_metrics?.so_accepted_answers ?? '—'}
              color="text-green-300"
            />
            <StatItem
              label="Avg Views"
              value={so_metrics?.so_avg_views ?? '—'}
              color="text-blue-300"
            />
          </div>
        </StatsCard>

        <StatsCard
          title="Reddit Activity"
          hoverEffect="hover:shadow-orange-900/20"
          icon={<RedditIcon />}
        >
          {reddit_metrics.top_internal_posts && reddit_metrics.top_internal_posts.length > 0 ? (
            <div className="space-y-3">
              {reddit_metrics.top_internal_posts
                .slice(0, 3)
                .map((post: { title: string; subreddit: string; upvotes: number }, i: number) => (
                  <div key={i} className="bg-zinc-700/50 p-3 rounded-lg">
                    <div className="text-zinc-200 text-sm line-clamp-2">{post.title}</div>
                    <div className="text-orange-200 text-xs mt-1 flex items-center justify-between">
                      <span>r/{post.subreddit}</span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 14l5-5 5 5H7z" />
                        </svg>
                        {post.upvotes}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-zinc-400 italic bg-zinc-800/50 p-4 rounded-lg">
              No Reddit data available. Not even the meme lords care anymore.
            </div>
          )}
        </StatsCard>

        <StatsCard
          title="Community Pulse"
          hoverEffect="hover:shadow-purple-900/20"
          icon={<YoutubeIcon />}
        >
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-zinc-700/50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span className="text-zinc-400 text-xs">Indeed Jobs, a.k.a. your hope index</span>
                <span className="text-blue-200 font-semibold">
                  <a
                    href={`https://www.indeed.com/jobs?q=${techName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-blue-300"
                  >
                    {google_jobs.count?.toLocaleString() ?? '—'}
                  </a>
                </span>
              </div>
            </div>
            <div className="bg-zinc-700/50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span className="text-zinc-400 text-xs">StackShare Companies</span>
                <span className="text-green-200 font-semibold">
                  <a
                    href={`https://stackshare.io/${techName.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-200 hover:text-green-300"
                  >
                    {stackshare_metrics?.stackshare_companies_count ?? '—'}
                  </a>
                </span>
              </div>
            </div>
            <div className="bg-zinc-700/50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span className="text-zinc-400 text-xs">
                  YouTube Views, possibly clickbaits (30d)
                </span>
                <span className="text-red-200 font-semibold">
                  {youtube_metrics?.metrics?.total_views
                    ? youtube_metrics.metrics.total_views.toLocaleString()
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </StatsCard>
      </div>
    </>
  );
}
