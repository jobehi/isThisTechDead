import React from 'react';

interface StackOverflowIconProps {
  className?: string;
}

export function StackOverflowIcon({ className = 'w-5 h-5' }: StackOverflowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.36 20.2v-5.38h1.79V22H3v-7.18h1.8v5.38h12.56M6.77 14.32l.37-1.76 8.79 1.85-.37 1.76-8.79-1.85m1.16-4.21l.76-1.61 8.14 3.78-.76 1.62-8.14-3.79m2.26-3.99l1.15-1.38 6.9 5.76-1.15 1.37-6.9-5.75m4.45-4.25L20 9.08l-1.44 1.07-5.36-7.21 1.44-1.07M6.59 18.41v-1.8h8.98v1.8H6.59z" />
    </svg>
  );
}
