import { SVGProps } from 'react';

interface ChevronIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Chevron Icon with configurable direction
 * Used for navigation, dropdowns, and expandable sections
 */
export function ChevronIcon({
  size = 18,
  direction = 'down',
  className = '',
  ...props
}: ChevronIconProps) {
  const getPath = () => {
    switch (direction) {
      case 'up':
        return 'M18 15l-6-6-6 6';
      case 'down':
        return 'M6 9l6 6 6-6';
      case 'left':
        return 'M15 18l-6-6 6-6';
      case 'right':
        return 'M9 18l6-6-6-6';
      default:
        return 'M6 9l6 6 6-6';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d={getPath()}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
