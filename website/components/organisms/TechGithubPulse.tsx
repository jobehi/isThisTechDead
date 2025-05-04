'use client';

import { GithubLanguage, Snapshot } from '@/domains';
import { GithubIcon } from '../atoms/icons/GithubIcon';
import { useState } from 'react';

interface GithubSectionProps {
  last_snapshot: Snapshot;
}

function getActivityState(participationData?: number[] | null): string {
  if (!participationData || !Array.isArray(participationData) || participationData.length < 4) {
    return 'No data';
  }

  // Calculate recent vs earlier activity
  const recent = participationData.slice(-12).reduce((sum, val) => sum + val, 0);
  const earlier = participationData.slice(-24, -12).reduce((sum, val) => sum + val, 0);

  // Calculate trend percentage
  const trend = earlier > 0 ? ((recent - earlier) / earlier) * 100 : 0;

  if (trend > 50) return 'Accelerating';
  if (trend > 10) return 'Growing';
  if (trend > -10) return 'Stable';
  if (trend > -50) return 'Declining';
  return 'Stagnant';
}
function getLanguageColor(language: string): string {
  const colors: { [key: string]: string } = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    TypeScript: '#2b7489',
    CSharp: '#178600',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    // Add more languages and their colors as needed
  };

  // randomise a color if not found
  return colors[language] || `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
}

export function GithubSection({ last_snapshot }: GithubSectionProps) {
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const github_metrics = last_snapshot?.github_metrics || {};
  const github_stars = last_snapshot.github_stars || 0;
  const github_forks = last_snapshot.github_forks || 0;
  const github_commits_last_month = last_snapshot.github_commits_last_month || 0;
  const github_issues_open = last_snapshot.github_issues_open || 0;
  const github_contributors_count = last_snapshot.github_contributors_count || 0;
  const github_participation = github_metrics?.statistics?.participation?.all || [];

  const deadnessLevel = github_metrics.deaditude_score || 5;

  // Get status label based on deaditude score
  const getStatusLabel = () => {
    if (deadnessLevel > 8) return { label: 'Abandoned', color: 'text-red-500 bg-red-900/20' };
    if (deadnessLevel > 6) return { label: 'Declining', color: 'text-orange-400 bg-orange-900/20' };
    if (deadnessLevel > 4)
      return { label: 'Maintenance Mode', color: 'text-yellow-400 bg-yellow-900/20' };
    if (deadnessLevel > 2) return { label: 'Stable', color: 'text-blue-400 bg-blue-900/20' };
    return { label: 'Active Development', color: 'text-green-400 bg-green-900/20' };
  };

  const status = getStatusLabel();

  return (
    <>
      <section className="mb-8 bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-lime-300 flex items-center">
            <span className="mr-2">
              {' '}
              <GithubIcon />
            </span>{' '}
            GitHub Pulse
          </h2>
          <div className="flex items-center">
            <div className={`text-sm font-medium ${status.color} px-3 py-1 rounded-full`}>
              {status.label}
            </div>
            <button
              onClick={() => setShowScoreInfo(!showScoreInfo)}
              className="ml-2 text-zinc-400 hover:text-lime-300 transition-colors text-xs underline"
              aria-label="Show deaditude score calculation information"
            >
              How is this calculated?
            </button>
          </div>
        </div>

        {showScoreInfo && (
          <div className="mb-4 p-3 bg-zinc-900/70 rounded-lg border border-zinc-700 text-sm">
            <h3 className="text-lime-300 font-medium mb-1">
              How the GitHub deaditude score is calculated:
            </h3>
            <p className="text-zinc-300 mb-2">
              Our algorithm analyzes GitHub repository activity using these key factors:
            </p>
            <ul className="text-zinc-400 space-y-1 ml-4 list-disc">
              <li>
                <span className="font-medium">Commit activity (last 30 days)</span>:
                <ul className="ml-4 mt-1 list-circle">
                  <li>No commits: +3.0 penalty</li>
                  <li>1-9 commits: +2.0 penalty</li>
                  <li>10-29 commits: +1.0 penalty</li>
                  <li>30-49 commits: -1.0 bonus</li>
                  <li>50+ commits: -2.0 bonus</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">PR age</span>: Penalties based on average age of open
                PRs
                <ul className="ml-4 mt-1 list-circle">
                  <li>90-180 days: +1.0 penalty</li>
                  <li>180+ days: +2.0 penalty</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Latest release</span>: Penalties for outdated or
                missing releases
                <ul className="ml-4 mt-1 list-circle">
                  <li>60-365 days old: +1.0 penalty</li>
                  <li>365+ days old: +2.0 penalty</li>
                  <li>No releases: +2.0 penalty</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Stars</span>: Bonuses for popularity
                <ul className="ml-4 mt-1 list-circle">
                  <li>10,000-50,000 stars: -1.0 bonus</li>
                  <li>50,000-100,000 stars: -2.0 bonus</li>
                  <li>100,000+ stars: -3.0 bonus</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Contributors</span>: Bonuses for community involvement
                <ul className="ml-4 mt-1 list-circle">
                  <li>5-20 contributors: -1.0 bonus</li>
                  <li>20-50 contributors: -1.5 bonus</li>
                  <li>50+ contributors: -2.0 bonus</li>
                </ul>
              </li>
            </ul>
            <div className="mt-3 bg-zinc-800/60 p-2 rounded border border-zinc-700">
              <code className="text-xs text-lime-300 font-mono leading-relaxed">
                score = 5.0 (baseline) + penalties - bonuses
                <br />
                deaditude = max(0, min(10, score))
              </code>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Weekly Commit Activity</h3>
              <div className="h-24 flex items-end">
                {github_participation.map((count, idx) => {
                  // Calculate color based on commit count
                  const intensity = Math.min(1, count / 100);
                  const color =
                    count > 0
                      ? `rgba(74, 222, 128, ${Math.max(0.2, intensity)})`
                      : 'rgba(74, 222, 128, 0.05)';

                  return (
                    <div
                      key={idx}
                      className="w-full flex-grow mx-0.5 rounded-sm"
                      style={{
                        height: `${Math.min(100, count)}%`,
                        backgroundColor: color,
                        minHeight: '4px',
                      }}
                      title={`Week ${idx + 1}: ${count} commits`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>52 weeks ago</span>
                <span>Now</span>
              </div>

              {/* Commit Stats */}
              <div className="grid md:grid-cols-3 grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Stars</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {github_stars?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-zinc-500">total stars</div>
                </div>

                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Forks</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {github_forks?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-zinc-500">total forks</div>
                </div>

                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Open PRs</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {github_issues_open?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-zinc-500">open pull requests</div>
                </div>

                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Recent Commits</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {github_commits_last_month || '0'}
                  </div>
                  <div className="text-xs text-zinc-500">last 30 days</div>
                </div>

                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Contributors</div>
                  <div className="text-2xl font-bold text-lime-400">
                    {github_contributors_count || '0'}
                  </div>
                  <div className="text-xs text-zinc-500">active developers</div>
                </div>

                <div className="bg-zinc-800/60 p-3 rounded-lg">
                  <div className="text-xs text-zinc-400">Pulse Check</div>
                  <div className="text-xl font-bold text-lime-400">
                    {getActivityState(github_metrics.statistics?.participation?.all)}
                  </div>
                  <div className="text-xs text-zinc-500">trend assessment</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Distribution - only show if we have data */}
        {github_metrics.languages && github_metrics.languages.length > 0 && (
          <div>
            <div className="bg-zinc-900/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Language Distribution</h3>
              <div className="space-y-3">
                {github_metrics.languages.slice(0, 5).map((lang: GithubLanguage, idx: number) => (
                  //TODO: add a navigation to the language page
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-300">{lang.name}</span>
                      <span className="text-zinc-400">{lang.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: getLanguageColor(lang.name),
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
