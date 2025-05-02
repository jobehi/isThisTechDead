import { SVGProps } from 'react';

interface SearchIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Search Icon
 * Used for search inputs and search-related actions
 */
export function SearchIcon({ size = 18, className = '', ...props }: SearchIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}
