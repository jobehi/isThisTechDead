'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { Heading3, MutedText } from '../atoms/Typography';
import { cardBaseVariants } from '@/lib/ui';

/**
 * Card component that can contain various content with consistent styling.
 *
 * @example
 * ```tsx
 * <Card
 *   title="React"
 *   subtitle="JavaScript Library"
 *   variant="elevated"
 *   href="/tech/react"
 * >
 *   <p>The library for web and native user interfaces.</p>
 * </Card>
 * ```
 */
export interface CardProps extends VariantProps<typeof cardBaseVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  badge?: string;
  image?: {
    src: string;
    alt: string;
  };
  href?: string;
  onClick?: () => void;
  glowColor?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export function Card({
  children,
  className,
  variant,
  padding,
  interactive,
  title,
  subtitle,
  footer,
  badge,
  image,
  href,
  glowColor,
  hoverEffect,
  delay,
  onClick,
}: CardProps) {
  // Ensure padding is always a valid string or undefined
  const safetyPadding = padding || undefined;

  const cardClasses = cn(
    cardBaseVariants({
      variant,
      padding: safetyPadding,
      interactive: href || onClick ? true : interactive,
    }),
    className
  );

  // Render as link if href is provided
  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        <CardContent
          title={title}
          subtitle={subtitle}
          footer={footer}
          badge={badge}
          image={image}
          padding={safetyPadding}
          glowColor={glowColor}
          hoverEffect={hoverEffect}
          delay={delay}
        >
          {children}
        </CardContent>
      </Link>
    );
  }

  // Render as button if onClick is provided
  if (onClick) {
    return (
      <button onClick={onClick} className={cardClasses} type="button">
        <CardContent
          title={title}
          subtitle={subtitle}
          footer={footer}
          badge={badge}
          image={image}
          padding={safetyPadding}
          glowColor={undefined}
          hoverEffect={undefined}
          delay={undefined}
        >
          {children}
        </CardContent>
      </button>
    );
  }

  // Default render as div
  return (
    <div className={cardClasses}>
      <CardContent
        title={title}
        subtitle={subtitle}
        footer={footer}
        badge={badge}
        image={image}
        padding={safetyPadding}
        glowColor={undefined}
        hoverEffect={undefined}
        delay={undefined}
      >
        {children}
      </CardContent>
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  title: string | undefined;
  subtitle: string | undefined;
  footer: React.ReactNode | undefined;
  badge: string | undefined;
  image:
    | {
        src: string;
        alt: string;
      }
    | undefined;
  padding: 'none' | 'small' | 'medium' | 'large' | undefined;
  glowColor: string | undefined;
  hoverEffect: boolean | undefined;
  delay: number | undefined;
}

function CardContent({
  children,
  title,
  subtitle,
  footer,
  badge,
  image,
  padding,
  glowColor,
  hoverEffect,
  delay,
}: CardContentProps) {
  return (
    <>
      {badge && (
        <div className="absolute top-2 right-2 bg-primary/90 px-2 py-1 rounded-full">
          <MutedText>{badge}</MutedText>
        </div>
      )}

      {image && (
        <div className="w-full h-40 relative">
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
        </div>
      )}

      {(title || subtitle) && (
        <div className={cn('mb-4', !padding && 'px-4 pt-4')}>
          {title && <Heading3 className="mb-1">{title}</Heading3>}
          {subtitle && <MutedText>{subtitle}</MutedText>}
        </div>
      )}

      <div
        className={cn(
          !padding && !title && !subtitle && 'px-4',
          !padding && (title || subtitle) && 'px-4 pt-0',
          delay && `transition-all duration-${delay}s`,
          glowColor && `hover:${glowColor}`,
          hoverEffect && 'hover:scale-[1.02] active:scale-[0.98]'
        )}
      >
        {children}
      </div>

      {footer && (
        <div className={cn('mt-4 flex justify-end', !padding && 'px-4 pb-4')}>{footer}</div>
      )}
    </>
  );
}
