'use client';

import { useState } from 'react';
import { FaTwitter, FaLinkedin, FaLink, FaRedditAlien } from 'react-icons/fa';
import { SiBluesky } from 'react-icons/si';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
}

/**
 * SocialShareButtons component for sharing content on various social platforms.
 * Includes Twitter, LinkedIn, Reddit, Bluesky and direct link copying.
 *
 * @example
 * ```tsx
 * import { SocialShareButtons } from '@/components/molecules';
 *
 * <SocialShareButtons
 *   url="https://www.isthistechdead.com/react"
 *   title="Is React dead? Score: 14.1%"
 *   summary="Check out React's deaditude score on Is This Tech Dead?"
 * />
 * ```
 */
export function SocialShareButtons({ url, title, summary = '' }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  const handleShare = (platform: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="text-xs text-zinc-500 mr-1">Share:</div>
      <button
        onClick={e => handleShare('twitter', e)}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 hover:text-white transition-colors"
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <FaTwitter size={14} />
      </button>
      <button
        onClick={e => handleShare('reddit', e)}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 hover:text-white transition-colors"
        aria-label="Share on Reddit"
        title="Share on Reddit"
      >
        <FaRedditAlien size={14} />
      </button>
      <button
        onClick={e => handleShare('bluesky', e)}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 hover:text-white transition-colors"
        aria-label="Share on Bluesky"
        title="Share on Bluesky"
      >
        <SiBluesky size={12} />
      </button>
      <button
        onClick={e => handleShare('linkedin', e)}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 hover:text-white transition-colors"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <FaLinkedin size={14} />
      </button>
      <button
        onClick={copyToClipboard}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 hover:text-white transition-colors"
        aria-label="Copy link"
        title="Copy link"
      >
        <FaLink size={14} />
      </button>
      {copied && (
        <span className="text-xs text-lime-400 ml-1 animate-fade-in-out">Link copied!</span>
      )}
    </div>
  );
}
