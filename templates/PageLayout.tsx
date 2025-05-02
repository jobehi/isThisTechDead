'use client';

import { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@/components/organisms';

interface PageLayoutProps {
  children: ReactNode;
  headerRightContent?: ReactNode;
  showBackLink?: boolean;
  pageTransition?: boolean;
}

/**
 * PageLayout template provides the base layout structure for all pages.
 * Includes site header, footer, and common background effects.
 *
 * @example
 * ```tsx
 * import { PageLayout } from '@/templates';
 *
 * export default function MyPage() {
 *   return (
 *     <PageLayout>
 *       <div>My page content</div>
 *     </PageLayout>
 *   );
 * }
 * ```
 */
export function PageLayout({
  children,
  headerRightContent,
  showBackLink = false,
}: PageLayoutProps) {
  return (
    // Offset the fixed header (132px) by adding top padding so content begins below it
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      {/* Subtle gradient background with hue, Glass effect*/}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900/60 to-black/90 -z-30" />

      <SiteHeader rightContent={headerRightContent} backLink={showBackLink} />

      <main className="mt-[132px] relative z-0 flex-grow text-zinc-100 min-h-[calc(100vh-160px)]">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
