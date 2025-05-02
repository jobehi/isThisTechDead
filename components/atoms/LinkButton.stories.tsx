import type { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from './LinkButton';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

const meta: Meta<typeof LinkButton> = {
  title: 'Atoms/LinkButton',
  component: LinkButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'ghost', 'outline'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    external: {
      control: 'boolean',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const DefaultLink: Story = {
  args: {
    children: 'Default Link',
    href: '#',
  },
};

export const PrimaryLink: Story = {
  args: {
    children: 'Primary Link',
    href: '#',
    variant: 'primary',
  },
};

export const GhostLink: Story = {
  args: {
    children: 'Ghost Link',
    href: '#',
    variant: 'ghost',
  },
};

export const OutlineLink: Story = {
  args: {
    children: 'Outline Link',
    href: '#',
    variant: 'outline',
  },
};

export const ExtraSmallLink: Story = {
  args: {
    children: 'Extra Small Link',
    href: '#',
    size: 'xs',
  },
};

export const SmallLink: Story = {
  args: {
    children: 'Small Link',
    href: '#',
    size: 'sm',
  },
};

export const MediumLink: Story = {
  args: {
    children: 'Medium Link',
    href: '#',
    size: 'md',
  },
};

export const LargeLink: Story = {
  args: {
    children: 'Large Link',
    href: '#',
    size: 'lg',
  },
};

export const ExternalLink: Story = {
  args: {
    children: 'External Link',
    href: 'https://example.com',
    external: true,
    icon: <ExternalLinkIcon />,
    iconPosition: 'right',
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Link with Left Icon',
    href: '#',
    icon: <ArrowRightIcon />,
    iconPosition: 'left',
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Link with Right Icon',
    href: '#',
    icon: <ArrowRightIcon />,
    iconPosition: 'right',
  },
};

export const IconOnly: Story = {
  args: {
    href: '#',
    icon: <ArrowRightIcon />,
    children: null,
  },
};
