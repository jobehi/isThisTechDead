import roastsData from '../data/roasts.json';

// Map JSON structure to the array structure expected by the app
export const roastLevels = {
  0: roastsData['0_20'],
  1: roastsData['20_40'],
  2: roastsData['40_60'],
  3: roastsData['60_80'],
  4: roastsData['80_100'],
};

export function getSarcasticCommentary(score: number | undefined | null): string {
  // Default to level 0 if score is undefined, null or not a number
  if (score === undefined || score === null || isNaN(score)) {
    const defaultRoasts = roastsData['no_data'] || roastLevels[0];
    const index = Math.floor(Math.random() * defaultRoasts.length);
    return defaultRoasts[index] as string;
  }

  // Ensure score is between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Calculate roast level, ensuring it's between 0 and 4
  const roastLevel = Math.min(4, Math.max(0, Math.floor(normalizedScore / 25))) as
    0 | 1 | 2 | 3 | 4;

  // Ensure the selected roast level exists, default to level 0 if not
  const roastsForLevel = roastLevels[roastLevel] || roastLevels[0];

  // Get a random roast from the appropriate level
  const index = Math.floor(Math.random() * roastsForLevel.length);
  return roastsForLevel[index] as string;
}
