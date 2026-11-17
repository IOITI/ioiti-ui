'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, PRESSABLE, TOAST, TONE_TEXT } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';

export type VelocityToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type VelocityToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** ioiti-ui: what the toast leads on to: a link (`href`) or a button (`onClick`); using it closes the toast. */
export interface VelocityToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface VelocityToastProps {
  open: boolean;
  onDismiss?: () => void;
  title: string;
  description?: string;
  duration?: number;
  variant?: VelocityToastVariant;
  position?: VelocityToastPosition;
  showProgress?: boolean;
  icon?: React.ReactNode;
  className?: string;
  /** ioiti-ui: classes for the positioned wrapper, e.g. to clear a bar fixed at the bottom. */
  wrapperClassName?: string;
  /** ioiti-ui: the positioned wrapper's style: lifted above a bar at the bottom of the page (ToastProvider). */
  wrapperStyle?: React.CSSProperties;
  /** ioiti-ui: once it has left, its exit played: a queue shows the next one then (ToastProvider). */
  onExitComplete?: () => void;
  /** ioiti-ui: one thing to do from the toast, beside its words: a link or a button. Using it closes the toast. */
  action?: VelocityToastAction;
  /** ioiti-ui: what draws the action's link; the application's (LinkProvider) by default. */
  linkComponent?: React.ElementType;
}

const positionClasses: Record<VelocityToastPosition, string> = {
  'top-left': 'top-5 left-5 items-start',
  'top-center': 'top-5 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-5 right-5 items-end',
  'bottom-left': 'bottom-5 left-5 items-start',
  'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-5 right-5 items-end',
};

// ioiti-ui: the action's look, UndoToast's Undo: a small button raised on the toast.
const ACTION_CLASS =
  'inline-flex shrink-0 items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-surface-raised text-sm font-medium text-foreground transition-[color,background-color,border-color,scale] hover:bg-surface-hover hover:border-border-hover focus-ring';

const variantIcon = (variant: VelocityToastVariant, custom?: React.ReactNode) => {
  if (custom) return custom;
  switch (variant) {
    case 'success':
      return <Check className={cn('size-4', TONE_TEXT.positive)} />;
    case 'warning':
      return <AlertTriangle className={cn('size-4', TONE_TEXT.warning)} />;
    case 'error':
      return <AlertCircle className={cn('size-4', TONE_TEXT.negative)} />;
    case 'info':
      return <Info className={cn('size-4', TONE_TEXT.info)} />;
    default:
      return <Info className="size-4 text-muted-foreground" />;
  }
};

/**
 * VelocityToast — Enters with velocity and settles; the progress bar
 * responds naturally (animates from 100 -> 0 with a slight ease-in so the
 * last 10% feels like the toast is "deciding" to close).
 *
 * On hover the progress pauses; on leave it resumes with no jump. The
 * container slides in with a slightly higher initial velocity (initial y
 * offset 18px) that settles through a snappy spring, giving the toast a
 * feeling of motion.
 */
export const VelocityToast: React.FC<VelocityToastProps> = ({
  open,
  onDismiss,
  title,
  description,
  duration = 4000,
  variant = 'default',
  position = 'bottom-center',
  showProgress = true,
  icon,
  className,
  wrapperClassName,
  wrapperStyle,
  onExitComplete,
  action,
  linkComponent,
}) => {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  const [isVisible, setIsVisible] = useState(open);
  // ioiti-ui: the time stops under the pointer (EasyUI's) and while the keyboard is in the toast, the time to reach
  // its action or Close for who cannot point at it.
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPaused = isHovered || isFocused;

  // Progress driven by a framer-motion motion value so we can drive it from
  // a single tween that is responsive to hover (paused) and dismissal.
  const progressMV = useMotionValue(100);
  const progressWidth = useTransform(progressMV, (v) => `${v}%`);

  const remainingRef = useRef<number>(duration);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    progressMV.set(100);
    remainingRef.current = duration;
    startRef.current = performance.now();
  }, [open, duration, progressMV]);

  // Animate progress from 100 -> 0 over `remaining` ms. When isPaused we
  // simply skip the tween (progressMV holds its current value).
  useEffect(() => {
    if (!isVisible || !showProgress) return;
    if (isPaused) {
      // freeze the time origin so resume picks up where we left off
      startRef.current = performance.now() - (duration - remainingRef.current);
      return;
    }

    startRef.current = performance.now() - (duration - remainingRef.current);

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const remaining = Math.max(0, duration - elapsed);
      remainingRef.current = remaining;
      // Map remaining (duration -> 0) to (100 -> 0) with a slight ease-in
      // (pow 1.05) so the last 10% feels like the toast is "deciding" to close.
      const linear = remaining / duration;
      const eased = Math.pow(linear, 1.05);
      progressMV.set(eased * 100);

      if (remaining <= 0) {
        setIsVisible(false);
        onDismiss?.();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, isPaused, duration, progressMV, showProgress, onDismiss]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  // Whether the toast enters from above or below depends on the position
  const isTop = position.startsWith('top');

  return (
    <div
      className={cn(
        // ioiti-ui: above the sheets, the dialogs and the drawer (z-50), put in document.body after the page it is
        // in: on their layer, their scrim covered it, its action out of reach. Under the hints (z-[60]).
        'fixed z-[55] pointer-events-none flex flex-col',
        positionClasses[position],
        wrapperClassName
      )}
      style={wrapperStyle}
    >
      <AnimatePresence onExitComplete={onExitComplete}>
        {isVisible && (
          <motion.div
            // Entry: starts further out for a higher perceived velocity, then settles
            initial={{ opacity: 0, y: isTop ? -22 : 22, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
            exit={{ opacity: 0, scale: 0.96, y: isTop ? -12 : 12, transition: motionTransitions.easeExit }}
            transition={motionTransitions.springSnappy}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false);
            }}
            className={cn(
              // ioiti-ui: a toast's surface (recipes.ts), as UndoToast's; glass under the glass material (glass-float).
              TOAST,
              'pointer-events-auto relative overflow-hidden p-4 min-w-[280px] sm:min-w-[340px] max-w-md font-sans select-none',
              className
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="size-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0">
                {variantIcon(variant, icon)}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <p className="text-sm font-medium text-foreground line-clamp-2 break-words text-balance">{title}</p>
                {description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 break-words mt-0.5 text-pretty">{description}</p>
                )}
              </div>

              {/* ioiti-ui: what it leads on to, as UndoToast's Undo: a link where it leads somewhere, else a button. */}
              {action &&
                (action.href !== undefined ? (
                  <LinkComponent
                    href={action.href}
                    onClick={() => {
                      action.onClick?.();
                      handleDismiss();
                    }}
                    className={cn(ACTION_CLASS, 'motion-safe:active:scale-[0.97]')}
                  >
                    {action.label}
                  </LinkComponent>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      action.onClick?.();
                      handleDismiss();
                    }}
                    className={cn(ACTION_CLASS, PRESSABLE)}
                  >
                    {action.label}
                  </button>
                ))}

              <button
                type="button"
                onClick={handleDismiss}
                className={cn(CLOSE_SM, 'focus-ring')}
                aria-label="Close notification"
              >
                <X />
              </button>
            </div>

            {showProgress && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border overflow-hidden">
                {/* ioiti-ui: the time left in the accent, where the theme has one (accent:). */}
                <motion.div
                  className="h-full bg-foreground accent:bg-brand"
                  style={{ width: progressWidth }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
