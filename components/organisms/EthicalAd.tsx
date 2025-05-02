'use client';

import { useEffect } from 'react';

interface EthicalAdProps {
  type: 'text' | 'image';
  className?: string;
}

/**
 * EthicalAd component displays privacy-respecting advertisements through the EthicalAds network.
 * Supports both text and image ad formats and automatically reloads ads when mounted.
 *
 * @example
 * ```tsx
 * import { EthicalAd } from '@/components/organisms';
 *
 * // Image ad
 * <EthicalAd type="image" className="horizontal" />
 *
 * // Text ad
 * <EthicalAd type="text" className="sidebar" />
 * ```
 */
export function EthicalAd({ type, className = '' }: EthicalAdProps) {
  // Reload ethical ads when component mounts
  useEffect(() => {
    // Access the global ethicalads object if it exists
    if (typeof window !== 'undefined' && window.ethicalads) {
      window.ethicalads.load();
    }
  }, []);

  return (
    <div data-ea-publisher="isthistechdeadcom" data-ea-type={type} className={className}>
      <div className="text-xs text-zinc-500">This is supposed to be an ad</div>
    </div>
  );
}

// Typescript type declaration for the EthicalAds global
declare global {
  interface Window {
    ethicalads?: {
      load: () => void;
    };
  }
}
