'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  glitchOnHover?: boolean;
}

/**
 * GlitchText component creates text with a cyberpunk-inspired glitch effect.
 * Supports different intensity levels and can trigger on hover or randomly.
 *
 * @example
 * ```tsx
 * import { GlitchText } from '@/components/molecules';
 *
 * <GlitchText text="Is This Tech Dead?" />
 * <GlitchText
 *   text="CRITICAL ERROR"
 *   intensity="high"
 *   color="lime"
 *   as="h2"
 *   glitchOnHover={true}
 * />
 * ```
 */
export function GlitchText({
  text,
  className = '',
  intensity = 'medium',
  color = 'lime',
  as: Component = 'span',
  glitchOnHover = false,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  const colorClass = color === 'lime' ? 'text-lime-400' : '';

  // Glitch characters that could replace original ones
  const glitchChars = '!<>-_\\/@#$%^&*()=+[]{}?|;:~'.split('');

  // Configure intensity
  const glitchInterval = intensity === 'low' ? 300 : intensity === 'medium' ? 200 : 100;
  const glitchProbability = intensity === 'low' ? 0.1 : intensity === 'medium' ? 0.3 : 0.5;
  const glitchDuration = intensity === 'low' ? 1000 : intensity === 'medium' ? 1500 : 2500;

  const handleGlitchStart = useCallback(() => {
    if (isGlitching) return;

    setIsGlitching(true);

    // Create the glitch effect
    let iterations = 0;
    const maxIterations = intensity === 'low' ? 3 : intensity === 'medium' ? 6 : 10;

    const glitchEffect = setInterval(() => {
      if (iterations >= maxIterations) {
        // End the effect
        clearInterval(glitchEffect);
        setDisplayText(text);
        setTimeout(() => setIsGlitching(false), 500);
        return;
      }

      // Scramble some characters
      const scrambledText = text
        .split('')
        .map(char => {
          if (char === ' ') return ' ';
          if (Math.random() < glitchProbability) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        })
        .join('');

      setDisplayText(scrambledText);
      iterations++;
    }, glitchInterval);

    // Ensure the glitch effect ends
    setTimeout(() => {
      clearInterval(glitchEffect);
      setDisplayText(text);
      setIsGlitching(false);
    }, glitchDuration);
  }, [
    isGlitching,
    text,
    glitchChars,
    glitchProbability,
    glitchInterval,
    glitchDuration,
    intensity,
  ]);

  useEffect(() => {
    setDisplayText(text);

    if (glitchOnHover) {
      return;
    }

    // Periodically trigger the glitch effect
    const triggerInterval = setInterval(
      () => {
        if (Math.random() < 0.1) {
          // 10% chance to glitch
          handleGlitchStart();
        }
      },
      8000 + Math.random() * 10000
    ); // Random interval between 8-18 seconds

    return () => clearInterval(triggerInterval);
  }, [text, glitchOnHover, handleGlitchStart]);

  // Animation variants for the motion component
  const containerVariants: Variants = {
    normal: {
      x: 0,
      y: 0,
      skew: 0,
    },
    glitching: {
      x: [0, -1, 2, 0, -2, 1, 0],
      y: [0, 1, -1, 0, 2, -1, 0],
      skew: [0, -1, 2, 0, -2, 1, 0],
      transition: {
        duration: 0.4,
        times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
        ease: 'easeInOut',
        repeat: isGlitching ? Infinity : 0,
        repeatType: 'loop' as const,
      },
    },
  };

  return (
    <Component
      className={`relative inline-block ${colorClass} ${className}`}
      onMouseEnter={glitchOnHover ? handleGlitchStart : undefined}
    >
      <motion.span
        className="relative inline-block"
        variants={containerVariants}
        animate={isGlitching ? 'glitching' : 'normal'}
      >
        {displayText}

        {/* Overlay pseudo-elements for the glitch effect */}
        {isGlitching && (
          <>
            <motion.span
              className="absolute left-0 top-0 opacity-80 text-red-500 mix-blend-multiply"
              animate={{
                x: [0, -2, 1, -3, 0],
                opacity: [0.8, 0.4, 0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                textShadow: '1px 0 red',
              }}
            >
              {displayText}
            </motion.span>

            <motion.span
              className="absolute left-0 top-0 opacity-80 text-cyan-500 mix-blend-multiply"
              animate={{
                x: [0, 2, -1, 3, 0],
                opacity: [0.8, 0.3, 0.8, 0.6, 0.8],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatType: 'loop',
                delay: 0.05,
              }}
              style={{
                clipPath: 'polygon(0 45%, 100% 45%, 100% 100%, 0 100%)',
                textShadow: '-1px 0 cyan',
              }}
            >
              {displayText}
            </motion.span>
          </>
        )}
      </motion.span>
    </Component>
  );
}
