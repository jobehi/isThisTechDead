'use client';

import { Snapshot, Tech } from '@/domains';
import { useMemo, useState } from 'react';
import { ExternalLinkDialog } from '@/components/molecules';

interface JobsSectionProps {
  last_snapshot: Snapshot;
  tech: Tech;
}

// Define type for the by_country object
type CountryJobs = Record<string, number | undefined>;

// Country codes to full names
const COUNTRY_NAMES: Record<string, string> = {
  us: 'United States',
  ca: 'Canada',
  gb: 'United Kingdom',
  fr: 'France',
  de: 'Germany',
  in: 'India',
};

// Country flags
const COUNTRY_FLAGS: Record<string, string> = {
  us: '🇺🇸',
  ca: '🇨🇦',
  gb: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  in: '🇮🇳',
};

/**
 * TechJobsSection component displays job market metrics for a technology by country.
 * It includes visual representations of job counts and snarky analysis of the job market.
 */
export default function TechJobsSection({ tech, last_snapshot }: JobsSectionProps) {
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const jobsMetrics = last_snapshot.google_jobs || { deaditude_score: 5, by_country: {} };

  // Memoize jobsByCountry to prevent re-renders
  const jobsByCountry = useMemo(() => {
    return (jobsMetrics.by_country || {}) as CountryJobs;
  }, [jobsMetrics.by_country]);

  const stackshareCompaniesCount = last_snapshot.stackshare_stacks_count || 0;

  // Calculate total number of jobs
  const totalJobs = useMemo(() => {
    return Object.values(jobsByCountry).reduce((sum: number, count) => sum + (count || 0), 0);
  }, [jobsByCountry]);

  const deadnessLevel = jobsMetrics.deaditude_score;

  // Get some snark based on metrics
  const getSnark = () => {
    if (deadnessLevel > 8)
      return `Resume with ${tech.name} skills? Perfect for your paper airplane collection.`;
    if (deadnessLevel > 6) return `${tech.name} jobs exist. So does Bigfoot, allegedly.`;
    if (deadnessLevel > 4) return `${tech.name} on your resume? Maybe keep a backup skill handy.`;
    if (deadnessLevel > 2)
      return `Not exactly a hot skill, but beats having 'Excel' as your top tech.`;
    return `${tech.name} devs are getting snatched up faster than PS5s at launch.`;
  };

  // Calculate max jobs for any country (for visualization)
  const maxJobs = useMemo(() => {
    const values = Object.values(jobsByCountry).map(v => v || 0);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [jobsByCountry]);

  // Job market status tag
  const getJobMarketStatus = () => {
    const jobs = Number(totalJobs);
    if (jobs < 10) return { label: 'Near Extinct', color: 'text-red-500 bg-red-900/20' };
    if (jobs < 100) return { label: 'Endangered', color: 'text-orange-400 bg-orange-900/20' };
    if (jobs < 500) return { label: 'Sparse', color: 'text-yellow-400 bg-yellow-900/20' };
    if (jobs < 1000) return { label: 'Sustainable', color: 'text-blue-400 bg-blue-900/20' };
    return { label: 'Thriving', color: 'text-green-400 bg-green-900/20' };
  };

  // Calculate which country has the most jobs
  const topCountry = useMemo(() => {
    if (Object.keys(jobsByCountry).length === 0) return null;
    const sortedEntries = Object.entries(jobsByCountry).sort((a, b) => (b[1] || 0) - (a[1] || 0));
    return sortedEntries.length > 0 ? sortedEntries[0]![0] : null;
  }, [jobsByCountry]);

  // Status properties
  const jobMarketStatus = getJobMarketStatus();
  const jobsNumber = Number(totalJobs);

  return (
    <>
      <section className="mb-8 bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-lime-300 flex items-center">
            <span className="mr-2">💼</span> Job Market Pulse
          </h2>
          <div className="flex items-center">
            <div className={`text-sm font-medium ${jobMarketStatus.color} px-3 py-1 rounded-full`}>
              {jobMarketStatus.label}
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
              How the Job Market deaditude score is calculated:
            </h3>
            <p className="text-zinc-300 mb-2">
              Our algorithm uses a tiered scoring system based on total job count across major
              markets:
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 ml-4 text-zinc-400">
              <div className="font-medium">Job Count</div>
              <div className="font-medium">Deaditude Score</div>

              <div>≥100,000 jobs</div>
              <div className="text-green-400">1.0 (thriving)</div>

              <div>≥50,000 jobs</div>
              <div className="text-green-400">2.5</div>

              <div>≥20,000 jobs</div>
              <div className="text-lime-400">4.0</div>

              <div>≥5,000 jobs</div>
              <div className="text-yellow-400">5.5</div>

              <div>≥1,000 jobs</div>
              <div className="text-orange-400">7.0</div>

              <div>≥100 jobs</div>
              <div className="text-red-400">8.5</div>

              <div>&lt;100 jobs</div>
              <div className="text-red-500">10.0 (extinct)</div>
            </div>
            <p className="text-zinc-400 mt-3">
              Data is primarily collected from Adzuna&apos;s job API across multiple countries (US,
              UK, Canada, France, Germany, India). If not available, we fall back to Google search
              results.
            </p>
            <div className="mt-3 bg-zinc-800/60 p-2 rounded border border-zinc-700">
              <code className="text-xs text-lime-300 font-mono">
                deaditude = job_count_based_tiered_score
              </code>
            </div>
          </div>
        )}

        <p className="text-zinc-400 italic mb-6 text-sm">{getSnark()}</p>

        {/* Jobs Availability Overview */}
        <div className="bg-zinc-900/40 p-4 rounded-lg mb-6">
          <h3 className="text-xs font-medium text-zinc-400 mb-4">Global Job Distribution</h3>

          {jobsNumber === 0 ? (
            <div className="bg-zinc-800/60 p-6 rounded-lg text-center">
              <p className="text-zinc-400 text-sm">
                No jobs found. Maybe try learning something from this century?
              </p>
              <p className="text-zinc-500 text-xs mt-2 italic">
                Or check back when companies stop putting &quot;{tech.name} OR 10 OTHER SKILLS&quot;
                in job posts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(jobsByCountry)
                .sort((a, b) => (b[1] || 0) - (a[1] || 0))
                .map(([country, jobCount]) => {
                  const count = Number(jobCount || 0);
                  const percentage = maxJobs > 0 ? (count / maxJobs) * 100 : 0;

                  return (
                    <div key={country} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{COUNTRY_FLAGS[country] || '🌍'}</span>
                          <span className="text-sm text-zinc-300">
                            {COUNTRY_NAMES[country] || country}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-lime-400">
                          {count.toLocaleString()}
                        </span>
                      </div>

                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-lime-500 h-2 rounded-full"
                          style={{ width: `${Math.max(percentage, 3)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Job Market Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Market Summary</h3>

            <div className="flex flex-col space-y-4">
              <div>
                <div className="text-2xl font-bold text-lime-400">
                  {jobsNumber.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-500">Total Jobs</div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">🏢</span>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {stackshareCompaniesCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-zinc-500">Companies Using It</div>
                  </div>
                </div>

                {stackshareCompaniesCount > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-zinc-800 rounded-full h-2 mb-1">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(Math.max((stackshareCompaniesCount / 1000) * 100, 5), 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-zinc-500 italic">
                      {stackshareCompaniesCount > 10000
                        ? 'The entire industry is hooked on this tech. Resistance is futile.'
                        : stackshareCompaniesCount > 5000
                          ? "Big tech's favorite toy. Even your local coffee shop probably uses it."
                          : stackshareCompaniesCount > 1000
                            ? 'Major players still rely on this. Job security... for now.'
                            : stackshareCompaniesCount > 500
                              ? 'A handful of brave companies keeping the dream alive.'
                              : stackshareCompaniesCount > 100
                                ? 'A small but determined corporate fanbase exists.'
                                : stackshareCompaniesCount > 10
                                  ? 'A few courageous (or stubborn) companies still on board.'
                                  : 'Even the companies that made it are migrating away.'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Reality Check</h3>

            {jobsNumber > 1000 ? (
              <div className="bg-green-900/20 text-green-400 p-3 rounded-lg">
                <p className="text-sm font-medium">Marketable Skill Alert!</p>
                <p className="text-xs mt-1">
                  {tech.name} is still paying the bills in {Object.keys(jobsByCountry).length}{' '}
                  countries.
                  {topCountry === 'us' ? ' Silicon Valley approves.' : ''}
                </p>
              </div>
            ) : jobsNumber > 500 ? (
              <div className="bg-yellow-900/20 text-yellow-400 p-3 rounded-lg">
                <p className="text-sm font-medium">Career Life Support</p>
                <p className="text-xs mt-1">
                  {tech.name}{' '}
                  {"isn't dead, but maybe start a side project with something trendier."}
                </p>
              </div>
            ) : (
              <div className="bg-red-900/20 text-red-400 p-3 rounded-lg">
                <p className="text-sm font-medium">Career Suicide Watch</p>
                <p className="text-xs mt-1">
                  {
                    'Time to update your LinkedIn. And by "update" we mean "remove {tech.name} entirely"'
                  }
                </p>
              </div>
            )}

            <div className="mt-4 text-xs text-zinc-500">
              <p className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Job metrics derived from search results. Actual availability may be worse.
              </p>
            </div>
          </div>
          {/* source Adzuna */}
          <div className="text-xs text-zinc-500">
            <ExternalLinkDialog href="https://developer.adzuna.com/" platform="other">
              <p className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Source: Adzuna
              </p>
            </ExternalLinkDialog>
          </div>
        </div>
      </section>
    </>
  );
}
