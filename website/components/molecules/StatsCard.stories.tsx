import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard, StatItem, StatRow } from './StatsCard';
import React from 'react';
import { GithubIcon } from '../atoms/icons/GithubIcon';
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
const GitHubIcon = () => <GithubIcon />;

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
