import React, { useMemo } from 'react';
import Link from 'next/link';
import { EthicalAd } from '@/components/organisms';
import { formatDate, getScoreColor, calculateDeaditudeScore } from '@/lib/shared';
import type { TechWithScore as Tech } from '@/domains';

interface TechGridProps {
  techs: Tech[];
  /**
   * Function returning respect count. Defaults to reading `tech.respect_count`.
   */
  getRespectCount?: (tech: Tech) => number;
  className?: string;
}

// Helper functions for rating display – duplicated from Home for isolation.
function getRatingTagClass(score: number): string {
  if (score >= 75) return 'bg-red-500 text-white';
  if (score >= 50) return 'bg-orange-500 text-white';
  if (score >= 25) return 'bg-blue-500 text-white';
  return 'bg-green-500 text-black';
}

function getRatingLabel(score: number): string {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'Endangered';
  if (score >= 25) return 'Stable';
  return 'Healthy';
}

/**
 * TechGrid – renders a responsive grid of tech cards with interleaved ads.
 * All markup is copied verbatim from the original Home.tsx implementation to ensure identical UI.
 */
export function TechGrid({
  techs,
  getRespectCount = t => t.respect_count,
  className = '',
}: TechGridProps) {
  // Build tech+ad list (ads at positions 5, 10, 15)
  const items = useMemo(() => {
    const techItems = techs.map(tech => ({ type: 'tech' as const, tech }));
    const result: { type: 'tech' | 'ad'; tech?: Tech; position?: number }[] = [...techItems];
    [5, 10, 15].forEach(pos => {
      if (pos < result.length) {
        result.splice(pos, 0, { type: 'ad', position: pos });
      }
    });
    return result;
  }, [techs]);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`.trim()}>
      {items.map(item => {
        if (item.type === 'ad') {
          return (
            <div key={`ad-${item.position}`} className="block transition-all duration-300">
              <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/80 hover:border-zinc-700">
                <div className="flex justify-center items-center mb-3">
                  {/* Always image ad in grid */}
                  <EthicalAd type="image" className="horizontal" />
                </div>
              </div>
            </div>
          );
        }

        const tech = item.tech!;
        return (
          <Link
            key={tech.id}
            href={`/${tech.id}`}
            className="block transition-all duration-300 hover:-translate-y-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/80 hover:border-zinc-700">
              {/* Death Rating Tag */}
              <div
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${getRatingTagClass(calculateDeaditudeScore(tech.latest_score))}`}
              >
                {getRatingLabel(calculateDeaditudeScore(tech.latest_score))}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-lime-300 transition-colors mb-3 truncate pr-20">
                  {tech.name}
                </h3>

                <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out group-hover:animate-pulse"
                    style={{
                      width: `${calculateDeaditudeScore(tech.latest_score)}%`,
                      backgroundColor: getScoreColor(calculateDeaditudeScore(tech.latest_score)),
                      boxShadow: `0 0 10px ${getScoreColor(calculateDeaditudeScore(tech.latest_score))}`,
                    }}
                  ></div>
                  <div className="absolute top-0 right-2 h-full flex items-center text-xs font-bold">
                    <span
                      className="drop-shadow-[0_0_3px_rgba(0,0,0,1)]"
                      style={{
                        color: getScoreColor(calculateDeaditudeScore(tech.latest_score)),
                      }}
                    >
                      {calculateDeaditudeScore(tech.latest_score).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="text-sm text-zinc-400 mb-4 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-lime-500 mr-2 opacity-60"></span>
                  {tech.latest_snapshot_date
                    ? `Last updated: ${formatDate(tech.latest_snapshot_date)}`
                    : 'No update date available'}
                </div>

                {/* Respect count */}
                <div className="text-sm text-zinc-400 mb-2 flex items-center h-[30px]">
                  <span className="inline-block text-purple-400 mr-2">🙏</span>
                  <span>
                    {getRespectCount(tech) > 0
                      ? `${getRespectCount(tech)} ${getRespectCount(tech) === 1 ? 'dev has' : 'devs have'} paid respects`
                      : 'No respects paid yet'}{' '}
                    {tech.project_count > 0 &&
                      `and ${tech.project_count} ${tech.project_count === 1 ? 'dev has' : 'devs have'} submitted projects`}
                  </span>
                </div>

                <div className="mt-4 flex justify-end items-center text-lime-500 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                  See details
                  <svg
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
