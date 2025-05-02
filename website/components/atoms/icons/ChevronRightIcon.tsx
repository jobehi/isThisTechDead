import { SVGProps } from 'react';

interface ChevronRightIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Chevron Right Icon
 * Used for next page, forward actions, and navigation
 */
export function ChevronRightIcon({ size = 18, className = '', ...props }: ChevronRightIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
