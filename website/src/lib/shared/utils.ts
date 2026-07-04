/**
 * Shared utility functions
 */

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
 * Format a tech name as a filename
 * @param techName The tech name
 * @param score The score value or string
 * @returns A formatted filename (no extension)
 */
export function formatTechFilename(techName: string, score: string | number): string {
  const formattedName = techName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${formattedName}-${score}`;
}
