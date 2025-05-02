import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';
import React, { useState } from 'react';

// Interactive wrapper for SearchBar
const SearchBarWrapper = (props: { placeholder?: string }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="p-4 bg-zinc-950 w-full max-w-xl">
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        placeholder={props.placeholder || 'Search…'}
      />
      {query && (
        <div className="mt-4 p-3 bg-zinc-900 rounded-md text-zinc-300 text-sm">
          Current query: <code className="bg-zinc-800 px-1 py-0.5 rounded">{query}</code>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
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
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    query: '',
    onQueryChange: value => console.log('Search query changed:', value),
    placeholder: 'Search technologies...',
  },
};

export const WithValue: Story = {
  args: {
    query: 'React',
    onQueryChange: value => console.log('Search query changed:', value),
    placeholder: 'Search technologies...',
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    query: '',
    onQueryChange: value => console.log('Search query changed:', value),
    placeholder: 'Find a technology...',
  },
};

export const Interactive: Story = {
  render: () => <SearchBarWrapper />,
};

export const InteractiveWithCustomPlaceholder: Story = {
  render: () => <SearchBarWrapper placeholder="Find a dead technology..." />,
};
