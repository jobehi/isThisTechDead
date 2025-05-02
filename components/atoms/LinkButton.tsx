import { ReactNode } from 'react';
import Link from 'next/link';
import { VariantProps } from 'class-variance-authority';
import { linkButtonVariants } from '@/lib/ui';
import { cn } from '@/lib/cn';

interface LinkButtonProps extends VariantProps<typeof linkButtonVariants> {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * LinkButton component for styled links with optional icons
 * Uses linkButtonVariants for consistent styling
 */
export function LinkButton({
  href,
  children,
  className,
  variant,
  size,
  external = false,
  icon,
  iconPosition = 'left',
}: LinkButtonProps) {
  // Determine the withIcon variant based on iconPosition and presence of icon
  const getWithIcon = () => {
    if (!icon) return 'none';
    if (children === null || children === undefined) return 'only';
    return iconPosition as 'left' | 'right';
  };

  const linkClass = cn(
    linkButtonVariants({
      variant,
      size,
      withIcon: getWithIcon(),
    }),
    className
  );

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-1.5">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-1.5">{icon}</span>}
    </>
  );

  if (external) {
    return (
      <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClass}>
      {content}
    </Link>
  );
}
