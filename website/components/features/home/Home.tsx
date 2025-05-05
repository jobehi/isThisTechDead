'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { formatDate } from '@/lib/shared/utils';
import { PageLayout } from '@/templates';
import { NewsletterBox } from '@/components/organisms';
import { Pagination, FilterPanel, TechGrid } from '@/components/molecules';
import type { SortOption as SortOptionType } from '@/components/molecules';
import type { TechWithScore as Tech } from '@/domains';
import { XIcon } from '@/components/atoms/icons/XIcon';
import { ClientOnly } from '@/components/atoms';

/**
 * Home feature component provides the main landing page with filterable tech cards.
 *
 * @example
 * ```tsx
 * import { Home } from '@/components/features';
 *
 * <Home initialTechs={techData} />
 * ```
 */

// Define AdItem type for our combined array
interface AdItem {
  type: 'ad';
  adType: 'text' | 'image';
  position: number;
}

// Tech wrapped in a container type
interface TechItem {
  type: 'tech';
  data: Tech;
}

// Combined type
type GridItem = TechItem | AdItem;

// Reuse SortOption type from molecules to keep typing consistent
type SortOption = SortOptionType;

// Props interface
interface HomeProps {
  initialTechs: Tech[];
}

// FilterableContent component that uses searchParams (wrapped in Suspense)
function FilterableContent({ techs }: { techs: Tech[] }) {
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>('deadest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load persisted sort and viewMode from localStorage
  useEffect(() => {
    const storedSort = localStorage.getItem('techdead_sort') as SortOption;
    if (storedSort) setSortOption(storedSort);
    const storedView = localStorage.getItem('techdead_view') as 'grid' | 'list';
    if (storedView) setViewMode(storedView);
    const storedPage = localStorage.getItem('techdead_page');
    if (storedPage) setCurrentPage(Math.max(1, Number(storedPage)));
  }, []);

  const itemsPerPage = viewMode === 'grid' ? 8 : 12;

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Get the respect count for a tech - now just using the static count from build time
  // we want to avoid thousands of requests to the database for this
  // If people are paying for respect, we respect their sorrow but I ain't paying for it now
  // Maybe later.
  const getRespectCount = useCallback((tech: Tech) => {
    return tech.respect_count;
  }, []);

  // Persist sort and viewMode
  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    localStorage.setItem('techdead_sort', newSort);
  };

  // Persist page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    localStorage.setItem('techdead_page', newPage.toString());
  };

  // Filter and sort techs
  const filteredAndSortedTechs = useMemo(() => {
    if (!techs.length) return [];

    // Filter by search term
    let filtered = techs;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tech =>
          tech.name.toLowerCase().includes(query) ||
          (tech.description && tech.description.toLowerCase().includes(query))
      );
    }

    // Sort the filtered results
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'deadest':
          return (b.latest_score || 0) - (a.latest_score || 0);
        case 'alive':
          return (a.latest_score || 0) - (b.latest_score || 0);
        case 'respect':
          // Using build-time respect counts
          return b.respect_count - a.respect_count;
        case 'recent':
          return (
            new Date(b.latest_snapshot_date || 0).getTime() -
            new Date(a.latest_snapshot_date || 0).getTime()
          );
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [techs, searchQuery, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTechs.length / itemsPerPage);
  const paginatedTechs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTechs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTechs, currentPage, itemsPerPage]);

  // Create a combined array of techs and ads
  const techsWithAds = useMemo(() => {
    // First convert all tech items to the wrapper type
    const techItems: TechItem[] = paginatedTechs.map(tech => ({
      type: 'tech',
      data: tech,
    }));

    const result: GridItem[] = [...techItems];

    // Insert ads every 5 cards
    [5, 10, 15].forEach(position => {
      if (position < result.length) {
        // Insert an ad object
        result.splice(position, 0, {
          type: 'ad',
          position,
          adType: 'image',
        });
      }
    });

    return result;
  }, [paginatedTechs]);

  return (
    <main className="flex-grow px-8 pb-2 sm:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Search, Sort and Filter Section */}
        <section className="mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 shadow-lg">
              <FilterPanel
                query={searchQuery}
                onQueryChange={val => setSearchQuery(val)}
                sort={sortOption}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </section>

        {/* List of Tech Cards */}
        <section className="mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-zinc-400 font-mono flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-lime-500 animate-pulse mr-2"></span>
                {filteredAndSortedTechs.length} entries found
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
              </div>
            ) : filteredAndSortedTechs.length === 0 ? (
              <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 text-center shadow-lg">
                <div className="mb-4 text-5xl">🤷‍♂️</div>
                <h3 className="text-2xl font-bold text-zinc-200 mb-2">No dead tech found</h3>
                <p className="text-zinc-400 max-w-lg mx-auto">
                  Either your search is too obscure or your tech is still alive and kicking (for
                  now). Try a different search term.
                  <br />
                  <br />
                  We list techs manually currently, so if you think a tech should be listed, please
                  <a
                    href="https://github.com/jobehi/is-this-tech-dead-front/issues"
                    className="text-lime-500 hover:text-lime-400 transition-colors pl-2"
                  >
                    open an issue on GitHub
                  </a>{' '}
                  and tell us why we should care. (We do)
                </p>
                <br />

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      // Reset to page 1 when clearing search and update URL params
                      localStorage.setItem('techdead_sort', 'deadest');
                      localStorage.setItem('techdead_view', 'grid');
                    }}
                    className="mt-6 inline-flex items-center px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-500 transition-colors duration-300"
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <TechGrid
                techs={techsWithAds
                  .filter((i): i is TechItem => i.type === 'tech')
                  .map(i => i.data)}
                getRespectCount={getRespectCount}
              />
            )}

            {filteredAndSortedTechs.length > 0 && (
              <div className="mt-12 text-center">
                {/* Pagination controls */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mb-8"
                  />
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// Loading fallback
function TechListingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
    </div>
  );
}

// Static list so reference is stable across renders
const SNARKY_TAGLINES = [
  "Your favorite tech stack's inevitable journey toward the digital graveyard",
  'Where hopes, dreams, and frameworks come to die',
  'Tracking the pulse of tech that flatlined years ago',
  "You're still using THAT? How adorable.",
  "Breaking developers' hearts since you got your CS degree",
  'Documenting technological natural selection in real-time',
  'The only tech obituary site with 100% schadenfreude',
  // Add more if you dare
];

// Home client component
export function Home({ initialTechs }: HomeProps) {
  const headerRightContent = (
    <div className="text-xs text-zinc-400 flex items-center">
      <span className="animate-pulse mr-2 text-red-500">●</span>
      Last updated: <ClientOnly fallback="...">{formatDate(new Date().toISOString())}</ClientOnly>
    </div>
  );

  return (
    <PageLayout headerRightContent={headerRightContent}>
      <header className="relative pt-20 pb-16">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <h1 className="text-center text-6xl sm:text-7xl md:text-8xl font-black mb-2 leading-none">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-grey drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">
                Is This Tech Dead?
              </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-zinc-400 max-w-3xl text-center font-light italic">
              <ClientOnly fallback="Loading tagline...">
                {SNARKY_TAGLINES[Math.floor(Math.random() * SNARKY_TAGLINES.length)]}
              </ClientOnly>
            </p>
          </div>
        </div>
      </header>

      {/* Wrap the part using useSearchParams in Suspense */}
      <Suspense fallback={<TechListingFallback />}>
        <FilterableContent techs={initialTechs} />
      </Suspense>

      <div id="newsletter" className="max-w-4xl mx-auto px-8 mb-12 mt-16">
        <NewsletterBox />
      </div>
    </PageLayout>
  );
}
