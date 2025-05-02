'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 text-base font-semibold tracking-tight',
      paragraph: 'leading-7',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      glitch: 'font-mono tracking-wide text-glow',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    transform: {
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
      normal: 'normal-case',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
    weight: 'normal',
    align: 'left',
  },
});

export interface TypographyProps extends VariantProps<typeof typographyVariants> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Typography components for consistent text styling
 *
 * @example
 * ```tsx
 * <Heading1>Is This Tech Dead?</Heading1>
 * <Paragraph>This is regular text.</Paragraph>
 * <SmallText>Last updated: Yesterday</SmallText>
 * ```
 */

interface TextComponentProps {
  children: React.ReactNode;
  className?: string;
  weight?: VariantProps<typeof typographyVariants>['weight'];
  align?: VariantProps<typeof typographyVariants>['align'];
  transform?: VariantProps<typeof typographyVariants>['transform'];
}

export const Heading3 = ({ children, className, weight, align, transform }: TextComponentProps) => (
  <h3 className={cn(typographyVariants({ variant: 'h3', weight, align, transform, className }))}>
    {children}
  </h3>
);

export const MutedText = ({
  children,
  className,
  weight,
  align,
  transform,
}: TextComponentProps) => (
  <span
    className={cn(typographyVariants({ variant: 'muted', weight, align, transform, className }))}
  >
    {children}
  </span>
);
