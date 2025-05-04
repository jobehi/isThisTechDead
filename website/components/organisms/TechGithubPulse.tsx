import { GithubLanguage, Snapshot } from '@/domains';
import { GithubIcon } from '../atoms/icons/GithubIcon';

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
  const github_metrics = last_snapshot?.github_metrics || {};
  const github_stars = last_snapshot.github_stars || 0;
  const github_forks = last_snapshot.github_forks || 0;
  const github_commits_last_month = last_snapshot.github_commits_last_month || 0;
  const github_issues_open = last_snapshot.github_issues_open || 0;
  const github_contributors_count = last_snapshot.github_contributors_count || 0;
  const github_participation = github_metrics?.statistics?.participation?.all || [];
  return (
    <>
      <section className="mb-8 bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700">
        <h2 className="text-xl font-bold mb-4 text-lime-300 flex items-center">
          <span className="mr-2">
            {' '}
            <GithubIcon />
          </span>{' '}
          GitHub Pulse
        </h2>

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
