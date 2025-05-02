import { SVGProps } from 'react';

interface MenuIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * Menu Icon (Hamburger)
 * Used for mobile navigation toggle
 */
export function MenuIcon({ size = 18, className = '', ...props }: MenuIconProps) {
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
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}
