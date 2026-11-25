'use client';

// ioiti-ui: EasyUI's island reduced to its two first states, collapsed and expanded, with the caller's content in both.
// Its profile and share states, avatar, greeting and social links are gone. The pill stays in the flow of the top
// bar it sits in, and the opened island grows from it below (shared layoutId), so the bar keeps its height.

import React, { useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotionConfig } from 'framer-motion';
import { X } from 'lucide-react';
// ioiti-ui: held by its caller or by itself, as every state (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, FLOATING } from '../../lib/recipes.js';
import { cn } from '../../lib/utils.js';
// ioiti-ui: what it says to a screen reader in the provider's language.
import { useMessages } from '../locale-context.js';

// ioiti-ui: named after its role, `StatusIsland` (EasyUI's `DynamicIsland`, its former name, removed in 1.0).
export type StatusIslandState = 'collapsed' | 'expanded';

export interface StatusIslandProps {
  /** ioiti-ui: what the pill shows, collapsed: the whole pill opens the island. */
  compact: React.ReactNode;
  /** ioiti-ui: what the island shows, opened. */
  children: React.ReactNode;
  /** ioiti-ui: the name of the pill and of the opened island, for screen readers. */
  label: string;
  defaultState?: StatusIslandState;
  state?: StatusIslandState;
  onStateChange?: (state: StatusIslandState) => void;
  className?: string;
}

/**
 * ioiti-ui: a dialog over the page (the confirmation of a Close opened from the island) takes its own clicks and its
 * Escape, which starts in it: it holds the focus while it is open.
 */
function inDialog(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[aria-modal="true"]') !== null;
}

export const StatusIsland: React.FC<StatusIslandProps> = ({
  compact,
  children,
  label,
  defaultState = 'collapsed',
  state: controlledState,
  onStateChange,
  className,
}) => {
  const [currentState, handleStateChange] = useControllableState(controlledState, defaultState, onStateChange);

  const rawId = useId();
  const instanceId = `dyn-island-${rawId.replace(/[:]/g, '')}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotionConfig();
  const words = useMessages().toast;

  // ioiti-ui: the keyboard follows the island: into it when it opens, back to the pill when it closes.
  const opened = useRef(false);
  useEffect(() => {
    if (currentState === 'expanded') {
      opened.current = true;
      closeRef.current?.focus();
    } else if (opened.current) {
      opened.current = false;
      pillRef.current?.focus();
    }
  }, [currentState]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (currentState === 'collapsed') return;

    const handlePointerDown = (event: PointerEvent) => {
      if (inDialog(event.target)) return;
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleStateChange('collapsed');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !inDialog(event.target)) {
        handleStateChange('collapsed');
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentState, handleStateChange]);

  // ioiti-ui: the design's motion: the island grows from the pill as what floats in (springSnappy, no overshoot),
  // its content fades in quickly (easeFast).
  const springTransition = shouldReduceMotion ? { duration: 0 } : motionTransitions.springSnappy;

  const contentTransition = shouldReduceMotion ? { duration: 0 } : motionTransitions.easeFast;

  // ioiti-ui: glass under the glass material (glass-float): the pill and the open island are siblings, neither
  // holding a fixed child. The pill is a control in the bar, lifted a hair; the open island floats (FLOATING).
  const pillSurface = 'border border-border bg-surface text-foreground shadow-subtle transition-[color,background-color,scale] glass-float';

  const expanded = currentState === 'expanded';

  return (
    <div ref={containerRef} className={cn('relative inline-flex items-center justify-center', className)}>
      {/* STATE 1: COLLAPSED. ioiti-ui: the pill is a button, as wide as it is when the island is open (it keeps its place). */}
      <motion.button
        ref={pillRef}
        type="button"
        layoutId={expanded ? undefined : instanceId}
        transition={springTransition}
        onClick={() => handleStateChange('expanded')}
        aria-expanded={expanded}
        aria-controls={expanded ? `${instanceId}-panel` : undefined}
        className={cn(
          pillSurface,
          'inline-flex h-8 items-center gap-2 rounded-full px-3 text-sm font-medium cursor-pointer motion-safe:active:scale-[0.97] hover:bg-surface-hover',
          expanded && 'invisible'
        )}
      >
        <span className="sr-only">{words.islandName(label)}</span>{' '}
        {compact}
      </motion.button>

      {/* STATE 2: EXPANDED */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="island-expanded"
            id={`${instanceId}-panel`}
            role="region"
            aria-label={label}
            layoutId={instanceId}
            transition={springTransition}
            className={cn(
              FLOATING,
              // From the pill's left edge, over the page rather than the menu beside it; on a phone across the screen
              // under the top bar.
              'fixed inset-x-4 top-16 z-40 overflow-hidden sm:absolute sm:inset-x-auto sm:left-0 sm:top-0 sm:w-[22rem]'
            )}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={contentTransition}
              className="relative p-4"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={() => handleStateChange('collapsed')}
                aria-label={words.closeIsland(label)}
                className={cn(CLOSE_SM, 'absolute right-3 top-3')}
              >
                <X />
              </button>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
