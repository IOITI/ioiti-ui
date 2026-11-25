'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotionConfig } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAnchoredLayer } from '../../lib/anchor.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { FLOATING, MENU_ROW, TONE_SOLID } from '../../lib/recipes.js';
import { cn } from '../../lib/utils.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its words in the provider's language (`field`).
import { useMessages } from '../locale-context.js';

// -----------------------------------------------------------------------------
// Motion
// -----------------------------------------------------------------------------

// ioiti-ui: the motion of everything that floats, the design's own spring (EasyUI's here overshot).
const springSnappy = motionTransitions.springSnappy;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type SplitButtonSize = 'sm' | 'md' | 'lg';

export interface SplitButtonOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  /** ioiti-ui: where it leads: the option is then a link (opened elsewhere with ⌘ or Ctrl, or from its context menu). */
  href?: string;
  /** ioiti-ui: a line under the label, in a smaller type: what the option does. */
  description?: string;
  /** ioiti-ui: an option that deletes, in the loss colour. */
  tone?: 'danger';
}

export interface SplitButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Label for the primary (left) action. */
  label: string;

  /** Called when the primary action is pressed. */
  onClick?: () => void;

  /** ioiti-ui: where the primary action leads: it is then a link. */
  href?: string;

  /** ioiti-ui: what draws the links; the application's (LinkProvider) by default. */
  linkComponent?: React.ElementType;

  /** ioiti-ui: an icon before the primary label. */
  icon?: React.ReactNode;

  /** ioiti-ui: the name of the chevron and its menu; the provider's language's by default ("More Save options"). */
  menuLabel?: string;

  /** Dropdown options revealed by the chevron trigger. */
  options: SplitButtonOption[];

  size?: SplitButtonSize;

  /**
   * `primary` matches the light accent CTA.
   * `secondary` matches the raised control style.
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'info';

  disabled?: boolean;
  className?: string;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const SIZE_STYLES: Record<
  SplitButtonSize,
  {
    primary: string;
    chevron: string;
    radius: string;
    menuText: string;
  }
> = {
  // ioiti-ui: Button's sizes (32, 40 and 48 px tall, its radius: md for sm, lg above).
  sm: {
    primary: 'h-8 gap-1.5 px-3 text-sm',
    chevron: 'h-8 px-2',
    radius: 'rounded-md',
    menuText: 'text-sm',
  },

  md: {
    primary: 'h-10 gap-2 px-4.5 text-sm',
    chevron: 'h-10 px-2.5',
    radius: 'rounded-lg',
    menuText: 'text-sm',
  },

  lg: {
    primary: 'h-12 gap-2.5 px-6 text-base',
    chevron: 'h-12 px-3',
    radius: 'rounded-lg',
    menuText: 'text-sm',
  },
};

// ioiti-ui: Button's look in its tokens (the hair of a filled one, the accent's glow as Button's), and its press.
// Disabled, the group is at half its strength (the divider too), not each button again.
const TRANSITION = 'transition-[color,background-color,border-color,opacity,scale] duration-200 ease-fast cursor-pointer motion-safe:active:scale-[0.97]';

const VARIANT_STYLES: Record<'primary' | 'secondary' | 'danger' | 'info', string> = {
  primary:
    'bg-primary text-primary-foreground hover:opacity-90 shadow-subtle ' +
    // ioiti-ui: the accent's fill and glow, under a theme that has one (accent:), as Button's.
    'accent:bg-brand accent:text-brand-foreground accent:hover:bg-brand/90 ' +
    'accent:shadow-[0_4px_14px_-6px_var(--brand-glow)] accent:hover:shadow-[0_8px_20px_-6px_var(--brand-glow)] ' +
    TRANSITION,

  secondary:
    'border border-border bg-surface text-foreground hover:border-border-hover hover:bg-surface-hover ' +
    TRANSITION,

  // ioiti-ui: the tones filled (recipes.ts), as a destructive action is.
  danger: `${TONE_SOLID.negative} hover:opacity-90 shadow-subtle ${TRANSITION}`,

  info: `${TONE_SOLID.info} hover:opacity-90 shadow-subtle ${TRANSITION}`,
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * SplitButton
 *
 * A primary action fused with a secondary chevron trigger.
 *
 * Features:
 * - Primary + dropdown action split
 * - Keyboard accessible menu navigation
 * - Outside-click dismissal
 * - Escape-to-close
 * - Home / End navigation
 * - Viewport-aware dropdown placement
 * - Reduced-motion support
 * - Disabled options
 * - Framer Motion transitions
 */
export function SplitButton({
  label,
  onClick,
  href,
  linkComponent,
  icon,
  menuLabel,
  options,
  size = 'md',
  variant = 'primary',
  disabled = false,
  className,
  ...props
}: SplitButtonProps) {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  const reduceMotion = useReducedMotionConfig();
  // ioiti-ui: named in the provider's language, a function of the label (EasyUI's English was written here), its own
  // prop given over it.
  const words = useMessages().field;
  const menuName = menuLabel ?? words.moreOptions(label);
  // ioiti-ui: the option the arrows are on is announced (aria-activedescendant): the menu has the focus, not it.
  const idPrefix = useId();
  const optionRefs = useRef<(HTMLElement | null)[]>([]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const chevronRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ioiti-ui: the menu is an anchored layer (src/lib/anchor.ts): drawn in document.body, out of every parent that
  // would cut it (a table's row, a panel that scrolls), beside the chevron where the window has room, following it as
  // the page scrolls; a press elsewhere closes it, Escape and a Tab out of it give the focus back to the chevron. It
  // was absolute in the button, on an estimate of its height, cut by a parent's overflow.
  const layer = useAnchoredLayer({
    open,
    onClose: () => setOpen(false),
    triggerRef: chevronRef,
    layerRef: menuRef,
    side: 'bottom',
    align: 'end',
    // The menu holds the focus; the arrows move the option it points to (aria-activedescendant).
    initialFocus: () => menuRef.current,
  });

  const sizeStyles = SIZE_STYLES[size];

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const enabledIndices = options.reduce<number[]>((indices, option, index) => {
    if (!option.disabled) {
      indices.push(index);
    }

    return indices;
  }, []);

  const menuTransition = reduceMotion
    ? { duration: 0 }
    : springSnappy;

  // ---------------------------------------------------------------------------
  // Menu helpers
  // ---------------------------------------------------------------------------

  const closeMenu = useCallback(() => {
    setOpen(false);
    chevronRef.current?.focus();
  }, []);

  const selectOption = useCallback(
    (option: SplitButtonOption) => {
      if (option.disabled) {
        return;
      }

      option.onSelect?.();
      // ioiti-ui: a link chosen from the keyboard is followed as a click would follow it.
      if (option.href) {
        optionRefs.current[options.indexOf(option)]?.click();
        setOpen(false);
        return;
      }
      closeMenu();
    },
    [closeMenu, options],
  );

  // ---------------------------------------------------------------------------
  // Reset active option when opening
  // ---------------------------------------------------------------------------

  // ioiti-ui: on the first option it can choose as it opens, only then. It hung on `enabledIndices`, an array made
  // again at each render: every arrow's move was undone at once, and Enter chose the first option whatever was shown.
  const firstEnabled = enabledIndices[0] ?? 0;
  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveIndex(firstEnabled);
  }, [open, firstEnabled]);

  // ---------------------------------------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------------------------------------

  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // ioiti-ui: Escape and Tab are the layer's (anchor.ts): neither reaches a dialog around it.
      if (event.key === 'Escape' || event.key === 'Tab') {
        layer.onLayerKeyDown(event);
        return;
      }

      if (!enabledIndices.length) {
        return;
      }

      const currentPosition = enabledIndices.indexOf(activeIndex);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();

          const nextPosition =
            currentPosition < 0
              ? 0
              : (currentPosition + 1) % enabledIndices.length;

          setActiveIndex(enabledIndices[nextPosition]);
          break;
        }

        case 'ArrowUp': {
          event.preventDefault();

          const previousPosition =
            currentPosition < 0
              ? enabledIndices.length - 1
              : (currentPosition - 1 + enabledIndices.length) %
                enabledIndices.length;

          setActiveIndex(enabledIndices[previousPosition]);
          break;
        }

        case 'Home': {
          event.preventDefault();
          setActiveIndex(enabledIndices[0]);
          break;
        }

        case 'End': {
          event.preventDefault();
          setActiveIndex(enabledIndices[enabledIndices.length - 1]);
          break;
        }

        case 'Enter':
        case ' ': {
          event.preventDefault();

          const activeOption = options[activeIndex];

          if (activeOption) {
            selectOption(activeOption);
          }

          break;
        }

        default:
          break;
      }
    },
    [
      activeIndex,
      closeMenu,
      enabledIndices,
      layer,
      options,
      selectOption,
    ],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={cn('relative inline-flex', className)}>
      {/* ---------------------------------------------------------------------
          Button group
      --------------------------------------------------------------------- */}

      <div
        className={cn(
          'inline-flex overflow-hidden',
          sizeStyles.radius,
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {/* -------------------------------------------------------------------
            Primary action. ioiti-ui: a link when it leads somewhere.
        ------------------------------------------------------------------- */}

        {href && !disabled ? (
          <LinkComponent
            href={href}
            className={cn(
              'relative inline-flex items-center justify-center',
              'select-none font-medium',
              'focus-ring',
              sizeStyles.primary,
              VARIANT_STYLES[variant],
            )}
          >
            {icon}
            {label}
          </LinkComponent>
        ) : (
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'relative inline-flex items-center justify-center',
              'select-none font-medium',
              'focus-ring',
              sizeStyles.primary,
              VARIANT_STYLES[variant],
            )}
            {...props}
          >
            {icon}
            {label}
          </button>
        )}

        {/* -------------------------------------------------------------------
            Divider
        ------------------------------------------------------------------- */}

        <span
          aria-hidden="true"
          className={cn(
            'my-1.5 w-px self-stretch',
            variant === 'primary'
              ? 'bg-current/10'
              : 'bg-border',
          )}
        />

        {/* -------------------------------------------------------------------
            Dropdown trigger
        ------------------------------------------------------------------- */}

        <button
          ref={chevronRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={menuName}
          disabled={disabled}
          onClick={() => setOpen((previous) => !previous)}
          onKeyDown={layer.onTriggerKeyDown}
          className={cn(
            'relative inline-flex items-center justify-center',
            'select-none',
            'focus-ring',
            sizeStyles.chevron,
            VARIANT_STYLES[variant],
          )}
        >
          <motion.span
            aria-hidden="true"
            animate={{
              rotate: open ? 180 : 0,
            }}
            transition={menuTransition}
            className="flex items-center justify-center"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>
      </div>

      {/* -----------------------------------------------------------------------
          Dropdown menu
      ----------------------------------------------------------------------- */}

      {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            style={layer.style}
            role="menu"
            aria-label={menuName}
            aria-activedescendant={options[activeIndex] && !options[activeIndex].disabled ? `${idPrefix}-${activeIndex}` : undefined}
            tabIndex={-1}
            onKeyDown={handleMenuKeyDown}
            initial={{
              opacity: 0,
              scale: 0.96,
              y: layer.side === 'top' ? 4 : -4,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
              transition: reduceMotion
                ? { duration: 0 }
                : motionTransitions.easeExit,
            }}
            transition={menuTransition}
            className={cn(
              // ioiti-ui: what floats beside its trigger (recipes.ts), glass under the glass material (glass-float).
              FLOATING,
              'z-50 min-w-48 max-w-xs overflow-auto p-1 outline-none',
              layer.side === 'top' ? 'origin-bottom-right' : 'origin-top-right',
            )}
          >
            {options.map((option, index) => {
              const isActive =
                index === activeIndex && !option.disabled;
              // ioiti-ui: an option that leads somewhere is a link; the others are buttons.
              const Item: React.ElementType = option.href && !option.disabled ? LinkComponent : 'button';
              const itemProps = option.href && !option.disabled
                ? { href: option.href, onClick: () => setOpen(false) }
                : { type: 'button', disabled: option.disabled, onClick: () => selectOption(option) };

              return (
                <Item
                  key={option.value}
                  ref={(element: HTMLElement | null) => {
                    optionRefs.current[index] = element;
                  }}
                  id={`${idPrefix}-${index}`}
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={
                    option.disabled || undefined
                  }
                  {...itemProps}
                  onMouseEnter={() => {
                    if (!option.disabled) {
                      setActiveIndex(index);
                    }
                  }}
                  className={cn(
                    // ioiti-ui: a menu's row (recipes.ts), as DropdownMenu's.
                    MENU_ROW,
                    'w-full text-left',
                    sizeStyles.menuText,
                    'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
                    !option.disabled && 'hover:bg-surface-hover',
                    option.tone === 'danger' && 'text-negative',
                    isActive && 'bg-surface-hover',
                  )}
                >
                  {option.icon && (
                    <span
                      aria-hidden="true"
                      className="flex shrink-0 items-center justify-center [&_svg]:size-4"
                    >
                      {option.icon}
                    </span>
                  )}

                  <span className="min-w-0">
                    <span className="block truncate">{option.label}</span>
                    {option.description && (
                      <span className="block whitespace-normal text-xs text-muted-foreground">{option.description}</span>
                    )}
                  </span>
                </Item>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </div>
  );
}

export default SplitButton;