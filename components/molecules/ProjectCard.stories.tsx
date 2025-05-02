import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from './ProjectCard';
import React from 'react';
import type { Project } from '@/domains';

// Mock data for project examples
const mockProjects = {
  withImage: {
    id: 1,
    name: 'Tech Graveyard App',
    description:
      'A showcase of technologies that are dying or dead, with interactive visualizations.',
    self_roast: 'I spent more time picking colors than writing actual features.',
    url: 'https://example.com',
    github_url: 'https://github.com/example/tech-graveyard',
    screenshot_url: 'https://picsum.photos/800/600?random=1',
    user_id: 'user1',
    tech_id: 'react',
    created_at: '2024-06-15T12:00:00Z',
    updated_at: '2024-06-15T12:00:00Z',
    is_approved: true,
    approved_at: '2024-06-16T10:00:00Z',
  } as Project,
  withoutImage: {
    id: 2,
    name: 'Legacy Code Analyzer',
    description:
      'Tool that analyzes your codebase and tells you which technologies are becoming obsolete.',
    self_roast: 'Ironically built with jQuery, which it always flags as dead.',
    url: 'https://example.com/analyzer',
    github_url: 'https://github.com/example/legacy-analyzer',
    screenshot_url: null,
    user_id: 'user2',
    tech_id: 'jquery',
    created_at: '2024-06-10T10:30:00Z',
    updated_at: '2024-06-10T10:30:00Z',
    is_approved: true,
    approved_at: '2024-06-11T09:00:00Z',
  } as Project,
  minimal: {
    id: 3,
    name: 'Simple API Wrapper',
    description: 'A minimalist wrapper for the Tech Stack API with TypeScript definitions.',
    self_roast: 'Over-engineered for what it does. Classic JavaScript developer move.',
    url: null,
    github_url: 'https://github.com/example/api-wrapper',
    screenshot_url: null,
    user_id: 'user3',
    tech_id: 'typescript',
    created_at: '2024-06-01T15:45:00Z',
    updated_at: '2024-06-01T15:45:00Z',
    is_approved: false,
    approved_at: null,
  } as Project,
};

// Card wrapper for consistent spacing in Storybook
const CardWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ maxWidth: '400px', margin: '0 auto' }}>{children}</div>
);

const meta: Meta<typeof ProjectCard> = {
  title: 'Molecules/ProjectCard',
  component: ProjectCard,
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
type Story = StoryObj<typeof ProjectCard>;

export const WithImage: Story = {
  args: {
    project: mockProjects.withImage,
    variant: 'default',
  },
};

export const WithoutImage: Story = {
  args: {
    project: mockProjects.withoutImage,
    variant: 'default',
  },
};

export const Minimal: Story = {
  args: {
    project: mockProjects.minimal,
    variant: 'default',
  },
};

export const GlowVariant: Story = {
  args: {
    project: mockProjects.withImage,
    variant: 'glow',
  },
};

export const ElevatedVariant: Story = {
  args: {
    project: mockProjects.withImage,
    variant: 'elevated',
  },
};

export const OutlineVariant: Story = {
  args: {
    project: mockProjects.withImage,
    variant: 'outline',
  },
};
