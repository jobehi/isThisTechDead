import React from 'react';
import { ChevronLeftIcon } from '../atoms/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../atoms/icons/ChevronRightIcon';
import { linkButtonVariants } from '@/lib/ui/variants';
import { cn } from '@/lib/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className={cn('flex justify-center items-center gap-2', className)}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          linkButtonVariants({
            variant: 'default',
            size: 'sm',
            withIcon: 'only',
          }),
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <span className="mx-3 text-sm text-zinc-300">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          linkButtonVariants({
            variant: 'default',
            size: 'sm',
            withIcon: 'only',
          }),
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
