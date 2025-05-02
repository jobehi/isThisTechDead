import type { Meta, StoryObj } from '@storybook/react';
import { ScoreIndicator } from './ScoreIndicator';
import React from 'react';

const meta: Meta<typeof ScoreIndicator> = {
  title: 'Molecules/ScoreIndicator',
  component: ScoreIndicator,
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
type Story = StoryObj<typeof ScoreIndicator>;

// Wrapper component to add space and width
const ScoreWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '300px', padding: '20px' }}>{children}</div>
);

export const Default: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 35,
    showLabel: true,
    size: 'md',
    animate: true,
  },
};

export const LowScore: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 10,
    showLabel: true,
    size: 'md',
  },
};

export const MediumScore: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 50,
    showLabel: true,
    size: 'md',
  },
};

export const HighScore: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 85,
    showLabel: true,
    size: 'md',
  },
};

export const CriticalScore: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 95,
    showLabel: true,
    size: 'md',
  },
};

export const SmallSize: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 65,
    showLabel: true,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 65,
    showLabel: true,
    size: 'lg',
  },
};

export const WithoutLabel: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 75,
    showLabel: false,
    size: 'md',
  },
};

export const WithGlow: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 75,
    showLabel: true,
    size: 'md',
    showGlow: true,
  },
};

export const PremiumStyle: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 65,
    showLabel: true,
    size: 'md',
    premium: true,
  },
};

export const NoAnimation: Story = {
  decorators: [
    Story => (
      <ScoreWrapper>
        <Story />
      </ScoreWrapper>
    ),
  ],
  args: {
    score: 40,
    showLabel: true,
    size: 'md',
    animate: false,
  },
};
