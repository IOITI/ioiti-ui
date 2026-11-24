'use client';

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { TONE_LINE, TONE_SOFT } from '../../lib/recipes.js';
import { deprecated } from '../../lib/deprecated.js';

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  // ioiti-ui: `danger`, the tones' word (StatusTone); `destructive` is its former name, read as it and said once in
  // development (removed in 1.0).
  | 'danger'
  | 'destructive'
  | 'success'
  | 'link'
  | 'gradient';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  /** Visual presentation style */
  variant?: ButtonVariant;
  /** Dimension scale */
  size?: ButtonSize;
  /**
   * ioiti-ui: an action under way, started by this button (a save, a send): its spinner and `loadingText` shown, and it
   * cannot be pressed again meanwhile (`loading` is for content not there yet).
   */
  pending?: boolean;
  /** @deprecated Use `pending`. Removed in 1.0. */
  isLoading?: boolean;
  /** Text or element displayed during loading */
  loadingText?: string;
  /** Icon placed before the button children */
  leftIcon?: React.ReactNode;
  /** Icon placed after the button children */
  rightIcon?: React.ReactNode;
  /** Expand button to fill 100% of container width */
  fullWidth?: boolean;
  /** Button content */
  children?: React.ReactNode;
}

// ioiti-ui: under a theme with an accent (accent:), a filled button is the accent's, its gradient and grain over the
// fill where the accent has them (bloom and the others), with the text they take, and a soft glow of it under; a link
// is in its colour. Under the glass material, the glass's glow (the accent's where there is one). The looks add them.
const FILLED_THEMED =
  'accent:bg-brand accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground accent:shadow-[0_4px_14px_-6px_var(--brand-glow)] glass:shadow-[var(--glass-glow)]';

const variantStyles: Record<ButtonVariant, string> = {
  default:
    `bg-primary text-primary-foreground hover:opacity-90 shadow-subtle border border-transparent font-medium cursor-pointer ${FILLED_THEMED}`,
  primary:
    `bg-primary text-primary-foreground hover:opacity-90 shadow-subtle border border-transparent font-medium cursor-pointer ${FILLED_THEMED}`,
  secondary:
    'bg-surface border border-border text-foreground hover:bg-surface-hover hover:border-border-hover cursor-pointer',
  outline:
    'bg-transparent border border-border text-foreground hover:bg-surface-hover hover:border-border-hover cursor-pointer',
  ghost:
    'bg-transparent text-text-secondary hover:text-foreground hover:bg-surface-hover border border-transparent cursor-pointer',
  // ioiti-ui: the design's tones (recipes.ts): soft at rest, filled under the pointer (in dark too: its soft ground's
  // `dark:` came after a plain `hover:`), the page's own colour on it.
  danger:
    `${TONE_SOFT.negative} border ${TONE_LINE.negative} hover:bg-negative dark:hover:bg-negative hover:text-background cursor-pointer`,
  destructive:
    `${TONE_SOFT.negative} border ${TONE_LINE.negative} hover:bg-negative dark:hover:bg-negative hover:text-background cursor-pointer`,
  success:
    `${TONE_SOFT.positive} border ${TONE_LINE.positive} hover:bg-positive dark:hover:bg-positive hover:text-background cursor-pointer`,
  link:
    'bg-transparent text-foreground underline-offset-4 hover:underline p-0 h-auto border-0 focus-ring shadow-none inline-flex cursor-pointer accent:text-brand-text',
  gradient:
    'bg-surface border border-border text-foreground hover:bg-surface-hover hover:border-border-hover relative overflow-hidden cursor-pointer',
};

const sizeStyles: Record<ButtonSize, string> = {
  // ioiti-ui: the smallest, for an action on a line of text or a row of a table (an "Edit" beside a value).
  xs: 'h-6 px-2 text-xs rounded-md gap-1',
  sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
  md: 'h-10 px-4.5 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-base rounded-lg gap-2.5',
  icon: 'size-10 p-0 rounded-lg justify-center shrink-0',
};

/**
 * ioiti-ui: an icon as tall as its button's text, beside it (an icon with no size of its own: one given its own
 * `size-*` keeps it). EasyUI left them at their own size, 24 px, twice the text of a small button.
 */
const iconSizeStyles: Record<ButtonSize, string> = {
  xs: "[&>svg:not([class*='size-'])]:size-3",
  sm: "[&>svg:not([class*='size-'])]:size-3.5",
  md: "[&>svg:not([class*='size-'])]:size-4",
  lg: "[&>svg:not([class*='size-'])]:size-5",
  icon: "[&>svg:not([class*='size-'])]:size-4",
};

/** ioiti-ui: the spinner of a busy button, as large as the icon it stands in for (it was 12 px in sm, 16 px in lg). */
const SPINNER_SIZE: Record<ButtonSize, string> = { xs: 'size-3', sm: 'size-3.5', md: 'size-4', lg: 'size-5', icon: 'size-4' };

/** ioiti-ui: the box of a button's icon, before or after its words (Button, ButtonLink). */
export function buttonIconClassName(size: ButtonSize = 'md'): string {
  return cn('inline-flex shrink-0', iconSizeStyles[size]);
}

/**
 * ioiti-ui: the box of a button's words: cut short with an ellipsis where the button is held narrower than them
 * (a `max-w-*`), its icons kept whole; they pushed the icon after them out of the button.
 */
export const BUTTON_LABEL_CLASS = 'min-w-0 truncate';

/**
 * ioiti-ui: the classes of a button of this variant and size, for a link that looks like one
 * (`components/ButtonLink.tsx`): what leads to another page is a link.
 */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: Pick<ButtonProps, 'variant' | 'size' | 'fullWidth'> & { className?: string }): string {
  return cn(
    'relative inline-flex items-center justify-center font-medium select-none focus-ring transition-colors duration-150',
    variantStyles[variant],
    variant !== 'link' && sizeStyles[size],
    fullWidth && 'w-full',
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      pending,
      isLoading: formerPending,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // ioiti-ui: its former names read as today's, each said once in development.
    if (formerPending !== undefined) deprecated('button-is-loading', 'Button');
    if (variant === 'destructive') deprecated('button-destructive', 'Button');
    const isLoading = pending ?? formerPending ?? false;
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={motionTransitions.springSnappy}
        aria-busy={isLoading}
        className={buttonClassName({
          variant,
          size,
          fullWidth,
          className: cn(isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none', className),
        })}
        {...props}
      >
        {/* Subtle shimmer gradient for gradient variant */}
        {variant === 'gradient' && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-fast pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Loading Spinner or Left Icon */}
        {isLoading ? (
          <Loader2 className={cn('animate-spin shrink-0', SPINNER_SIZE[size ?? 'md'])} />
        ) : (
          leftIcon && <span className={buttonIconClassName(size)}>{leftIcon}</span>
        )}

        {/* Button Content */}
        {isLoading && loadingText ? (
          <span className={BUTTON_LABEL_CLASS}>{loadingText}</span>
        ) : (
          children && <span className={BUTTON_LABEL_CLASS}>{children}</span>
        )}

        {/* Right Icon */}
        {!isLoading && rightIcon && <span className={buttonIconClassName(size)}>{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
