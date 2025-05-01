/**
 * Utility functions for scripts
 * @deprecated Import from @/lib/shared instead
 */

import {
  formatDate as sharedFormatDate,
  getScoreColor as sharedGetScoreColor,
  formatTechFilename,
} from '@/lib/shared';

/**
 * Format a date as a readable string
 * @deprecated Use @/lib/shared/utils instead
 */
export function formatDate(dateString: string | undefined | null): string {
  return sharedFormatDate(dateString);
}

/**
 * Get color from score value, returns a hex color
 * @deprecated Use @/lib/shared/utils instead
 */
export function getScoreColor(score: number | null | undefined): string {
  return sharedGetScoreColor(score);
}

/**
 * Simple logging utilities for better script output
 */
export const logger = {
  info: (message: string): void => {
    console.log(`ℹ️ ${message}`);
  },
  success: (message: string): void => {
    console.log(`✅ ${message}`);
  },
  warn: (message: string): void => {
    console.log(`⚠️ ${message}`);
  },
  error: (message: string, error?: unknown): void => {
    console.error(`❌ ${message}`, error || '');
  },
};

/**
 * Utility to format a filename from a tech name
 * @deprecated Use formatTechFilename from @/lib/shared instead
 */
export function formatFilename(techName: string, score: string | number): string {
  return formatTechFilename(techName, score);
}
