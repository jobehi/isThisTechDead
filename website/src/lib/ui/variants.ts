/**
 * Tailwind Variants Library
 *
 * Shared variant definitions for consistent styling across components.
 * Uses class-variance-authority (CVA) to define reusable style variants.
 */
import { cva } from 'class-variance-authority';

/**
 * Text gradient variants for consistent heading styles
 */
export const textGradientVariants = cva('text-transparent bg-clip-text', {
  variants: {
    variant: {
      primary: 'bg-gradient-to-r from-lime-400 to-green-600',
      secondary: 'bg-gradient-to-r from-lime-400 to-grey',
      danger: 'bg-gradient-to-r from-red-500 to-pink-500',
      info: 'bg-gradient-to-r from-blue-400 to-indigo-600',
    },
    glow: {
      none: '',
      subtle: 'drop-shadow-lg',
      strong: 'drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]',
    },
  },
  defaultVariants: {
    variant: 'primary',
    glow: 'none',
  },
});

/**
 * Background gradient variants for sections and cards
 */
export const backgroundGradientVariants = cva('', {
  variants: {
    variant: {
      subtle: 'bg-gradient-to-br from-zinc-950 via-zinc-900/60 to-black/90',
      glow: 'bg-gradient-to-br from-lime-950/30 to-zinc-900/50',
      accent: 'bg-gradient-to-t from-lime-500/10 via-emerald-500/5 to-transparent',
      header: 'bg-gradient-to-r from-lime-500 to-emerald-600',
    },
    blur: {
      none: '',
      light: 'blur-xl',
      heavy: 'blur-3xl',
      medium: 'blur-2xl',
    },
  },
  defaultVariants: {
    variant: 'subtle',
    blur: 'none',
  },
});

/**
 * Link and icon button variants
 */
export const linkButtonVariants = cva('inline-flex items-center transition-colors rounded', {
  variants: {
    variant: {
      default: 'bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300',
      primary: 'bg-lime-700/80 hover:bg-lime-600/80 text-white',
      ghost: 'bg-transparent hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200',
      outline: 'bg-transparent border border-zinc-700 hover:border-zinc-600 text-zinc-300',
    },
    size: {
      xs: 'text-xs px-2 py-1',
      sm: 'text-xs px-3 py-1',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-5 py-2',
    },
    withIcon: {
      left: '',
      right: '',
      only: 'justify-center',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
    withIcon: 'none',
  },
  compoundVariants: [
    {
      withIcon: 'left',
      className: 'pl-2',
    },
    {
      withIcon: 'right',
      className: 'pr-2',
    },
  ],
});

/**
 * Card style variants
 */
export const cardBaseVariants = cva(
  'rounded-xl shadow-lg transition-all duration-300 border overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800/60 border-zinc-800 hover:border-zinc-700',
        glow: 'bg-zinc-800/60 border-zinc-800 hover:border-lime-900/60 hover:shadow-lime-900/20',
        elevated: 'bg-zinc-800/60 border-zinc-700 shadow-lg hover:shadow-xl',
        outline: 'bg-transparent border-zinc-700 hover:border-zinc-600',
      },
      padding: {
        none: 'p-0',
        small: 'p-3',
        medium: 'p-5',
        large: 'p-6',
      },
      interactive: {
        true: 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'medium',
      interactive: false,
    },
  }
);

/**
 * Stats item variants
 */
export const statsItemVariants = cva('rounded-lg', {
  variants: {
    variant: {
      default: 'bg-zinc-700/50',
      outline: 'bg-zinc-700/50 border border-zinc-600',
      filled: 'bg-zinc-800/80',
    },
    padding: {
      small: 'p-2',
      medium: 'p-3',
      large: 'p-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'medium',
  },
});
