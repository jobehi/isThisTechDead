import React from 'react';
import { SearchIcon } from '../atoms/icons/SearchIcon';
import { XIcon } from '../atoms/icons/XIcon';
import { cn } from '@/lib/cn';

// SearchBar molecule – encapsulates the styled search input with icon and clear button
interface SearchBarProps {
  /** Current search query */
  query: string;
  /** Callback fired when the search query string changes */
  onQueryChange: (value: string) => void;
  /** Placeholder text (optional) */
  placeholder?: string;
  /** Optional additional class names */
  className?: string;
}

export function SearchBar({
  query,
  onQueryChange,
  placeholder = 'Search…',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('flex-grow relative', className)}>
      <label htmlFor="search" className="sr-only">
        Search technologies
      </label>
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-zinc-500" />
        </div>

        {/* Input */}
        <input
          id="search"
          name="search"
          type="search"
          placeholder={placeholder}
          className={cn(
            'block w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-12',
            'text-zinc-300 text-base placeholder-zinc-500',
            'focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent'
          )}
          value={query}
          onChange={e => onQueryChange(e.target.value)}
        />

        {/* Clear button */}
        {query && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
