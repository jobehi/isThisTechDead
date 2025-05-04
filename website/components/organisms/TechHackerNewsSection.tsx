'use client';

import { Snapshot, Tech } from '@/domains';
import { useState } from 'react';

interface HackerNewsSectionProps {
  last_snapshot: Snapshot;
  tech: Tech;
}

/**
 * HackerNewsSection component displays Hacker News discussions and metrics for a technology.
 * It includes popular posts, activity metrics, and snarky analysis of HN sentiment.
 */
export default function TechHackerNewsSection({ tech, last_snapshot }: HackerNewsSectionProps) {
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const hnMetrics = last_snapshot.hn_metrics;
  const hnPosts = hnMetrics?.raw?.hits || [];
  const postCount = last_snapshot.hn_post_count || 0;
  const avgPoints = last_snapshot.hn_avg_points || 0;
  const daysSinceLast = last_snapshot.hn_days_since_last || 0;

  // Calculate how dead this tech is on Hacker News
  const deadnessLevel = hnMetrics?.deaditude_score || 5;

  // Format date from Unix timestamp
  const formatPostDate = (timestamp: number) => {
    try {
      const postDate = new Date(timestamp * 1000);

      // Check if the date is valid
      if (isNaN(postDate.getTime())) {
        return 'recently';
      }

      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;

      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    } catch {
      return 'recently';
    }
  };

  // Get snarky comment based on metrics
  const getSnark = () => {
    if (daysSinceLast > 1000)
      return `The last time ${tech.name} was mentioned on HN, Bitcoin was worth $5`;
    if (daysSinceLast > 365)
      return `${tech.name} was last discussed on HN over a year ago. Even COBOL gets more airtime.`;
    if (daysSinceLast > 180)
      return `HN has the memory of a goldfish. ${tech.name} is already forgotten.`;
    if (daysSinceLast > 90)
      return `${tech.name} was cool for a hot second, but HN moved on to shinier toys.`;
    if (daysSinceLast > 30)
      return `A month without HN mentions is like a year in regular tech time. Tick tock.`;
    if (avgPoints < 5)
      return `When ${tech.name} is mentioned on HN, users furiously scroll past it.`;
    if (avgPoints < 20)
      return `HN tolerates discussions about ${tech.name}, but the real party's elsewhere.`;
    if (avgPoints > 100)
      return `${tech.name} is HN&apos;s darling. Until the next hot framework drops.`;
    return `${tech.name} gets moderate attention on HN. Neither cool nor uncool - just meh.`;
  };

  // Get status label
  const getStatusLabel = () => {
    if (deadnessLevel > 8) return { label: 'HN Graveyard', color: 'text-red-500 bg-red-900/20' };
    if (deadnessLevel > 6)
      return { label: 'Fading Away', color: 'text-orange-400 bg-orange-900/20' };
    if (deadnessLevel > 4)
      return { label: 'Barely Mentioned', color: 'text-yellow-400 bg-yellow-900/20' };
    if (deadnessLevel > 2)
      return { label: 'Still Relevant', color: 'text-blue-400 bg-blue-900/20' };
    return { label: 'HN Darling', color: 'text-green-400 bg-green-900/20' };
  };

  // Get a hot take on the last HN discussion
  const getHotTake = () => {
    if (hnPosts.length === 0) return '';

    const latestPost = hnPosts[0];
    if (!latestPost) return '';

    const commentCount = latestPost.num_comments || 0;
    const points = latestPost.points || 0;

    if (commentCount > 300)
      return 'The comment section reads like a civil war between fanboys and haters.';
    if (commentCount > 150) return 'The bikeshedding is strong with this thread.';
    if (commentCount > 50 && points > 100)
      return 'Surprisingly productive discussion. Must have been a weekend.';
    if (commentCount > 30 && points < 30)
      return "Classic HN: more comments than upvotes. Everyone's an expert.";
    if (commentCount < 10 && points > 50)
      return "Silently upvoted. Too scared to admit they don't understand it.";
    if (points < 10) return 'Posted in the HN equivalent of a whisper.';

    return 'Typical orange site discourse: pedantic corrections.';
  };

  const status = getStatusLabel();

  return (
    <>
      <section className="mb-8 bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-orange-400 flex items-center">
            <span className="mr-2">🔸</span> Hacker News Discourse
          </h2>
          <div className="flex items-center">
            <div className={`text-sm font-medium ${status.color} px-3 py-1 rounded-full`}>
              {status.label}
            </div>
            <button
              onClick={() => setShowScoreInfo(!showScoreInfo)}
              className="ml-2 text-zinc-400 hover:text-orange-400 transition-colors text-xs underline"
              aria-label="Show deaditude score calculation information"
            >
              How is this calculated?
            </button>
          </div>
        </div>

        {showScoreInfo && (
          <div className="mb-4 p-3 bg-zinc-900/70 rounded-lg border border-zinc-700 text-sm">
            <h3 className="text-orange-400 font-medium mb-1">
              How the Hacker News deaditude score is calculated:
            </h3>
            <p className="text-zinc-300 mb-2">
              Our algorithm analyzes Hacker News activity using three key metrics:
            </p>
            <ul className="text-zinc-400 space-y-1 ml-4 list-disc">
              <li>
                <span className="font-medium">Volume (40% weight)</span>: Posts count divided by 2,
                capped at 10
              </li>
              <li>
                <span className="font-medium">Karma (40% weight)</span>: Average points per post
                divided by 5, capped at 10
              </li>
              <li>
                <span className="font-medium">Recency (20% weight)</span>: Full score if mentioned
                in last 7 days, otherwise decays based on days since last mention
              </li>
            </ul>
            <p className="text-zinc-400 mt-2">
              These three components create an &quot;alive score&quot; which is then subtracted from
              10 to produce the final deaditude score on a scale of 0-10.
            </p>
            <div className="mt-3 bg-zinc-800/60 p-2 rounded border border-zinc-700">
              <code className="text-xs text-orange-300 font-mono">
                deaditude = 10 - (volume_score × 0.4 + karma_score × 0.4 + recency_score × 0.2)
              </code>
            </div>
          </div>
        )}

        <p className="text-zinc-400 italic mb-6 text-sm">{getSnark()}</p>

        {/* Hacker News Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Mentions</h3>
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-400">{postCount.toLocaleString()}</div>
              <div className="text-xs text-zinc-500 ml-2">Posts</div>
            </div>
            {daysSinceLast > 0 && (
              <div className="flex items-center mt-2 text-sm">
                <span className="text-zinc-500 text-xs">Last mentioned </span>
                <span
                  className={`ml-1 text-xs ${daysSinceLast > 180 ? 'text-red-400' : daysSinceLast > 30 ? 'text-orange-400' : 'text-green-400'}`}
                >
                  {daysSinceLast === 1
                    ? 'yesterday'
                    : daysSinceLast < 30
                      ? `${daysSinceLast} days ago`
                      : daysSinceLast < 365
                        ? `${Math.floor(daysSinceLast / 30)} months ago`
                        : `${Math.floor(daysSinceLast / 365)} years ago`}
                </span>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Community Interest</h3>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Average points</span>
                <span className="text-sm font-medium text-orange-400">{avgPoints.toFixed(1)}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 mt-1 mb-3">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                  style={{ width: `${Math.min(Math.max((avgPoints / 100) * 100, 5), 100)}%` }}
                ></div>
              </div>

              <div className="text-xs text-zinc-500 mt-2">
                {avgPoints > 200 ? (
                  <span className="text-green-400">{"HN's obsession"}</span>
                ) : avgPoints > 100 ? (
                  <span className="text-green-400">High interest</span>
                ) : avgPoints > 50 ? (
                  <span className="text-lime-400">Noteworthy</span>
                ) : avgPoints > 20 ? (
                  <span className="text-yellow-400">Moderate buzz</span>
                ) : avgPoints > 10 ? (
                  <span className="text-orange-400">Minimal traction</span>
                ) : (
                  <span className="text-red-400">Stone cold silence</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">HN Verdict</h3>
            <div className="mt-1 text-xs text-zinc-400 italic">{getHotTake()}</div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 32 32"
                  className="text-orange-400 fill-current"
                >
                  <path d="M16 0l4 12h12l-10 7 4 13-10-7-10 7 4-13-10-7h12z" />
                </svg>
                <span className="text-xs text-zinc-500 ml-1">HN karma potential</span>
              </div>
              <div className="text-sm font-medium text-orange-400">
                {deadnessLevel > 7
                  ? '0/10'
                  : deadnessLevel > 5
                    ? '3/10'
                    : deadnessLevel > 3
                      ? '6/10'
                      : '8/10'}
              </div>
            </div>
          </div>
        </div>

        {/* Hacker News Posts */}
        {hnPosts.length > 0 ? (
          <div className="bg-zinc-900/40 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-zinc-300">Notable Discussions</h3>
              <div className="flex items-center text-xs text-zinc-500">
                <span>Order by</span>
                <span className="ml-2 px-2 py-0.5 bg-zinc-800 rounded-full">points</span>
              </div>
            </div>

            <div className="space-y-3">
              {hnPosts.slice(0, showAllPosts ? hnPosts.length : 5).map((post, idx) => {
                const title = post.title || 'Untitled post';
                const points = post.points || 0;
                const comments = post.num_comments || 0;
                const url = post.url || `https://news.ycombinator.com/item?id=${post.created_at_i}`;

                return (
                  <div
                    key={idx}
                    className="bg-zinc-800/60 p-3 rounded-lg hover:bg-zinc-700/60 transition-colors"
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 text-sm hover:text-orange-400 transition-colors"
                    >
                      {title}
                    </a>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-zinc-500">{formatPostDate(post.created_at_i)}</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center text-orange-400">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 32 32"
                            className="mr-1 fill-current"
                          >
                            <path d="M16 0l4 12h12l-10 7 4 13-10-7-10 7 4-13-10-7h12z" />
                          </svg>
                          {points}
                        </span>
                        <span className="flex items-center text-zinc-500">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                          </svg>
                          {comments}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-between items-center">
              {hnPosts.length > 5 && (
                <button
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full text-xs hover:bg-zinc-700 transition-colors"
                >
                  {showAllPosts ? 'Show Less' : `Show All (${hnPosts.length})`}
                </button>
              )}
              <a
                href={`https://hn.algolia.com/?q=${encodeURIComponent(tech.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-orange-900/30 text-orange-400 rounded-full text-xs hover:bg-orange-900/50 transition-colors"
              >
                Search on HN
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/40 p-5 rounded-lg text-center">
            <p className="text-zinc-400 text-sm">No discussions found on Hacker News.</p>
            <p className="text-zinc-500 text-xs mt-2 italic">
              Even &quot;Blockchain AI for the Web3 Metaverse&quot; gets more attention.
            </p>
            <a
              href={`https://hn.algolia.com/?q=${encodeURIComponent(tech.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-3 py-1.5 bg-orange-900/30 text-orange-400 rounded-full text-xs hover:bg-orange-900/50 transition-colors"
            >
              Double-check on HN
            </a>
          </div>
        )}

        <div className="text-xs text-zinc-500 mt-4 italic text-center">
          &quot;Remember that HN commenters once called React.js a terrible idea. Interpret
          accordingly.&quot;
        </div>
      </section>
    </>
  );
}
