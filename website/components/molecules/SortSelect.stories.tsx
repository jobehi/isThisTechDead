import type { Meta, StoryObj } from '@storybook/react';
import { SortSelect, type SortOption } from './SortSelect';
import React, { useState } from 'react';

// Wrapper for interactive control
const SortSelectWrapper = () => {
  const [value, setValue] = useState<SortOption>('deadest');

  return (
    <div className="p-6 bg-zinc-950">
      <h3 className="text-zinc-400 mb-4 text-sm">Current value: {value}</h3>
      <SortSelect value={value} onChange={setValue} />
    </div>
  );
};

const meta: Meta<typeof SortSelect> = {
  title: 'Molecules/SortSelect',
  component: SortSelect,
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
type Story = StoryObj<typeof SortSelect>;

// Static stories for each option
export const Default: Story = {
  args: {
    value: 'deadest',
    onChange: value => console.log('Sort changed to:', value),
  },
};

export const SortByAlive: Story = {
  args: {
    value: 'alive',
    onChange: value => console.log('Sort changed to:', value),
  },
};

export const SortByRecent: Story = {
  args: {
    value: 'recent',
    onChange: value => console.log('Sort changed to:', value),
  },
};

export const SortByName: Story = {
  args: {
    value: 'name',
    onChange: value => console.log('Sort changed to:', value),
  },
};

export const SortByRespect: Story = {
  args: {
    value: 'respect',
    onChange: value => console.log('Sort changed to:', value),
  },
};

// Interactive story that demonstrates state changes
export const Interactive: Story = {
  render: () => <SortSelectWrapper />,
};
