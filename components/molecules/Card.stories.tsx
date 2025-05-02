import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import React from 'react';
import { Button } from '../atoms/Button';

const CardWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ maxWidth: '380px', margin: '0 auto' }}>{children}</div>
);

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
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
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'medium',
    children: <p className="text-zinc-300">This is a basic card with default styling.</p>,
  },
};

export const WithTitleAndSubtitle: Story = {
  args: {
    title: 'Card Title',
    subtitle: 'Card Subtitle',
    variant: 'default',
    padding: 'medium',
    children: <p className="text-zinc-300">This card has a title and subtitle.</p>,
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Card with Footer',
    variant: 'default',
    padding: 'medium',
    children: <p className="text-zinc-300">This card has a footer with a button.</p>,
    footer: (
      <Button variant="primary" size="sm">
        Action
      </Button>
    ),
  },
};

export const WithImage: Story = {
  args: {
    title: 'Card with Image',
    variant: 'default',
    padding: 'medium',
    image: {
      src: 'https://picsum.photos/400/200',
      alt: 'Random image',
    },
    children: <p className="text-zinc-300">This card includes an image at the top.</p>,
  },
};

export const WithBadge: Story = {
  args: {
    title: 'Card with Badge',
    variant: 'default',
    padding: 'medium',
    badge: 'New',
    children: <p className="text-zinc-300">This card has a badge in the top right corner.</p>,
  },
};

export const AsLink: Story = {
  args: {
    title: 'Clickable Card',
    variant: 'default',
    padding: 'medium',
    href: '#',
    children: <p className="text-zinc-300">This card acts as a link. Click me!</p>,
  },
};

export const WithClickHandler: Story = {
  args: {
    title: 'Button Card',
    variant: 'default',
    padding: 'medium',
    onClick: () => alert('Card clicked!'),
    children: <p className="text-zinc-300">This card acts as a button. Click me!</p>,
  },
};

export const GlowVariant: Story = {
  args: {
    title: 'Glow Effect Card',
    variant: 'glow',
    padding: 'medium',
    children: <p className="text-zinc-300">This card has a glow effect on hover.</p>,
  },
};

export const ElevatedVariant: Story = {
  args: {
    title: 'Elevated Card',
    variant: 'elevated',
    padding: 'medium',
    children: <p className="text-zinc-300">This card has an elevated appearance.</p>,
  },
};

export const OutlineVariant: Story = {
  args: {
    title: 'Outline Card',
    variant: 'outline',
    padding: 'medium',
    children: <p className="text-zinc-300">This card has an outline style.</p>,
  },
};
