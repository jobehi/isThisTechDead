'use client';

import { Snapshot, Tech } from '@/domains';
import { useState } from 'react';

interface TechYoutubeSectionProps {
  last_snapshot: Snapshot;
  tech: Tech;
}

/**
 * YouTubeSection component displays YouTube metrics and popular videos for a technology.
 * It includes video thumbnails, engagement metrics, and snarky analysis of content trends.
 */
export default function TechYoutubeSection({ tech, last_snapshot }: TechYoutubeSectionProps) {
  const [showAllVideos, setShowAllVideos] = useState(false);
  const ytMetrics = last_snapshot.youtube_metrics;
  const videos = ytMetrics?.raw?.videos || [];
  const videoCount = last_snapshot.youtube_video_count || 0;
  const avgViews = last_snapshot.youtube_avg_views || 0;
  const totalViews = ytMetrics?.total_views || 0;
  const growthRate = ytMetrics?.trend_metrics?.growth_rate || 0;

  // Calculate how dead this tech is on YouTube
  const deadnessLevel = ytMetrics?.deaditude_score || 5;

  // Format number with K/M/B suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format date to relative time
  const formatRelativeTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp * 1000);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;

      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    } catch {
      return 'unknown date';
    }
  };

  // Get status label
  const getStatusLabel = () => {
    if (deadnessLevel > 8) return { label: 'Crickets', color: 'text-red-500 bg-red-900/20' };
    if (deadnessLevel > 6)
      return { label: 'Fading Away', color: 'text-orange-400 bg-orange-900/20' };
    if (deadnessLevel > 4)
      return { label: 'Barely Watched', color: 'text-yellow-400 bg-yellow-900/20' };
    if (deadnessLevel > 2) return { label: 'Some Content', color: 'text-blue-400 bg-blue-900/20' };
    return { label: 'Trending', color: 'text-green-400 bg-green-900/20' };
  };

  // Get some snark based on metrics
  const getSnark = () => {
    if (videoCount === 0)
      return `${tech.name} has fewer YouTube tutorials than "How to Breathe Air".`;
    if (avgViews < 100) return `${tech.name} videos get fewer views than paint drying timelapses.`;
    if (avgViews < 1000)
      return `Creators would get more views livestreaming themselves sleeping than talking about ${tech.name}.`;
    if (growthRate < -0.3)
      return `YouTube algorithm buried ${tech.name} content deeper than archaeological discoveries.`;
    if (growthRate < 0) return `${tech.name} content is about as appealing as 240p videos in 2023.`;
    if (growthRate > 0.5)
      return `YouTubers discovered ${tech.name} generates ad revenue. Brace for 10:01 videos.`;
    if (videoCount > 1000 && avgViews > 10000)
      return `${tech.name} has more tutorials than actual users. Classic YouTube.`;
    return `${tech.name} content exists on YouTube. So does flat earth theory.`;
  };

  // Get a creator tier label based on view count
  const getCreatorTier = (viewCount: number) => {
    if (viewCount > 1000000) return { label: 'YouTube Royalty', color: 'text-purple-400' };
    if (viewCount > 100000) return { label: 'Major Creator', color: 'text-blue-400' };
    if (viewCount > 10000) return { label: 'Growing Channel', color: 'text-green-400' };
    if (viewCount > 1000) return { label: 'Small Creator', color: 'text-yellow-400' };
    return { label: 'Hobby Channel', color: 'text-orange-400' };
  };

  // Get a trend description
  const getTrendDescription = () => {
    if (growthRate > 0.5) return { text: 'Explosive growth', color: 'text-green-500' };
    if (growthRate > 0.2) return { text: 'Strong uptrend', color: 'text-green-400' };
    if (growthRate > 0.05) return { text: 'Modest growth', color: 'text-green-300' };
    if (growthRate > -0.05) return { text: 'Stable', color: 'text-blue-400' };
    if (growthRate > -0.2) return { text: 'Slight decline', color: 'text-orange-400' };
    if (growthRate > -0.5) return { text: 'Significant drop', color: 'text-red-400' };
    return { text: 'Free falling', color: 'text-red-500' };
  };

  const status = getStatusLabel();
  const trend = getTrendDescription();

  return (
    <>
      <section className="mb-8 bg-zinc-800/60 p-6 rounded-xl shadow-lg border border-zinc-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-400 flex items-center">
            <span className="mr-2">▶️</span> YouTube Coverage
          </h2>
          <div className="flex items-center">
            <div className={`text-sm font-medium ${status.color} px-3 py-1 rounded-full`}>
              {status.label}
            </div>
          </div>
        </div>

        <p className="text-zinc-400 italic mb-6 text-sm">{getSnark()}</p>

        {/* YouTube Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Content Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-2xl font-bold text-red-400">{videoCount.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">Videos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{formatNumber(totalViews)}</div>
                <div className="text-xs text-zinc-500">Total Views</div>
              </div>
            </div>

            <div className="mt-3 flex items-center text-sm">
              <span className="text-zinc-500 text-xs">Content trend: </span>
              <span className={`ml-1 text-xs ${trend.color}`}>{trend.text}</span>
              <span
                className={`ml-2 text-xs ${growthRate > 0 ? 'text-green-400' : growthRate < 0 ? 'text-red-400' : 'text-blue-400'}`}
              >
                {growthRate > 0 ? '+' : ''}
                {(growthRate * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Average Engagement</h3>
            <div>
              <div className="text-2xl font-bold text-red-400">{formatNumber(avgViews)}</div>
              <div className="text-xs text-zinc-500">Views per Video</div>

              <div className="w-full bg-zinc-800 rounded-full h-2 mt-3 mb-1">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-300 h-2 rounded-full"
                  style={{ width: `${Math.min(Math.max((avgViews / 10000) * 100, 5), 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-zinc-500">
                <span>Low</span>
                <span>10K+ views</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 p-4 rounded-lg">
            <h3 className="text-xs font-medium text-zinc-400 mb-2">Creator Landscape</h3>

            {videos.length > 0 ? (
              <div>
                <div className="text-sm text-zinc-300 mb-1">Top channels covering {tech.name}:</div>
                <div className="space-y-2 mt-2">
                  {Array.from(new Set(videos.slice(0, 3).map(v => v.snippet.channelTitle)))
                    .slice(0, 3)
                    .map((channel, idx) => {
                      const channelVideos = videos.filter(v => v.snippet.channelTitle === channel);
                      const totalChannelViews = channelVideos.reduce(
                        (sum, v) => sum + (v.statistics?.viewCount || 0),
                        0
                      );
                      const tier = getCreatorTier(totalChannelViews);

                      return (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="text-xs text-zinc-300 truncate max-w-[120px]">
                            {channel}
                          </div>
                          <div
                            className={`text-xs ${tier.color} px-1.5 py-0.5 rounded-full bg-zinc-800/80`}
                          >
                            {tier.label}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-500 italic">
                No creators have bothered with {tech.name} content yet.
              </div>
            )}
          </div>
        </div>

        {/* YouTube Videos */}
        {videos.length > 0 ? (
          <div className="bg-zinc-900/40 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-zinc-300">Popular Videos</h3>
              <div className="flex items-center text-xs text-zinc-500">
                <span>Sorted by</span>
                <span className="ml-2 px-2 py-0.5 bg-zinc-800 rounded-full">views</span>
              </div>
            </div>

            <div className="space-y-4">
              {videos
                .sort((a, b) => (b.statistics?.viewCount || 0) - (a.statistics?.viewCount || 0))
                .slice(0, showAllVideos ? videos.length : 3)
                .map((video, idx) => {
                  const views = video.statistics?.viewCount || 0;
                  const likes = video.statistics?.likeCount || 0;
                  const comments = video.statistics?.commentCount || 0;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row bg-zinc-800/60 rounded-lg overflow-hidden hover:bg-zinc-700/60 transition-colors"
                    >
                      <div className="md:w-40 lg:w-48 flex-shrink-0">
                        <a
                          href={video.snippet.url || `https://www.youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative pb-[56.25%] w-full h-0 bg-zinc-900"
                        >
                          {video.snippet.thumbnails?.medium?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={video.snippet.thumbnails.medium.url}
                              alt={video.snippet.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                              </svg>
                            </div>
                          )}

                          <div className="absolute bottom-0 right-0 bg-black/80 text-white text-xs px-1 py-0.5">
                            {formatNumber(views)} views
                          </div>
                        </a>
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <a
                            href={
                              video.snippet.url || `https://www.youtube.com/watch?v=${video.id}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-zinc-200 font-medium hover:text-red-400 transition-colors line-clamp-2"
                          >
                            {video.snippet.title}
                          </a>
                          <div className="text-xs text-zinc-500 mt-1">
                            {video.snippet.channelTitle}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-zinc-500">
                            {formatRelativeTime(video.timestamp)}
                          </span>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center text-zinc-400">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
                              </svg>
                              {formatNumber(likes)}
                            </span>
                            <span className="flex items-center text-zinc-400">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                              </svg>
                              {formatNumber(comments)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-4 flex justify-between items-center">
              {videos.length > 3 && (
                <button
                  onClick={() => setShowAllVideos(!showAllVideos)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full text-xs hover:bg-zinc-700 transition-colors"
                >
                  {showAllVideos ? 'Show Less' : `Show All Videos (${videos.length})`}
                </button>
              )}
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tech.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-red-900/30 text-red-400 rounded-full text-xs hover:bg-red-900/50 transition-colors"
              >
                Search on YouTube
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900/40 p-6 rounded-lg text-center">
            <p className="text-zinc-400 text-sm">No videos found for {tech.name}.</p>
            <p className="text-zinc-500 text-xs mt-2 italic">
              Even TikTok dances about programming languages get more content than this.
            </p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tech.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-3 py-1.5 bg-red-900/30 text-red-400 rounded-full text-xs hover:bg-red-900/50 transition-colors"
            >
              Search on YouTube
            </a>
          </div>
        )}

        <div className="text-xs text-zinc-500 mt-4 flex justify-between items-center">
          <span className="italic">
            &quot;If there&apos;s no 3-hour tutorial, does the technology even exist?&quot;
          </span>
          <span className="text-xs bg-zinc-900 px-2 py-1 rounded-full">
            <span className="text-red-500 font-bold">You</span>
            <span className="text-white">Tube</span>
          </span>
        </div>
      </section>
    </>
  );
}
