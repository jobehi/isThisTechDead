'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GithubIcon } from '../atoms/icons/GithubIcon';
import { config } from '@/lib/config';

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
                  href={config.site.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-zinc-400 transition-colors"
                  aria-label="Follow us on GitHub"
                >
                  <GithubIcon />
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
                <FooterLink href={config.site.githubUrl}>
                  <span className="flex items-center gap-1.5">
                    <GithubIcon />
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
              {/* referencing our own pages, because we can */}
              <Link href="/nextjs">
                <TechBadge name="Next.js" />
              </Link>
              <Link href="/react">
                <TechBadge name="React" />
              </Link>
              <Link href="/typescript">
                <TechBadge name="TypeScript" />
              </Link>
              <Link href="/tailwind">
                <TechBadge name="Tailwind" />
              </Link>
              <Link href="/supabase">
                <TechBadge name="Supabase" />
              </Link>
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
            <a
              href={config.site.githubUrl + '/issues'}
              className="hover:text-lime-500 transition-colors"
            >
              Report an issue
            </a>
          </div>
        </div>
      </div>
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
