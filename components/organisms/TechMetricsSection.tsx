'use client';

import Link from 'next/link';
import { StatsCard, StatItem, StatRow } from '@/components/molecules';
import { Snapshot } from '@/domains/tech';
import { formatDate } from '@/lib/shared/utils';
import { EthicalAd } from './EthicalAd';
import { ScoreIndicator } from '@/components/molecules';

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
        <StatsCard
          title="GitHub Vitals"
          icon={
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          }
        >
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

        <StatsCard
          title="Stack Overflow Stats"
          hoverEffect="hover:shadow-sky-900/20"
          icon={
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.912 15.142c.453-.031.84-.099 1.146-.256a1.587 1.587 0 0 0 .67-.628 1.85 1.85 0 0 0 .21-.906 1.397 1.397 0 0 0-.244-.863 2.256 2.256 0 0 0-.737-.621 8.054 8.054 0 0 0-1.256-.513 17.354 17.354 0 0 1-1.256-.433 5.152 5.152 0 0 1-1.162-.574 2.588 2.588 0 0 1-.839-.862 2.535 2.535 0 0 1-.325-1.362c0-.486.117-.92.342-1.31.226-.389.563-.7 1.004-.933.442-.234.98-.35 1.615-.35.62 0 1.147.116 1.588.35.441.233.78.555 1.014.966.236.41.354.877.354 1.399h-1.995c0-.389-.117-.7-.34-.933a1.25 1.25 0 0 0-.885-.35c-.381 0-.678.105-.89.315-.214.21-.316.495-.316.858 0 .26.066.484.208.673.142.188.344.353.616.494.27.14.61.274 1.01.4.673.206 1.274.433 1.783.67.51.235.91.529 1.201.875.292.347.437.788.437 1.324 0 .76-.275 1.362-.827 1.798-.552.437-1.311.66-2.277.666-.673 0-1.287-.122-1.842-.364a2.845 2.845 0 0 1-1.284-1.063c-.312-.464-.47-1.018-.47-1.67h2.009c0 .49.125.864.375 1.129.25.264.684.396 1.296.396.37 0 .649-.093.839-.28a.973.973 0 0 0 .282-.724.883.883 0 0 0-.204-.596 1.893 1.893 0 0 0-.637-.443 11.08 11.08 0 0 0-1.09-.386 13.814 13.814 0 0 1-1.256-.433 4.666 4.666 0 0 1-1.148-.634 2.803 2.803 0 0 1-.84-.913c-.214-.362-.322-.811-.322-1.349 0-.76.234-1.4.7-1.917.467-.517 1.118-.771 1.951-.764.86 0 1.534.256 2.017.764.484.508.732 1.163.732 1.965h-1.995c0-.4-.107-.704-.33-.9-.224-.198-.518-.296-.881-.296a1.16 1.16 0 0 0-.732.227.773.773 0 0 0-.29.638c0 .233.074.437.222.611.148.174.35.328.611.46.26.133.591.263.994.39a5.901 5.901 0 0 1 3.24 2.252c.452.76.673 1.654.673 2.682 0 .797-.155 1.5-.458 2.113a3.213 3.213 0 0 1-1.335 1.423c-.59.34-1.28.52-2.075.537-.867 0-1.622-.162-2.264-.49-.643-.328-1.142-.779-1.5-1.353-.356-.574-.532-1.246-.532-2.018h1.995c0 .576.166 1.022.49 1.336.325.315.803.474 1.426.479zm7.263-2.667V15h-2.177v-7.75h2.177v5.227zM4.023 15V7.25h7.234v1.54H6.2v1.594h4.646v1.539H6.2v1.537h5.082V15H4.023zm7.087-12.094v1.25H.277v-1.25h10.833zm11.213 0v1.25H12.49v-1.25h9.833z" />
            </svg>
          }
        >
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
          icon={
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z" />
            </svg>
          }
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
          icon={
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          }
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
