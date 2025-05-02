import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
import React, { useState } from 'react';

// Interactive wrapper for pagination to demonstrate state
const PaginationWrapper = ({ totalPages = 10 }: { totalPages?: number }) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-8 bg-zinc-950">
      <div className="mb-4 text-zinc-400 text-sm text-center">Current page: {currentPage}</div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
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
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: page => console.log('Page changed to:', page),
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: page => console.log('Page changed to:', page),
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 3,
    totalPages: 5,
    onPageChange: page => console.log('Page changed to:', page),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
    onPageChange: page => console.log('Page changed to:', page),
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: page => console.log('Page changed to:', page),
  },
  name: 'Single Page (No Render)',
};

export const Interactive: Story = {
  render: () => <PaginationWrapper />,
};

export const FewPages: Story = {
  render: () => <PaginationWrapper totalPages={3} />,
};
