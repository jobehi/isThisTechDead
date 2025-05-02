'use client';

import { useState, useCallback, useEffect } from 'react';
import { useApiData, useApiMutation } from '@/lib/hooks';

// Maximum respects per day per tech per user
const MAX_RESPECTS_PER_DAY = 10;

// API response interfaces to match our standardized format
interface ApiSuccessResponse<T> {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
}

interface ApiErrorResponse {
  success: boolean;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Hook to get respect count for a tech
 * @param techId The tech ID to get the count for
 * @returns Object with respect count, loading state, and error
 */
function useRespectCount(techId: string | null) {
  const response = useApiData<ApiResponse<{ count: number | null }>>(
    techId ? `/respect?techId=${techId}` : null,
    {
      initialData: { success: false, data: { count: null } } as ApiSuccessResponse<{
        count: number | null;
      }>,
      enabled: !!techId,
    }
  );

  // Create a derived state that maps to the old response format for backward compatibility
  const compatResponse = {
    ...response,
    data: response.data
      ? {
          success: response.data.success,
          count: 'data' in response.data ? (response.data.data?.count ?? null) : null,
        }
      : { success: false, count: null },
  };

  return compatResponse;
}

/**
 * Hook to pay respects to a tech
 * @returns Object with submit function, loading state, and result
 */
function usePayRespects() {
  const mutation = useApiMutation<
    { techId: string; techName: string },
    ApiResponse<{ count: number | null }>
  >('/respect');

  // Create a wrapper function that converts the response to the old format
  const wrappedSubmit = async (params: { techId: string; techName: string }) => {
    const result = await mutation.submit(params);
    if (result) {
      return {
        success: result.success,
        count: 'data' in result ? (result.data?.count ?? null) : null,
      };
    }
    return null;
  };

  return {
    ...mutation,
    submit: wrappedSubmit,
    data: mutation.data
      ? {
          success: mutation.data.success,
          count: 'data' in mutation.data ? (mutation.data.data?.count ?? null) : null,
          disabled:
            !mutation.data.success &&
            'error' in mutation.data &&
            mutation.data.error?.code === 'FEATURE_DISABLED',
        }
      : null,
  };
}

/**
 * Track a respect in localStorage with timestamp
 * @param techId The tech ID
 * @returns true if tracking was successful
 */
function trackRespect(techId: string): boolean {
  try {
    const now = new Date().getTime();
    const storageKey = `respect_history_${techId}`;

    // Get existing history
    const historyJson = localStorage.getItem(storageKey);
    let history: number[] = historyJson ? JSON.parse(historyJson) : [];

    // Filter out entries older than 24 hours
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    history = history.filter(timestamp => timestamp > oneDayAgo);

    // Check if we're at the limit
    if (history.length >= MAX_RESPECTS_PER_DAY) {
      return false;
    }

    // Add new timestamp and save
    history.push(now);
    localStorage.setItem(storageKey, JSON.stringify(history));
    return true;
  } catch {
    // If localStorage fails, we'll still allow the action
    return true;
  }
}

/**
 * Get the daily respect count and remaining respects for a tech
 * @param techId The tech ID
 * @returns Object with count and remaining respects
 */
function getDailyRespectInfo(techId: string): { count: number; remaining: number } {
  try {
    const now = new Date().getTime();
    const storageKey = `respect_history_${techId}`;

    // Get existing history
    const historyJson = localStorage.getItem(storageKey);
    let history: number[] = historyJson ? JSON.parse(historyJson) : [];

    // Filter out entries older than 24 hours
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    history = history.filter(timestamp => timestamp > oneDayAgo);

    // Save the filtered history back
    localStorage.setItem(storageKey, JSON.stringify(history));

    return {
      count: history.length,
      remaining: Math.max(0, MAX_RESPECTS_PER_DAY - history.length),
    };
  } catch {
    // If localStorage fails, assume no respects
    return { count: 0, remaining: MAX_RESPECTS_PER_DAY };
  }
}

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
