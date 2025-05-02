import type { Meta, StoryObj } from '@storybook/react';
import { TechCard } from './TechCard';
import React from 'react';

// Improved wrapper for TechCard to prevent clipping and ensure proper rendering
const TechCardWrapper = (props: React.ComponentProps<typeof TechCard>) => (
  <div
    style={{
      padding: '24px',
      display: 'block',
      background: 'transparent',
      maxWidth: '400px',
      margin: '0 auto',
    }}
  >
    <TechCard {...props} />
  </div>
);

const meta: Meta<typeof TechCard> = {
  title: 'Molecules/TechCard',
  component: TechCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#09090b', // zinc-950
        },
      ],
    },
  },
  tags: ['autodocs'],
  // Use the wrapper for all stories
  decorators: [(Story, context) => <TechCardWrapper {...context.args} />],
};

export default meta;
type Story = StoryObj<typeof TechCard>;

export const Glow: Story = {
  args: {
    id: 'react',
    name: 'React',
    score: 35,
    commentary: 'Still hanging in there despite new frameworks every week.',
    date: '2024-06-15',
    projectCount: 12,
    variant: 'glow',
  },
};

export const Default: Story = {
  args: {
    id: 'jquery',
    name: 'jQuery',
    score: 85,
    commentary: 'Write less, do more… mostly in legacy code bases.',
    date: '2024-02-01',
    projectCount: 5,
    variant: 'default',
  },
};

export const Outline: Story = {
  args: {
    id: 'backbone',
    name: 'Backbone.js',
    score: 70,
    commentary: 'A classic framework that paved the way.',
    date: '2023-12-10',
    projectCount: 2,
    variant: 'outline',
  },
};

export const Elevated: Story = {
  args: {
    id: 'svelte',
    name: 'Svelte',
    score: 15,
    commentary: 'Compiles away to pure JS & excitement.',
    date: '2024-06-01',
    projectCount: 25,
    variant: 'elevated',
  },
};
