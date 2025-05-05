'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '../atoms/icons/XIcon';
import { MenuIcon } from '../atoms/icons/MenuIcon';
import { cn } from '@/lib/cn';
import { GithubIcon } from '../atoms/icons/GithubIcon';
import { config } from '@/lib/config';
interface SiteHeaderProps {
  rightContent?: React.ReactNode;
  backLink?: boolean;
}

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Custom animated link component
function LinkComponent({ href, children, className = '', onClick }: LinkProps) {
  // Fix for exactOptionalPropertyTypes compatibility
  const linkProps = {
    href,
    className: cn(
      'relative px-3 py-2 text-zinc-400 hover:text-white transition-colors duration-300 group',
      className
    ),
    ...(onClick ? { onClick } : {}),
  };

  return (
    <Link {...linkProps}>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-lg bg-zinc-800/0 group-hover:bg-zinc-800/50 transform transition-all duration-300 group-hover:scale-110 backdrop-blur-sm" />
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-lime-500 to-emerald-600 rounded-full"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </Link>
  );
}

export function SiteHeader({ rightContent }: SiteHeaderProps) {
  // Header is now always visible with background, no scroll listener needed
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // No scroll listener required for static header

  // Handle keyboard escape for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 shadow-lg py-4',
        'bg-zinc-950/80 backdrop-blur-xl'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and title */}
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/is_this_tech_dead_logo_small_2.png"
              alt="Is This Tech Dead?"
              width={100}
              height={0}
            />
            <div>
              <span className="font-bold text-white block leading-tight">Is This Tech Dead?</span>
              <div className="text-xs text-zinc-500 flex items-center gap-1">
                <span>{formattedDate}</span>
                <span className="inline-block h-1 w-1 rounded-full bg-zinc-700 mx-0.5" />
                <span className="text-lime-500 animate-pulse">Live</span>
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <LinkComponent href="/">Home</LinkComponent>
            <LinkComponent href="/methodology">Methodology</LinkComponent>
            <LinkComponent href="/newsletter" className="text-lime-400 hover:text-lime-300">
              Newsletter
            </LinkComponent>

            <div className="border-l border-zinc-800 h-6 mx-2"></div>
            {/* Github with icon */}
            <a
              href={config.site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-zinc-400 transition-colors"
              aria-label="Follow us on GitHub"
            >
              <GithubIcon />
            </a>

            {/* space */}
            <div className="h-6 mx-2"></div>

            <div className="flex items-center space-x-4">
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
            </div>
            <div className="border-l border-zinc-800 h-6 mx-2"></div>

            {rightContent && <div className="ml-4">{rightContent}</div>}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              // Using direct styles instead of variants for mobile menu to ensure consistent display across devices
              className="md:hidden mt-4 rounded-xl overflow-hidden bg-zinc-900/80 backdrop-blur-xl"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-3 flex flex-col space-y-2">
                <LinkComponent
                  href="/"
                  className="text-lime-50 hover:text-lime-200 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Home
                </LinkComponent>
                <LinkComponent
                  href="/methodology"
                  className="text-lime-50 hover:text-lime-200 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Methodology
                </LinkComponent>
                <LinkComponent
                  href="/newsletter"
                  className="text-lime-400 hover:text-lime-300 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Newsletter
                </LinkComponent>

                <div className="pt-4 pb-2">
                  <div className="flex items-center space-x-4">
                    <a
                      href={config.site.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-zinc-400 transition-colors"
                      aria-label="Follow us on GitHub"
                    >
                      <GithubIcon />
                    </a>

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
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
