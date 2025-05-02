'use client';

import { formatDate, getScoreColor, safeToFixed } from '@/lib/shared';
import { getSarcasticCommentary } from '@/lib/roast';
import { ScoreIndicator } from '@/components/molecules';
import { DynamicPressFWrapper } from '@/components/features/tech';
import { Snapshot } from '@/domains/tech';
import { textGradientVariants } from '@/lib/ui';
import { cn } from '@/lib/cn';

interface TechHeaderProps {
  techId: string;
  techName: string;
  score: number;
  latestSnapshot: Snapshot | null;
}

/**
 * TechHeader component displays the main heading area for a technology detail page.
 * Shows the tech name, deaditude score, and commentary.
 *
 * @example
 * ```tsx
 * import { TechHeader } from '@/components/organisms';
 *
 * <TechHeader
 *   techId="react"
 *   techName="React"
 *   score={68.5}
 *   latestSnapshot={latestSnapshotData}
 * />
 * ```
 */
export function TechHeader({ techId, techName, score, latestSnapshot }: TechHeaderProps) {
  return (
    <header className="pt-16 pb-8 px-8 sm:px-20 text-center relative overflow-hidden">
      <h1
        className={cn(
          'text-6xl sm:text-7xl font-extrabold mb-3 tracking-tight',
          textGradientVariants({ variant: 'primary', glow: 'subtle' })
        )}
      >
        Is {techName} dead?
      </h1>

      {typeof score === 'number' && !isNaN(score) && (
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex items-center mb-4 justify-center">
            <h2 className="text-2xl font-semibold mr-4">Deaditude Score:</h2>
            <span
              className="text-3xl font-bold px-4 py-2 rounded-md shadow-lg border border-zinc-700 transition-all hover:scale-105 duration-300"
              style={{
                backgroundColor: getScoreColor(score),
                color: score > 50 ? '#fff' : '#000',
              }}
            >
              {safeToFixed(score)}%
            </span>
          </div>

          <ScoreIndicator score={score} size="lg" />

          <div
            className="mt-5 text-lg text-zinc-200 italic max-w-2xl mx-auto px-6 py-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            <span className="text-lime-500 mr-1">&gt;</span> {getSarcasticCommentary(score)}
          </div>
          <div className="mt-2 text-xs text-zinc-500 italic max-w-2xl mx-auto">
            *Data last collected: {formatDate(latestSnapshot?.created_at || '')}, so it might be
            even worse now, sorry.
          </div>

          {/* Pay Respects Button */}
          <div className="mt-8">
            <DynamicPressFWrapper techId={techId} techName={techName} key={`pressf-${techId}`} />
          </div>
        </div>
      )}
    </header>
  );
}
