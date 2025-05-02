'use client';

import { useState } from 'react';
import { Dialog } from './Dialog';
import { motion } from 'framer-motion';

/**
 * Custom hook to manage GitHub dialog state and functionality.
 * Provides controls for opening and closing the dialog, as well as setting the personal GitHub link.
 *
 * @example
 * ```tsx
 * import { useGitHubDialog, GitHubDialog } from '@/components/organisms';
 *
 * function MyComponent() {
 *   const { isOpen, setIsOpen, openDialog } = useGitHubDialog();
 *
 *   return (
 *     <>
 *       <a href="#" onClick={openDialog}>View Source Code</a>
 *       <GitHubDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
 *     </>
 *   );
 * }
 * ```
 */
export function useGitHubDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [personalLink, setPersonalLink] = useState('https://github.com/jobehi');

  const openDialog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return {
    isOpen,
    setIsOpen,
    openDialog,
    personalLink,
    setPersonalLink,
  };
}

/**
 * GitHubDialog component displays a humorous dialog about why the source code isn't public yet.
 * Used when users attempt to view private repositories or non-public code.
 *
 * @example
 * ```tsx
 * import { GitHubDialog } from '@/components/organisms';
 *
 * <GitHubDialog
 *   isOpen={isDialogOpen}
 *   onClose={() => setDialogOpen(false)}
 *   personalLink="https://github.com/yourname"
 * />
 * ```
 */
export function GitHubDialog({
  isOpen,
  onClose,
  personalLink = 'https://github.com/jobehi',
}: {
  isOpen: boolean;
  onClose: () => void;
  personalLink?: string;
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Whoa there, code archaeologist!"
      className="max-w-md"
      position="center"
      size="md"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50"
        >
          <p className="text-zinc-300">
            {`Look, I appreciate your enthusiasm for digital dumpster diving, but my sketchy web crawlers and data scrapers aren't ready for the public spotlight yet.`}
          </p>
        </motion.div>

        <p className="text-zinc-400 text-sm">
          {`Let's be real – they're held together with duct tape, wishful thinking, and approximately 17 Stack Overflow answers and 6 AI prompts. Some of them might actually be illegal in several jurisdictions.`}
        </p>

        <div className="mt-4 bg-lime-950/30 rounded-lg p-4 border border-lime-800/30">
          <p className="text-zinc-300 text-sm italic">
            {`I promise to make this code public when it's either decent enough not to embarrass me or when I've fully embraced my role as a chaos agent in the programming ecosystem.`}
          </p>
        </div>

        <div className="bg-gradient-to-br from-lime-950/30 to-zinc-900/50 p-3 rounded-lg border border-lime-800/30 mt-4">
          <a
            href={personalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors"
            onClick={() => onClose()}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="font-medium">Follow me on GitHub for whatever reason</span>
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 rounded-md transition-colors"
          >
            Fine, keep your secrets
          </button>
        </div>
      </div>
    </Dialog>
  );
}
