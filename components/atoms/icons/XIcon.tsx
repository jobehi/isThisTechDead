import { SVGProps } from 'react';

interface XIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * X Icon (Close)
 * Used for closing dialogs, removing items, and cancellation actions
 */
export function XIcon({ size = 18, className = '', ...props }: XIconProps) {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
