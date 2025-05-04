'use client';

import { Snapshot } from '@/domains/tech';
import { EthicalAd } from './EthicalAd';
import { ScoreIndicator } from '@/components/molecules';

interface TechMetricsSectionProps {
  latestSnapshot: Snapshot;
}

/**
 * TechMetricsSection component displays light overviews metrics about a technology.
 * Shows component scores for GitHub, Reddit, YouTube, StackOverflow,Jobs, Hacker News, and companies adoptions.
 *
 * @example
 * ```tsx
 * import { TechMetricsSection } from '@/components/organisms';
 *
 * <TechMetricsSection
 *   latestSnapshot={snapshotData}
 * />
 * ```
 */
export function TechMetricsSection({ latestSnapshot }: TechMetricsSectionProps) {
  const githubMetrics = latestSnapshot?.github_metrics || {};
  const redditMetrics = latestSnapshot?.reddit_metrics || {};
  const youtubeMetrics = latestSnapshot?.youtube_metrics || {};
  const soMetrics = latestSnapshot?.so_metrics || {};
  const jobsMetrics = latestSnapshot?.google_jobs || {};
  const hackerNewMetrics = latestSnapshot?.hn_metrics || {};
  const companiesMetrics = latestSnapshot?.stackshare_metrics || {};

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
          <div className="bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700 hover:shadow-lime-900/10 transition-all duration-300">
            <h3 className="text-lg font-bold mb-3 capitalize text-lime-300">Codebase Activity</h3>
            <ScoreIndicator score={githubMetrics.deaditude_score * 10} />
          </div>

          <div className="bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700 hover:shadow-lime-900/10 transition-all duration-300">
            <h3 className="text-lg font-bold mb-3 capitalize text-lime-300">Reddit Drama</h3>
            <ScoreIndicator score={redditMetrics.deaditude_score * 10} />
          </div>
          <div className="bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700 hover:shadow-lime-900/10 transition-all duration-300">
            <h3 className="text-lg font-bold mb-3 capitalize text-lime-300">Youtube Clickbaits</h3>
            <ScoreIndicator score={youtubeMetrics.deaditude_score * 10} />
          </div>
          <div className="bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700 hover:shadow-lime-900/10 transition-all duration-300">
            <h3 className="text-lg font-bold mb-3 capitalize text-lime-300">
              Stackoverflow copypasting
            </h3>
            <ScoreIndicator score={soMetrics.deaditude_score * 10} />
          </div>
          <div className="bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700 hover:shadow-lime-900/10 transition-all duration-300">
            <h3 className="text-lg font-bold mb-3 capitalize text-lime-300">Job offering</h3>
            <ScoreIndicator score={jobsMetrics.deaditude_score * 10} />
          </div>

          <div className="bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700 hover:shadow-lime-900/10 transition-all duration-300">
            <h3 className="text-lg font-bold mb-3 capitalize text-lime-300">Companies adoption</h3>
            <ScoreIndicator score={companiesMetrics.deaditude_score * 10} />
          </div>
          <div className="bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700 hover:shadow-lime-900/10 transition-all duration-300">
            <h3 className="text-lg font-bold mb-3 capitalize text-lime-300">Hacker News Hype</h3>
            <ScoreIndicator score={hackerNewMetrics.deaditude_score * 10} />
          </div>
        </div>
      </section>
    </>
  );
}
