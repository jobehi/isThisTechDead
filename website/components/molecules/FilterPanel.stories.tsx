import type { Meta, StoryObj } from '@storybook/react';
import { FilterPanel } from './FilterPanel';
import React, { useState } from 'react';
import { SortOption } from './SortSelect';

// Interactive wrapper for the FilterPanel
const FilterPanelWrapper = () => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('deadest');

  return (
    <div className="p-6 bg-zinc-950">
      <div className="mb-4 text-zinc-400 text-sm">
        <div>
          Current query:{' '}
          <code className="bg-zinc-800 px-1 py-0.5 rounded">{query || '(empty)'}</code>
        </div>
        <div>
          Current sort: <code className="bg-zinc-800 px-1 py-0.5 rounded">{sort}</code>
        </div>
      </div>
      <FilterPanel query={query} onQueryChange={setQuery} sort={sort} onSortChange={setSort} />
    </div>
  );
};

const meta: Meta<typeof FilterPanel> = {
  title: 'Molecules/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#09090b',
        },
      ],
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterPanel>;

export const Default: Story = {
  args: {
    query: '',
    onQueryChange: query => console.log('Query changed:', query),
    sort: 'deadest',
    onSortChange: sort => console.log('Sort changed:', sort),
  },
};

export const WithQuery: Story = {
  args: {
    query: 'React',
    onQueryChange: query => console.log('Query changed:', query),
    sort: 'deadest',
    onSortChange: sort => console.log('Sort changed:', sort),
  },
};

export const WithCustomSort: Story = {
  args: {
    query: '',
    onQueryChange: query => console.log('Query changed:', query),
    sort: 'respect',
    onSortChange: sort => console.log('Sort changed:', sort),
  },
};

export const Interactive: Story = {
  render: () => <FilterPanelWrapper />,
};
