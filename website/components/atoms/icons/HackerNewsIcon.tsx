import React from 'react';

interface HackerNewsIconProps {
  className?: string;
}

export function HackerNewsIcon({ className = 'w-5 h-5' }: HackerNewsIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0v24h24V0H0zm12.7 4.9h-1.4L7 13.4v.7h3v4.9h1.1v-4.9h3.3v-.7l-1.7-8.5zm6.5 4.9h-3.3l-.7 7.9V18h4V9.8z" />
    </svg>
  );
}
