import type { Meta, StoryObj } from '@storybook/react';
import { TechGrid } from './TechGrid';
import React from 'react';

// Mock data for tech items
const mockTechs = [
  {
    id: 'react',
    name: 'React',
    latest_score: 3.5, // 35%
    latest_snapshot_date: '2024-06-15',
    respect_count: 120,
    project_count: 12,
    commentary: 'Still hanging in there despite new frameworks every week.',
  },
  {
    id: 'angular',
    name: 'Angular',
    latest_score: 5.5, // 55%
    latest_snapshot_date: '2024-06-10',
    respect_count: 85,
    project_count: 8,
    commentary: 'Enterprise favorite with a steep learning curve.',
  },
  {
    id: 'vue',
    name: 'Vue.js',
    latest_score: 2.5, // 25%
    latest_snapshot_date: '2024-06-12',
    respect_count: 95,
    project_count: 10,
    commentary: 'The progressive framework gaining popularity.',
  },
  {
    id: 'svelte',
    name: 'Svelte',
    latest_score: 1.5, // 15%
    latest_snapshot_date: '2024-06-08',
    respect_count: 75,
    project_count: 5,
    commentary: 'Compile-time framework with minimal runtime.',
  },
  {
    id: 'jquery',
    name: 'jQuery',
    latest_score: 8.5, // 85%
    latest_snapshot_date: '2024-06-01',
    respect_count: 45,
    project_count: 20,
    commentary: 'The classic that dominated the web for years.',
  },
  {
    id: 'backbone',
    name: 'Backbone.js',
    latest_score: 7.0, // 70%
    latest_snapshot_date: '2024-05-28',
    respect_count: 25,
    project_count: 3,
    commentary: 'A lightweight MVC framework from the early 2010s.',
  },
  {
    id: 'ember',
    name: 'Ember.js',
    latest_score: 6.0, // 60%
    latest_snapshot_date: '2024-06-05',
    respect_count: 35,
    project_count: 6,
    commentary: 'Convention over configuration framework with strong opinions.',
  },
];

const meta: Meta<typeof TechGrid> = {
  title: 'Molecules/TechGrid',
  component: TechGrid,
  parameters: {
    layout: 'fullscreen',
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
type Story = StoryObj<typeof TechGrid>;

export const Default: Story = {
  render: args => (
    <div
      style={{
        padding: '32px',
        backgroundColor: '#09090b',
        minHeight: '100vh',
      }}
    >
      <TechGrid {...args} />
    </div>
  ),
  args: {
    techs: mockTechs,
  },
};

export const WithCustomRespectCount: Story = {
  render: args => (
    <div
      style={{
        padding: '32px',
        backgroundColor: '#09090b',
        minHeight: '100vh',
      }}
    >
      <TechGrid {...args} />
    </div>
  ),
  args: {
    techs: mockTechs,
    getRespectCount: tech => tech.respect_count * 2, // Double the respect count for demonstration
  },
};
