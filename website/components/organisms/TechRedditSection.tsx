'use client';

import { Snapshot, Tech } from '@/domains';
import { useState } from 'react';
import { ExternalLinkDialog } from '@/components/molecules';

interface RedditSectionProps {
  last_snapshot: Snapshot;
  tech: Tech;
}

/**
 * TechRedditSection component displays Reddit community discussions and metrics for a technology.
 * It includes popular discussions, community metrics, and sentiment analysis.
 */
export default function TechRedditSection({ tech, last_snapshot }: RedditSectionProps) {
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const redditMetrics = last_snapshot.reddit_metrics;
  const redditPosts = redditMetrics.raw.posts || [];
  const growthRate = last_snapshot.reddit_trend_growth_rate || 0;
  const trendDirection = growthRate > 0 ? 'up' : growthRate < 0 ? 'down' : 'stable';
  const subscribers = redditMetrics.subreddit_metrics?.subscribers || 0;
  const activeUsers = redditMetrics.subreddit_metrics?.active_users || 0;
  const migrationMentions = redditMetrics.migration_mentions || 0;

  // Calculate how dead this tech is on Reddit
  const deadnessLevel = redditMetrics.deaditude_score;

  // Get some snark based on metrics
  const getSnark = () => {
    if (deadnessLevel > 8)
      return "Even necromancers couldn't resurrect this tech's Reddit presence";
    if (deadnessLevel > 6) return 'The Reddit tumbleweeds have taken over';
    if (deadnessLevel > 4)
      return 'Posting about this tech is the Reddit equivalent of shouting into the void';
    if (deadnessLevel > 2) return 'Not dead yet, but the Reddit vultures are circling';
    return 'Surprisingly alive and kicking on Reddit';
  };

  // Get a color class based on sentiment
  const getSentimentColorClass = () => {
    const sentiment = redditMetrics.avg_sentiment || 0;
    if (sentiment > 0.3) return 'text-green-400';
    if (sentiment > 0) return 'text-lime-400';
    if (sentiment > -0.3) return 'text-orange-400';
    return 'text-red-400';
  };

  // Format post date
  const formatPostDate = (dateString: string) => {
    try {
      // Reddit uses Unix timestamps (seconds since epoch), not ISO dates
      // Check if the dateString is a number or can be parsed to a number
      const timestamp = parseInt(dateString, 10);
      const postDate = isNaN(timestamp)
        ? new Date(dateString) // Try to parse as regular date if not a number
        : new Date(timestamp * 1000); // Convert from seconds to milliseconds if it's a timestamp

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

  return (
    <>
      <section className="mb-8 bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-lime-300 flex items-center">
            <span className="mr-2">🗣️</span> Reddit Echo Chamber
          </h2>
          <div className="flex items-center">
            <div
              className={`text-sm font-medium ${getSentimentColorClass()} bg-zinc-900/40 px-3 py-1 rounded-full`}
            >
              {deadnessLevel > 50 ? 'Pretty Dead' : 'Still Breathing'}
            </div>
            <button
              onClick={() => setShowScoreInfo(!showScoreInfo)}
              className="ml-2 text-zinc-400 hover:text-lime-400 transition-colors text-xs underline"
              aria-label="Show deaditude score calculation information"
            >
              How is this calculated?
            </button>
          </div>
        </div>

        {showScoreInfo && (
          <div className="mb-4 p-3 bg-zinc-900/70 rounded-lg border border-zinc-700 text-sm">
            <h3 className="text-lime-300 font-medium mb-1">
              How the Reddit deaditude score is calculated:
            </h3>
            <p className="text-zinc-300 mb-2">
              Our algorithm uses a complex weighted formula combining multiple metrics:
            </p>
            <ul className="text-zinc-400 space-y-1 ml-4 list-disc">
              <li>
                <span className="font-medium">Subscriber count (15% weight)</span>:
                <ul className="ml-5 mt-1 space-y-0.5 list-[circle] text-xs">
                  <li>≥100K subscribers: 3.0 points</li>
                  <li>≥20K subscribers: 2.0 points</li>
                  <li>≥5K subscribers: 1.0 points</li>
                  <li>≥1K subscribers: 0.5 points</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Post volume (15% weight)</span>:
                <ul className="ml-5 mt-1 space-y-0.5 list-[circle] text-xs">
                  <li>≥50 posts: 3.0 points</li>
                  <li>≥20 posts: 2.0 points</li>
                  <li>≥10 posts: 1.0 points</li>
                  <li>≥5 posts: 0.5 points</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Engagement (10% weight)</span>: Based on average score
                per post (upvotes)
              </li>
              <li>
                <span className="font-medium">Trend (35% weight)</span>: Post frequency over time,
                with bonuses for growth
              </li>
              <li>
                <span className="font-medium">Sentiment (15% weight)</span>: Text analysis of post
                titles
              </li>
              <li>
                <span className="font-medium">Migration mentions (10% weight)</span>: Penalty for
                discussions about abandoning the technology
              </li>
            </ul>
            <p className="text-zinc-400 mt-2">
              These components create an &quot;alive score&quot; which is converted to the final
              deaditude score using a non-linear formula that further penalizes technologies showing
              decline patterns.
            </p>
            <div className="mt-3 bg-zinc-800/60 p-2 rounded border border-zinc-700">
              <code className="text-xs text-lime-300 font-mono leading-relaxed">
                activity = subscriber_score + post_volume_score + engagement_score + trend_score
                <br />
                alive_score = activity * 0.5 + sentiment_score * 0.35 - migration_penalty * 0.2
                <br />
                deaditude = 10 - alive_score (with additional adjustments)
              </code>
            </div>
          </div>
        )}

        <p className="text-zinc-400 italic mb-6 text-sm">{getSnark()}</p>

        {/* Reddit Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900/40 p-4 rounded-lg flex flex-col">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Community Size</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-2xl font-bold text-lime-400">
                  {subscribers.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-500">Subscribers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {activeUsers.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-500">Active Users</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-4 rounded-lg flex flex-col">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Activity Metrics</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-2xl font-bold text-lime-400">
                  {last_snapshot.reddit_post_count?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-zinc-500">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-lime-400">
                  {last_snapshot.reddit_avg_upvotes?.toFixed(1) || '0'}
                </div>
                <div className="text-xs text-zinc-500">Avg. Upvotes</div>
              </div>
            </div>

            <div className="mt-2 bg-zinc-900/80 p-3 rounded-lg border border-zinc-700/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-400">Growth Trend</span>
                <div>
                  {trendDirection === 'up' ? (
                    <span className="text-xs text-green-400 px-2 py-0.5 bg-green-900/20 rounded-full">
                      Rising
                    </span>
                  ) : trendDirection === 'down' ? (
                    <span className="text-xs text-red-400 px-2 py-0.5 bg-red-900/20 rounded-full">
                      Falling
                    </span>
                  ) : (
                    <span className="text-xs text-yellow-400 px-2 py-0.5 bg-yellow-900/20 rounded-full">
                      Stable
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                {trendDirection === 'up' ? (
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ) : trendDirection === 'down' ? (
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                ) : (
                  <span className="text-sm text-zinc-400">→</span>
                )}

                <div
                  className={`text-3xl font-bold ${
                    growthRate > 0.05
                      ? 'text-green-400'
                      : growthRate > 0
                        ? 'text-green-300'
                        : growthRate < -0.05
                          ? 'text-red-500'
                          : growthRate < 0
                            ? 'text-red-400'
                            : 'text-yellow-400'
                  }`}
                >
                  {growthRate > 0 ? '+' : ''}
                  {(growthRate * 100).toFixed(1)}%
                </div>
              </div>

              <div className="mt-2 text-xs text-center text-zinc-500">
                {growthRate > 1
                  ? 'Explosive growth!'
                  : growthRate > 0
                    ? 'Strong momentum'
                    : growthRate > 0.05
                      ? 'Healthy interest'
                      : growthRate > 0
                        ? 'Slight uptick'
                        : growthRate === 0
                          ? 'Holding steady'
                          : growthRate > -0.1
                            ? 'Minor decline'
                            : growthRate > -0.5
                              ? 'Losing steam'
                              : growthRate > -1
                                ? 'Significant drop'
                                : 'Free falling'}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Community Sentiment</h3>
            {redditMetrics.avg_sentiment !== undefined ? (
              <div>
                <div className="w-full bg-zinc-700 rounded-full h-2.5 mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${(redditMetrics.avg_sentiment + 1) * 50}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Rage</span>
                  <span>Meh</span>
                  <span>Fanboy</span>
                </div>
                <div className="mt-3 text-sm">
                  <div className="text-xl font-medium text-center mt-2 mb-1 text-amber-400">
                    {redditMetrics.avg_sentiment > 0.5
                      ? 'Cult-like Devotion'
                      : redditMetrics.avg_sentiment > 0.2
                        ? 'Cautious Optimism'
                        : redditMetrics.avg_sentiment > -0.2
                          ? 'Perfectly Balanced'
                          : redditMetrics.avg_sentiment > -0.5
                            ? 'Growing Frustration'
                            : 'Complete Disdain'}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-400 italic">
                No one cares enough to have an opinion.
              </p>
            )}
          </div>
        </div>

        {/* Migration mentions section */}
        {migrationMentions > 0 && (
          <div className="bg-zinc-800/80 p-4 rounded-lg mb-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <span className="text-red-400 text-lg mr-2">🚨</span>
              <h3 className="text-sm font-medium text-zinc-200">Migration Alert</h3>
            </div>
            <p className="text-sm text-zinc-300 mt-1">
              <span className="font-semibold text-red-400">{migrationMentions}</span> mentions of
              migrating away from {tech.name} detected in discussions.
              {migrationMentions > 10
                ? ' k. bye'
                : migrationMentions > 5
                  ? ' Might be time to polish that resume...'
                  : ' Just a few deserters, for now.'}
            </p>
          </div>
        )}

        {/* Popular Discussions */}
        <div className="bg-zinc-900/40 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-zinc-300">Popular Discussions</h3>
            <span className="text-xs text-zinc-500">Last 30 days</span>
          </div>

          {redditPosts.length === 0 ? (
            <div className="bg-zinc-800/60 p-5 rounded-lg text-center">
              <p className="text-zinc-400 italic text-sm">
                Crickets chirping... No one&apos;s talking about {tech.name} on Reddit.
              </p>
              <p className="text-zinc-500 text-xs mt-2">
                Either this tech is super niche or it&apos;s been abandoned like a New Year&apos;s
                resolution.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {redditPosts
                .slice(0, showAllPosts ? redditPosts.length : 5)
                .map((post, idx: number) => (
                  <div
                    key={idx}
                    className="bg-zinc-800/60 p-3 rounded-lg hover:bg-zinc-700/60 transition-colors"
                  >
                    <ExternalLinkDialog
                      href={post.url}
                      platform="reddit"
                      className="text-zinc-300 text-sm line-clamp-2 hover:text-lime-300 transition-colors"
                    >
                      {post.title}
                    </ExternalLinkDialog>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="flex items-center">
                        <ExternalLinkDialog
                          href={`https://reddit.com/r/${post.sub}`}
                          platform="reddit"
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          r/{post.sub}
                        </ExternalLinkDialog>
                        <span className="text-zinc-500 ml-2">{formatPostDate(post.created)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          {post.score > 0 ? (
                            <svg
                              className="w-3 h-3 mr-1 text-green-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M7 14l5-5 5 5H7z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3 mr-1 text-red-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M7 10l5 5 5-5H7z" />
                            </svg>
                          )}
                          <span className={post.score > 0 ? 'text-green-400' : 'text-red-400'}>
                            {post.score}
                          </span>
                          <span className="text-zinc-500 ml-1">
                            ({Math.round(post.upvote_ratio * 100)}%)
                          </span>
                        </span>
                        <span className="flex items-center text-zinc-500">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                          </svg>
                          {post.num_comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            {redditPosts.length > 5 && (
              <button
                onClick={() => setShowAllPosts(!showAllPosts)}
                className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full text-xs hover:bg-zinc-700 transition-colors"
              >
                {showAllPosts ? 'Show Less' : `Show All (${redditPosts.length})`}
              </button>
            )}
            <ExternalLinkDialog
              href={`https://www.reddit.com/search/?q=${encodeURIComponent(tech.subreddit || tech.name)}`}
              platform="reddit"
              className="px-3 py-1.5 bg-orange-900/30 text-orange-400 rounded-full text-xs hover:bg-orange-900/50 transition-colors"
            >
              Browse Reddit
            </ExternalLinkDialog>
          </div>
        </div>

        {/* Subreddit Suggestion */}
        {!tech.subreddit && (
          <div className="text-center mt-4 bg-zinc-900/40 p-3 rounded-lg">
            <p className="text-zinc-400 text-sm">
              No dedicated subreddit tracked for {tech.name}.
              <span className="block mt-1 text-xs text-zinc-500">
                It&apos;s probably for the best. Ever read the comments section on YouTube? Yeah,
                like that but worse.
              </span>
            </p>
          </div>
        )}
      </section>
    </>
  );
}
