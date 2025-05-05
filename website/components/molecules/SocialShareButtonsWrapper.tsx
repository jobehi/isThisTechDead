'use client';

import { SocialShareButtons } from './SocialShareButtons';

interface SocialShareButtonsWrapperProps {
  url: string;
  title: string;
  summary?: string;
}

/**
 * Client component wrapper for SocialShareButtons to use in server components.
 */
export function SocialShareButtonsWrapper({
  url,
  title,
  summary = '',
}: SocialShareButtonsWrapperProps) {
  return <SocialShareButtons url={url} title={title} summary={summary} />;
}
