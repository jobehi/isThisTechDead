import React from 'react';

// SortSelect molecule – dropdown that controls sort order
export type SortOption = 'deadest' | 'alive' | 'recent' | 'name' | 'respect';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="w-full lg:w-64">
      <label htmlFor="sort" className="sr-only">
        Sort by
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
        </div>
        <select
          id="sort"
          name="sort"
          className="block w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-10 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent appearance-none"
          value={value}
          onChange={e => onChange(e.target.value as SortOption)}
        >
          <option value="deadest">Most Dead First</option>
          <option value="alive">Least Dead First</option>
          <option value="respect">Most Respected</option>
          <option value="recent">Recently Updated</option>
          <option value="name">Name (A-Z)</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
