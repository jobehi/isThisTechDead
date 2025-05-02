'use client';

import { ReactNode } from 'react';
import { cardBaseVariants, statsItemVariants } from '@/lib/ui';
import { cn } from '@/lib/cn';

interface StatsCardProps {
  title: string;
  icon?: ReactNode;
  variant?: 'default' | 'glow' | 'elevated' | 'outline';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: ReactNode;
  className?: string;
  hoverEffect?: string;
}

/**
 * StatsCard component displays a card with a title and stats inside.
 * Used for displaying grouped metrics or statistics with consistent styling.
 *
 * @example
 * ```tsx
 * import { StatsCard, StatItem, StatRow } from '@/components/molecules';
 *
 * <StatsCard title="GitHub Stats" icon={<GitHubIcon />}>
 *   <div className="grid grid-cols-2 gap-3">
 *     <StatItem label="Stars" value="1.2k" />
 *     <StatItem label="Forks" value="245" color="text-blue-200" />
 *   </div>
 *   <div className="mt-4">
 *     <StatRow label="Last Release" value="v2.1.0" />
 *   </div>
 * </StatsCard>
 * ```
 */
export function StatsCard({
  title,
  icon,
  variant = 'default',
  padding = 'large',
  children,
  className = '',
  hoverEffect = '',
}: StatsCardProps) {
  return (
    <section className={cn(cardBaseVariants({ variant, padding }), hoverEffect, className)}>
      <h2 className="text-xl font-bold mb-4 text-lime-300 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

interface StatItemProps {
  label: string;
  value: React.ReactNode;
  color?: string;
  variant?: 'default' | 'outline' | 'filled';
  padding?: 'small' | 'medium' | 'large';
}

/**
 * StatItem component displays a single statistic with a label and value.
 * Used within a StatsCard for displaying individual metrics.
 */
export function StatItem({
  label,
  value,
  color = 'text-lime-200',
  variant = 'default',
  padding = 'medium',
}: StatItemProps) {
  return (
    <div className={cn(statsItemVariants({ variant, padding }))}>
      <div className="text-zinc-400 text-xs mb-1">{label}</div>
      <div className={`font-bold text-xl ${color}`}>{value}</div>
    </div>
  );
}

/**
 * StatRow component displays a row with a label and value, for more compact layouts.
 * Used within a StatsCard for displaying statistics in a row layout.
 */
export function StatRow({
  label,
  value,
  color = 'text-lime-200',
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-400 text-sm">{label}</span>
      <span className={`font-medium ${color}`}>{value}</span>
    </div>
  );
}
