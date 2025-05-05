'use client';

import { config } from '@/lib/config';
import logger from '@/lib/logger';

// Use the centralized config
const MAX_RESPECTS_PER_DAY = config.security.rateLimits.respect.maxPerDay;

/**
 * Track a respect in localStorage with timestamp
 * @param techId The tech ID
 * @returns true if tracking was successful
 */
export function trackRespect(techId: string): boolean {
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
  } catch (err) {
    // Don't silently swallow errors - log them
    logger.warn('Error tracking respect in localStorage:', err);
    // If localStorage fails, we'll still allow the action
    return true;
  }
}

/**
 * Get the daily respect count and remaining respects for a tech
 * @param techId The tech ID
 * @returns Object with count and remaining respects
 */
export function getDailyRespectInfo(techId: string): { count: number; remaining: number } {
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
  } catch (err) {
    // Don't silently swallow errors - log them
    logger.warn('Error getting daily respect info:', err);
    // If localStorage fails, assume no respects
    return { count: 0, remaining: MAX_RESPECTS_PER_DAY };
  }
}

/**
 * Hook to manage respect quota locally in localStorage
 */
export function useLocalRespectQuota() {
  return {
    trackRespect,
    getDailyRespectInfo,
    MAX_RESPECTS_PER_DAY,
  };
}
