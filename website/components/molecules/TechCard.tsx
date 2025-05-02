'use client';

import Link from 'next/link';
import { getScoreColor, safeToFixed } from '@/lib/shared';
import { cardBaseVariants } from '@/lib/ui';
import { cn } from '@/lib/cn';
import { ArrowRightIcon } from '../atoms/icons/ArrowRightIcon';

interface TechCardProps {
  id: string;
  name: string;
  score: number | null;
  commentary: string;
  date?: string;
  projectCount?: number;
  variant?: 'default' | 'glow' | 'elevated' | 'outline';
}

/**
 * TechCard component displays a technology card with its deaditude score.
 * Used for displaying technology items in grids or lists.
 *
 * @example
 * ```tsx
 * import { TechCard } from '@/components/molecules';
 *
 * <TechCard
 *   id="react"
 *   name="React"
 *   score={45}
 *   commentary="Still hanging in there despite new frameworks every week."
 *   date="2023-08-15"
 *   projectCount={12}
 * />
 * ```
 */
export function TechCard({
  id,
  name,
  score,
  commentary,
  date,
  projectCount = 0,
  variant = 'glow',
}: TechCardProps) {
  return (
    <Link
      href={`/${id}`}
      className={cn(
        cardBaseVariants({
          variant,
          padding: 'large',
          interactive: true,
        }),
        'group'
      )}
    >
      {score !== null && score >= 75 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center">
          <span className="mr-1">☠️</span> DEAD
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 group-hover:text-lime-400 transition-colors">
        {name}
      </h2>

      {score !== null ? (
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-4 rounded-full transition-all duration-500 ease-out group-hover:animate-pulse"
              style={{
                width: `${score}%`,
                backgroundColor: getScoreColor(score),
              }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm font-medium" style={{ color: getScoreColor(score) }}>
              {safeToFixed(score)}% dead
            </p>

            {date && (
              <div className="text-xs bg-zinc-800 px-2 py-1 rounded-md text-zinc-400">{date}</div>
            )}
          </div>

          <p className="text-sm text-zinc-400 italic line-clamp-2">{`"${commentary}"`}</p>

          {/* Developer project count */}
          {projectCount > 0 && (
            <div className="mt-2 text-xs flex items-center text-lime-400">
              <span className="mr-1">👨‍💻</span>
              <span>
                {projectCount} {projectCount === 1 ? 'dev has' : 'devs have'} submitted projects
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg text-zinc-500 italic">
          {`Not analyzed yet. Ignored like that side project you swore you'd finish.`}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <span className="text-xs text-lime-500 group-hover:translate-x-1 transition-transform duration-300 flex items-center">
          View obituary
          <ArrowRightIcon size={12} className="ml-1" />
        </span>
      </div>
    </Link>
  );
}
