import React from 'react';

interface ArrowUpIconProps {
  className?: string;
}

export function ArrowUpIcon({ className = 'w-5 h-5' }: ArrowUpIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
