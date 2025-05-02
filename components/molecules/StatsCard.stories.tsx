import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard, StatItem, StatRow } from './StatsCard';
import React from 'react';

const CardWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ maxWidth: '400px', margin: '0 auto' }}>{children}</div>
);

const meta: Meta<typeof StatsCard> = {
  title: 'Molecules/StatsCard',
  component: StatsCard,
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
  decorators: [
    Story => (
      <CardWrapper>
        <Story />
      </CardWrapper>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StatsCard>;

// Define some icons for the examples
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 21H3V3" />
    <path d="M7 14l4-4 4 4 4-4" />
  </svg>
);

export const Default: Story = {
  args: {
    title: 'Project Statistics',
    children: (
      <div className="space-y-3">
        <StatRow label="Total Projects" value="124" />
        <StatRow label="Active Users" value="45" />
        <StatRow label="Average Score" value="65%" color="text-orange-400" />
      </div>
    ),
  },
};

export const WithStatItems: Story = {
  args: {
    title: 'GitHub Stats',
    icon: <GitHubIcon />,
    variant: 'glow',
    children: (
      <div className="grid grid-cols-2 gap-3">
        <StatItem label="Stars" value="1.2k" />
        <StatItem label="Forks" value="245" color="text-blue-400" />
        <StatItem label="Issues" value="32" color="text-red-400" />
        <StatItem label="PRs" value="18" color="text-purple-400" />
      </div>
    ),
  },
};

export const MixedStatTypes: Story = {
  args: {
    title: 'Technology Metrics',
    icon: <ChartIcon />,
    variant: 'elevated',
    children: (
      <>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatItem label="Dead Score" value="75%" color="text-red-400" />
          <StatItem label="Community" value="Active" color="text-green-400" />
        </div>
        <div className="border-t border-zinc-800 pt-3 mt-3 space-y-2">
          <StatRow label="First Release" value="2015" />
          <StatRow label="Last Commit" value="2 days ago" color="text-lime-400" />
          <StatRow label="Maintenance" value="Official" />
        </div>
      </>
    ),
  },
};

export const OutlineVariant: Story = {
  args: {
    title: 'User Activity',
    variant: 'outline',
    children: (
      <div className="space-y-3">
        <StatRow label="Last Login" value="Today" color="text-lime-400" />
        <StatRow label="Contributions" value="47" />
        <StatRow label="Profile Views" value="128" />
      </div>
    ),
  },
};

export const WithDifferentPadding: Story = {
  args: {
    title: 'Compact Stats',
    variant: 'default',
    padding: 'small',
    children: (
      <div className="grid grid-cols-2 gap-2">
        <StatItem label="Views" value="12.5k" padding="small" />
        <StatItem label="Clicks" value="824" padding="small" color="text-blue-400" />
      </div>
    ),
  },
};
