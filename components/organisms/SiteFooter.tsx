'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GitHubDialog, useGitHubDialog } from '@/components/organisms';

/**
 * SiteFooter component provides the main footer for the application.
 * Contains links, branding, tech stack, and GitHub dialog.
 *
 * @example
 * ```tsx
 * import { SiteFooter } from '@/components/organisms';
 *
 * <SiteFooter />
 * ```
 */
export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const {
    isOpen: isGitHubDialogOpen,
    setIsOpen: setGitHubDialogOpen,
    openDialog,
  } = useGitHubDialog();

  return (
    <footer className="relative mt-24">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-lime-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Branding section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="group flex items-center gap-2">
                <Image src="/old_pc.png" alt="Is This Tech Dead?" width={30} height={0} />
              </Link>

              <h2 className="font-bold text-white">Is This Tech Dead?</h2>
            </div>

            <p className="text-zinc-400 text-sm">
              Examining the vitality of technologies with data-driven insights. Track trends and
              make informed decisions about the tools you use.
            </p>

            <p className="text-zinc-500 text-xs">
              Digital autopsies performed since 2025. <br />© {currentYear} All rights reserved.
            </p>

            {/* Social Media Links */}
            <div className="mt-4 pt-4 border-t border-zinc-800/30">
              <h3 className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-3">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://bsky.app/profile/isthistechdead.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-zinc-400 transition-colors"
                  aria-label="Follow us on Bluesky"
                >
                  <Image
                    src="/bluesky.svg"
                    alt="Bluesky"
                    width={40}
                    height={40}
                    className="w-6 h-6"
                  />
                </a>
                <a
                  href="#"
                  onClick={openDialog}
                  className="text-white hover:text-zinc-400 transition-colors"
                  aria-label="View GitHub repository"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation section */}
          <div>
            <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <FooterLink href="/">Home</FooterLink>
              </li>
              <li>
                <FooterLink href="/methodology">Our Methodology</FooterLink>
              </li>
              <li>
                <FooterLink href="/newsletter" className="text-lime-400 hover:text-lime-300">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Tech Death Alerts
                  </span>
                </FooterLink>
              </li>
              <li>
                <FooterLink href="#" onClick={openDialog}>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub Repository
                  </span>
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Tech stack section */}
          <div>
            <h3 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">
              Built With
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <TechBadge name="Next.js" />
              <TechBadge name="React" />
              <TechBadge name="TypeScript" />
              <TechBadge name="Tailwind" />
              <TechBadge name="Supabase" />
            </div>

            <div className="mt-6 text-xs text-zinc-500">
              <p>
                {`The irony is not lost on us that we're tracking dying tech while using some of these.`}
              </p>
            </div>
          </div>
        </div>

        {/* Credits bar */}
        <div className="mt-12 pt-6 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center text-zinc-500 text-xs">
          <div>Made with data and a sense of humor</div>
          <div className="mt-4 sm:mt-0 flex gap-4">
            <Link href="/terms" className="hover:text-lime-500 transition-colors">
              Terms & Privacy
            </Link>
            <a href="#" onClick={openDialog} className="hover:text-lime-500 transition-colors">
              Report an issue
            </a>
          </div>
        </div>
      </div>

      {/* GitHub Dialog */}
      <GitHubDialog isOpen={isGitHubDialogOpen} onClose={() => setGitHubDialogOpen(false)} />
    </footer>
  );
}

// Footer link component with hover effect
function FooterLink({
  href,
  children,
  className = '',
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  // Fix for exactOptionalPropertyTypes compatibility
  const linkProps = {
    href,
    className: `text-zinc-400 hover:text-lime-500 transition-colors duration-300 inline-block ${className}`,
    ...(onClick ? { onClick } : {}),
  };

  return (
    <Link {...linkProps}>
      <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    </Link>
  );
}

// Tech badge component
function TechBadge({ name }: { name: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400">
      {name}
    </div>
  );
}
