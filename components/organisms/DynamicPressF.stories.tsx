import type { Meta, StoryObj } from '@storybook/react';
import { DynamicPressF } from './DynamicPressF';

const meta: Meta<typeof DynamicPressF> = {
  title: 'Organisms/DynamicPressF',
  component: DynamicPressF,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dynamic import wrapper for the PressF component. This component is used to reduce the initial bundle size by loading the actual PressF component only when needed.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    techId: {
      control: 'text',
      description: 'Unique identifier for the technology',
    },
    techName: {
      control: 'text',
      description: 'Display name of the technology',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicPressF>;

export const Default: Story = {
  args: {
    techId: 'flash',
    techName: 'Adobe Flash',
  },
};

export const ForIE: Story = {
  args: {
    techId: 'internet-explorer',
    techName: 'Internet Explorer',
  },
  parameters: {
    docs: {
      description: {
        story: 'Internet Explorer reached end of life on June 15, 2022',
      },
    },
  },
};
