/**
 * Rating and score utility functions
 */

/**
 * Format a number to a fixed decimal place string
 * @param value The number to format
 * @param digits The number of decimal places (default: 1)
 * @param fallback The fallback value for invalid inputs (default: '0.0')
 * @returns The formatted number as a string
 */
export function safeToFixed(value: number | string, digits = 1, fallback = '0.0'): string {
  if (typeof value !== 'number' || isNaN(Number(value))) {
    return fallback;
  }
  return Number(value).toFixed(digits);
}

/**
 * Get color from score value
 * @param score The score (0-100)
 * @returns A hex color code
 */
export function getScoreColor(score: number | null | undefined): string {
  if (typeof score !== 'number' || isNaN(score)) {
    return '#22c55e'; // Default green
  }

  if (score >= 75) return '#ef4444'; // Red (certified zombie tech)
  if (score >= 50) return '#f97316'; // Orange (putting the "meh" in momentum)
  if (score >= 25) return '#3b82f6'; // Blue (stable and mature)
  return '#22c55e'; // Green (accidentally still alive)
}

/**
 * Get Tailwind color class from score value
 * @param score The score (0-100)
 * @returns A Tailwind color class
 */
export function getScoreColorClass(score: number | null | undefined): string {
  if (typeof score !== 'number' || isNaN(score)) {
    return 'text-green-500'; // Default green
  }

  if (score >= 75) return 'text-red-500'; // Red (certified zombie tech)
  if (score >= 50) return 'text-orange-500'; // Orange (putting the "meh" in momentum)
  if (score >= 25) return 'text-blue-500'; // Blue (stable and mature)
  return 'text-green-500'; // Green (accidentally still alive)
}

/**
 * Get rating label from score value
 * @param score The score (0-100)
 * @returns A rating label string
 */
export function getRatingLabel(score: number | null | undefined): string {
  if (typeof score !== 'number' || isNaN(score)) {
    return 'Unknown';
  }

  if (score >= 75) return 'Certified Zombie';
  if (score >= 50) return 'Dying Slowly';
  if (score >= 25) return 'Stable & Mature';
  return 'Accidentally Alive';
}

/**
 * Calculate deaditude score from raw score
 * @param rawScore The raw deaditude score (0-10)
 * @returns The calculated score (0-100)
 */
export function calculateDeaditudeScore(rawScore: number | null | undefined): number {
  if (typeof rawScore !== 'number' || isNaN(rawScore)) {
    return 0;
  }

  return rawScore * 10;
}

/**
 * Format a score for display with consistent format
 * @param score The score to format
 * @returns The formatted score with one decimal place
 */
export function formatScore(score: number): string {
  return safeToFixed(score, 1);
}
