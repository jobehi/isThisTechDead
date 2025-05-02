import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChevronIcon } from './ChevronIcon';
import { ChevronLeftIcon } from './ChevronLeftIcon';
import { ChevronRightIcon } from './ChevronRightIcon';
import { ArrowRightIcon } from './ArrowRightIcon';
import { ExternalLinkIcon } from './ExternalLinkIcon';
import { GithubIcon } from './GithubIcon';
import { MenuIcon } from './MenuIcon';
import { PlusIcon } from './PlusIcon';
import { SearchIcon } from './SearchIcon';
import { UploadIcon } from './UploadIcon';
import { XIcon } from './XIcon';

const meta: Meta = {
  title: 'Atoms/Icons',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// Template for displaying a single icon with label
type IconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & {
    size?: number | string;
    direction?: 'up' | 'down' | 'left' | 'right';
  }
>;

interface IconWithLabelProps {
  icon: IconComponent;
  name: string;
  size?: number | string;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

const IconWithLabel = ({ icon: Icon, name, ...props }: IconWithLabelProps) => (
  <div className="flex flex-col items-center justify-center gap-2 p-4 m-2 rounded-md bg-zinc-900 min-w-[100px]">
    <Icon {...props} />
    <span className="text-xs">{name}</span>
  </div>
);

// Grid layout for icons
const IconsGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{children}</div>
);

export const AllIcons: StoryObj = {
  render: () => (
    <IconsGrid>
      <IconWithLabel icon={ChevronIcon} name="ChevronIcon (Down)" />
      <IconWithLabel icon={ChevronIcon} name="ChevronIcon (Up)" direction="up" />
      <IconWithLabel icon={ChevronIcon} name="ChevronIcon (Left)" direction="left" />
      <IconWithLabel icon={ChevronIcon} name="ChevronIcon (Right)" direction="right" />
      <IconWithLabel icon={ChevronLeftIcon} name="ChevronLeftIcon" />
      <IconWithLabel icon={ChevronRightIcon} name="ChevronRightIcon" />
      <IconWithLabel icon={ArrowRightIcon} name="ArrowRightIcon" />
      <IconWithLabel icon={ExternalLinkIcon} name="ExternalLinkIcon" />
      <IconWithLabel icon={GithubIcon} name="GithubIcon" />
      <IconWithLabel icon={MenuIcon} name="MenuIcon" />
      <IconWithLabel icon={PlusIcon} name="PlusIcon" />
      <IconWithLabel icon={SearchIcon} name="SearchIcon" />
      <IconWithLabel icon={UploadIcon} name="UploadIcon" />
      <IconWithLabel icon={XIcon} name="XIcon" />
    </IconsGrid>
  ),
};

export const IconSizes: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <ChevronIcon size={16} />
        <ChevronIcon size={24} />
        <ChevronIcon size={32} />
        <ChevronIcon size={48} />
      </div>
      <div className="flex items-center gap-4">
        <XIcon className="w-4 h-4" />
        <XIcon className="w-6 h-6" />
        <XIcon className="w-8 h-8" />
        <XIcon className="w-12 h-12" />
      </div>
    </div>
  ),
};

export const IconColors: StoryObj = {
  render: () => (
    <div className="flex gap-4">
      <SearchIcon className="text-zinc-400" />
      <SearchIcon className="text-zinc-200" />
      <SearchIcon className="text-lime-500" />
      <SearchIcon className="text-red-500" />
      <SearchIcon className="text-blue-500" />
    </div>
  ),
};
