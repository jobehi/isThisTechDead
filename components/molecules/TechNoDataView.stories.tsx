import type { Meta, StoryObj } from '@storybook/react';
import { TechNoDataView } from './TechNoDataView';

const meta: Meta<typeof TechNoDataView> = {
  title: 'Molecules/TechNoDataView',
  component: TechNoDataView,
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
type Story = StoryObj<typeof TechNoDataView>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '800px', padding: '20px' }}>
      <TechNoDataView />
    </div>
  ),
};
