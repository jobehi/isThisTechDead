'use client';

import { getScoreColor, safeToFixed } from '@/lib/shared';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreIndicatorProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
  premium?: boolean;
  showGlow?: boolean;
}

/**
 * ScoreIndicator component displays a visual progress bar representing a score value.
 * Features include animated filling, color gradients based on score, and premium visual effects.
 *
 * @example
 * ```tsx
 * import { ScoreIndicator } from '@/components/molecules';
 *
 * <ScoreIndicator score={75} />
 * <ScoreIndicator score={30} size="lg" premium={true} />
 * <ScoreIndicator score={95} showGlow={true} animate={false} />
 * ```
 */
export function ScoreIndicator({
  score,
  showLabel = true,
  size = 'md',
  className = '',
  animate = true,
  premium = false,
  showGlow = false,
}: ScoreIndicatorProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const height = size === 'sm' ? 'h-2' : size === 'md' ? 'h-3' : 'h-4';
  const fontClass = size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm';

  useEffect(() => {
    if (!animate) {
      setAnimatedScore(score);
      return;
    }

    // Animated score effect
    const end = score;
    const duration = 1200;
    const startTime = Date.now();

    const animateScore = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutExpo for a nicer animation curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentScore = Math.floor(easeProgress * end);

      setAnimatedScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animateScore);
      }
    };

    requestAnimationFrame(animateScore);
  }, [score, animate]);

  // Determine subtle pulse effect for high scores
  const pulseIntensity = score > 80 ? '4s' : score > 60 ? '6s' : null;

  // Get the label text with appropriate humor based on score
  const getScoreLabel = (score: number) => {
    if (score <= 10) return 'Still Thriving';
    if (score <= 25) return `${safeToFixed(score)}%`;
    if (score <= 50) return `${safeToFixed(score)}%`;
    if (score <= 75) return `${safeToFixed(score)}%`;
    if (score <= 90) return `${safeToFixed(score)}%`;
    return 'Terminal';
  };

  // Get radar-like scanning effect for premium mode
  const scanAnimation = premium
    ? {
        x: ['0%', '100%', '0%'],
        opacity: [0, 0.8, 0],
      }
    : {};

  const scanTransition = premium
    ? {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 2,
      }
    : {};

  return (
    <div className={`${className} space-y-1.5`}>
      {/* Main bar container with subtle background pattern */}
      <div
        className={`${height} bg-zinc-800/50 rounded-full w-full overflow-hidden relative ${premium ? 'backdrop-blur-sm' : ''}`}
      >
        {/* Background pattern for premium mode */}
        {premium && (
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)',
              backgroundSize: '8px 8px',
            }}
          />
        )}

        {/* Score bar with dynamic animation */}
        <motion.div
          className={`${height} rounded-full flex items-center justify-end pr-1.5 font-medium ${fontClass}`}
          style={{
            backgroundColor: getScoreColor(animatedScore),
            color: animatedScore > 50 ? '#fff' : '#000',
          }}
          initial={{ width: 0 }}
          animate={{
            width: `${animatedScore}%`,
            boxShadow: showGlow && pulseIntensity ? '0 0 8px 1px rgba(255, 255, 255, 0.2)' : 'none',
          }}
          transition={{
            duration: animate ? 0.8 : 0,
            ease: [0.34, 1.3, 0.64, 1], // Spring-like effect
          }}
        >
          {/* Score label */}
          {showLabel && animatedScore > 25 && (
            <div className="relative z-10">{getScoreLabel(animatedScore)}</div>
          )}

          {/* Scanning effect for premium mode */}
          {premium && (
            <motion.div
              className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ opacity: 0.2 }}
              animate={scanAnimation}
              transition={scanTransition}
            />
          )}
        </motion.div>

        {/* Label for low scores */}
        {showLabel && animatedScore <= 25 && (
          <div
            className={`absolute top-0 right-0 ${height} flex items-center pl-2 pr-2 font-medium ${fontClass} text-zinc-300`}
          >
            {getScoreLabel(animatedScore)}
          </div>
        )}
      </div>

      {/* Score metrics */}
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">Alive</span>
          <motion.span
            className="font-medium text-[11px]"
            style={{ color: getScoreColor(animatedScore) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animate ? 0.6 : 0, duration: 0.3 }}
          >
            {safeToFixed(animatedScore)}%
          </motion.span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">Dead</span>
        </div>
      )}

      {/* Add subtle glitch effect for high scores if showGlow is enabled */}
      {showGlow && score > 85 && (
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          animate={{
            opacity: [0, 0.1, 0, 0.15, 0],
            x: [0, -1, 1, -1, 0],
            y: [0, 1, -1, 0, 0],
            scaleX: [1, 1.005, 0.995, 1.01, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatType: 'loop',
            times: [0, 0.2, 0.4, 0.6, 1],
            ease: 'easeInOut',
            repeatDelay: 3,
          }}
        />
      )}
    </div>
  );
}
