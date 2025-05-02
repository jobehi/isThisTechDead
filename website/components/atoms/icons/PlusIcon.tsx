import { SVGProps } from 'react';

interface PlusIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Plus Icon
 * Used for add actions and expand buttons
 */
export function PlusIcon({ size = 18, className = '', ...props }: PlusIconProps) {
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
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
