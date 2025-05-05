'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

interface OpenSourceBannerProps {
  className?: string;
}

/**
 * A banner component to showcase that the project is fully open source.
 *
 * @example
 * ```tsx
 * import { OpenSourceBanner } from '@/components/molecules';
 *
 * <OpenSourceBanner />
 * ```
 */
export function OpenSourceBanner({ className = '' }: OpenSourceBannerProps) {
  return (
    <div
      className={`${className} w-full bg-gradient-to-r from-lime-900/40 via-zinc-800/20 to-lime-900/40 backdrop-blur-sm border-y border-lime-800/50 py-3`}
    >
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-lime-400 font-medium flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-lime-500 animate-pulse mr-2"></span>
          Now fully open source!
        </span>

        <Link
          href="https://github.com/jobehi/isThisTechDead"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-full px-4 py-1.5 text-sm transition-colors"
        >
          <FaGithub size={16} />
          <span>View on GitHub</span>
        </Link>
      </motion.div>
    </div>
  );
}
