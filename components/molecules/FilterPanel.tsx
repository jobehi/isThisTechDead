import React from 'react';
import { SearchBar } from './SearchBar';
import { SortSelect, SortOption } from './SortSelect';

interface FilterPanelProps {
  query: string;
  onQueryChange: (val: string) => void;
  sort: SortOption;
  onSortChange: (val: SortOption) => void;
  className?: string;
}

/**
 * FilterPanel – wraps search input and sort dropdown into a single flex row.
 * Keeps Home.tsx lean while retaining the exact same markup structure/styles.
 */
export function FilterPanel({
  query,
  onQueryChange,
  sort,
  onSortChange,
  className = '',
}: FilterPanelProps) {
  return (
    <div className={`flex flex-col lg:flex-row gap-4 ${className}`.trim()}>
      <SearchBar
        query={query}
        onQueryChange={onQueryChange}
        placeholder="Search for your dead tech..."
      />
      <SortSelect value={sort} onChange={onSortChange} />
    </div>
  );
}
