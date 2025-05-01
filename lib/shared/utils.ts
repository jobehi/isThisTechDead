/**
 * Shared utility functions
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
 * Format a date as a readable string
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'Unknown';

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'Invalid date';

    // Use explicit formatting with day-month-year format
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return 'Invalid date';
  }
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
 * Format a tech name as a filename
 * @param techName The tech name
 * @param score The score value or string
 * @returns A formatted filename (no extension)
 */
export function formatTechFilename(techName: string, score: string | number): string {
  const formattedName = techName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${formattedName}-${score}`;
}

/**
 * Format a score for display with consistent format
 * @param score The score to format
 * @returns The formatted score with one decimal place
 */
export function formatScore(score: number): string {
  return safeToFixed(score, 1);
}
