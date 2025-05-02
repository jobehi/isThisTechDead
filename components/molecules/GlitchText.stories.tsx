import type { Meta, StoryObj } from '@storybook/react';
import { GlitchText } from './GlitchText';
import React from 'react';

const meta: Meta<typeof GlitchText> = {
  title: 'Molecules/GlitchText',
  component: GlitchText,
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
type Story = StoryObj<typeof GlitchText>;

// Wrapper for consistent layout in stories
const TextWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="p-8 bg-zinc-900 rounded-xl border border-zinc-800" style={{ maxWidth: '600px' }}>
    {children}
  </div>
);

export const Default: Story = {
  decorators: [
    Story => (
      <TextWrapper>
        <Story />
      </TextWrapper>
    ),
  ],
  args: {
    text: 'Is This Tech Dead?',
    intensity: 'medium',
    color: 'lime',
  },
};

export const LowIntensity: Story = {
  decorators: [
    Story => (
      <TextWrapper>
        <Story />
      </TextWrapper>
    ),
  ],
  args: {
    text: 'Low Intensity Glitch',
    intensity: 'low',
    color: 'lime',
  },
};

export const HighIntensity: Story = {
  decorators: [
    Story => (
      <TextWrapper>
        <Story />
      </TextWrapper>
    ),
  ],
  args: {
    text: 'HIGH INTENSITY GLITCH',
    intensity: 'high',
    color: 'lime',
  },
};

export const AsHeading: Story = {
  decorators: [
    Story => (
      <TextWrapper>
        <Story />
      </TextWrapper>
    ),
  ],
  args: {
    text: 'Heading Glitch',
    intensity: 'medium',
    color: 'lime',
    as: 'h1',
    className: 'text-3xl font-bold',
  },
};

export const GlitchOnHover: Story = {
  decorators: [
    Story => (
      <TextWrapper>
        <Story />
      </TextWrapper>
    ),
  ],
  args: {
    text: 'Hover Over Me',
    intensity: 'high',
    color: 'lime',
    glitchOnHover: true,
    className: 'text-xl cursor-pointer',
  },
};

export const LongText: Story = {
  decorators: [
    Story => (
      <TextWrapper>
        <Story />
      </TextWrapper>
    ),
  ],
  args: {
    text: 'This is a longer piece of text that shows how the glitch effect works with multiple words and characters.',
    intensity: 'medium',
    color: 'lime',
    className: 'text-lg',
  },
};
