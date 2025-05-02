'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRespectCount } from './useRespectCount';
import { usePayRespects } from './usePayRespects';
import { getDailyRespectInfo, trackRespect } from './useLocalRespectQuota';
import { config } from '@/lib/config';

// Get max respects from centralized config
const MAX_RESPECTS_PER_DAY = config.security.rateLimits.respect.maxPerDay;

/**
 * Hook for the Press F feature state and interactions
 * @param techId The tech ID
 * @param techName The tech name
 * @returns Object with state and methods for the Press F feature
 */
export function usePressFFeature(techId: string, techName: string) {
  const [animating, setAnimating] = useState(false);
  const [respectCount, setRespectCount] = useState<number | null>(null);
  const [hadInteraction, setHadInteraction] = useState(false);
  const [dailyRespects, setDailyRespects] = useState({ count: 0, remaining: MAX_RESPECTS_PER_DAY });
  const [rateLimited, setRateLimited] = useState(false);

  const { submit, isSubmitting, data } = usePayRespects();

  // Fetch initial count on mount
  const { data: countData } = useRespectCount(techId);

  // Load and update daily respect counts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info = getDailyRespectInfo(techId);
      setDailyRespects(info);
      setRateLimited(info.remaining <= 0);
    }
  }, [techId]);

  // Handle F key press
  const handlePressF = useCallback(async () => {
    if (isSubmitting || animating) return;

    // Check if we're rate limited
    const info = getDailyRespectInfo(techId);
    if (info.remaining <= 0) {
      setRateLimited(true);
      return;
    }

    setAnimating(true);
    setHadInteraction(true);

    // Track this respect in localStorage
    const tracked = trackRespect(techId);
    if (!tracked) {
      setRateLimited(true);
      setAnimating(false);
      return;
    }

    // Update daily respects
    const updatedInfo = getDailyRespectInfo(techId);
    setDailyRespects(updatedInfo);

    // Pay respects
    const result = await submit({ techId, techName });

    if (result?.success) {
      setRespectCount(result.count);
    }

    // Animation duration
    setTimeout(() => {
      setAnimating(false);
    }, 2000);
  }, [techId, techName, isSubmitting, animating, submit]);

  return {
    animating,
    isSubmitting,
    respectCount: respectCount ?? countData?.count ?? null,
    hadInteraction,
    handlePressF,
    isDisabled: data?.disabled || false,
    dailyRespects,
    rateLimited,
  };
} 