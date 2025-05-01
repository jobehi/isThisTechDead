import { describe, it, expect } from 'vitest';
import { safeToFixed, calculateDeaditudeScore, getScoreColor } from '../utils';

describe('utils', () => {
  it('safeToFixed returns fallback for invalid input', () => {
    expect(safeToFixed('abc' as unknown as number)).toBe('0.0');
  });

  it('calculateDeaditudeScore converts 0-10 scale to 0-100', () => {
    expect(calculateDeaditudeScore(7)).toBe(70);
  });

  it('getScoreColor returns correct color for score', () => {
    expect(getScoreColor(75)).toBe('#ef4444');
    expect(getScoreColor(50)).toBe('#f97316');
    expect(getScoreColor(25)).toBe('#3b82f6');
    expect(getScoreColor(0)).toBe('#22c55e');
  });

  it('getScoreColor returns default color for invalid score', () => {
    expect(getScoreColor(null)).toBe('#22c55e');
    expect(getScoreColor(undefined)).toBe('#22c55e');
    expect(getScoreColor('abc' as unknown as number)).toBe('#22c55e');
  });
});
