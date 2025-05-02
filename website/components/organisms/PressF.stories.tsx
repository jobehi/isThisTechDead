import type { Meta, StoryObj } from '@storybook/react';
import { PressF } from './PressF';

const meta: Meta<typeof PressF> = {
  title: 'Organisms/PressF',
  component: PressF,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '"Press F to Pay Respects" button that allows users to pay tribute to deprecated technologies',
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
    onPress: {
      action: 'F pressed',
      description: 'Optional callback triggered when F is pressed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PressF>;

export const Default: Story = {
  args: {
    techId: 'react',
    techName: 'React',
  },
};

export const ForAngularJS: Story = {
  args: {
    techId: 'angular-js',
    techName: 'AngularJS',
  },
  parameters: {
    docs: {
      description: {
        story: 'AngularJS was officially deprecated in January 2022',
      },
    },
  },
};

export const ForJQuery: Story = {
  args: {
    techId: 'jquery',
    techName: 'jQuery',
  },
  parameters: {
    docs: {
      description: {
        story: 'jQuery has been considered obsolete by many developers but is still widely used',
      },
    },
  },
};
