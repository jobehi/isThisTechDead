import { SVGProps } from 'react';

interface ChevronLeftIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Chevron Left Icon
 * Used for previous page, back actions, and navigation
 */
export function ChevronLeftIcon({ size = 18, className = '', ...props }: ChevronLeftIconProps) {
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
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
