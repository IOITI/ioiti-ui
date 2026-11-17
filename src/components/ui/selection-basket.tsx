'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Share2,
  Download,
  FolderInput,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, PRESSABLE, TONE_LINE, TONE_SOFT, TOAST } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
import { DirectionalTooltip } from './directional-tooltip.js';
import { Hint } from '../Hint.js';

export interface SelectionActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'primary';
  onClick?: () => void;
  /** ioiti-ui: where it leads, when it leads to another page: a link, drawn by `linkComponent`. */
  href?: string;
  /** ioiti-ui: not possible for the selection now; `title` says why, in a tooltip (hover, focus, tap). */
  disabled?: boolean;
  title?: string;
}

export interface SelectionBasketProps {
  /** Count of selected items */
  selectedCount: number;
  /** Total count of all items (for select all calculation) */
  totalCount?: number;
  /**
   * Position mode: 'fixed' attaches to browser viewport, 'contained' / 'inline' stays within parent container.
   * ioiti-ui: 'sticky' stays at the bottom of the screen while its list is on it, and rests under the list past it.
   */
  mode?: 'fixed' | 'contained' | 'inline' | 'sticky';
  /** Custom actions list */
  actions?: SelectionActionItem[];
  /** Callback to clear all selections */
  onClearSelection?: () => void;
  /** Callback to select all items */
  onSelectAll?: () => void;
  /** ioiti-ui: whether every item that can be is selected (EasyUI compares the counts, wrong once a search hides some). */
  allSelected?: boolean;
  /** ioiti-ui: what an item is, one and several ("file", "files"). */
  noun?: [string, string];
  /** ioiti-ui: what draws an action that has an `href`; the application's link (LinkProvider) by default. */
  linkComponent?: React.ElementType;
  /** Custom class name */
  className?: string;
}

const defaultActions: SelectionActionItem[] = [
  { id: 'export', label: 'Export', icon: <Download className="size-3.5" /> },
  { id: 'move', label: 'Move to Folder', icon: <FolderInput className="size-3.5" /> },
  { id: 'share', label: 'Share', icon: <Share2 className="size-3.5" /> },
  { id: 'delete', label: 'Delete', icon: <Trash2 className="size-3.5" />, variant: 'danger' },
];

export const SelectionBasket: React.FC<SelectionBasketProps> = ({
  selectedCount,
  totalCount,
  mode = 'fixed',
  actions = defaultActions,
  onClearSelection,
  onSelectAll,
  allSelected,
  noun = ['item', 'items'],
  linkComponent,
  className,
}) => {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  const isVisible = selectedCount > 0;
  const isAllSelected = allSelected ?? (totalCount !== undefined && selectedCount === totalCount && totalCount > 0);

  const wrapperClass =
    mode === 'fixed'
      ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]'
      : mode === 'contained'
      ? 'absolute bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-[95%]'
      : mode === 'sticky'
      ? 'sticky bottom-4 mx-auto w-fit max-w-full z-30'
      : // ioiti-ui: no wider than its container either, its bar scrolling inside (a phone).
        'relative mt-4 mx-auto w-fit max-w-full z-20';

  // ioiti-ui: the design's tokens, its recipes (recipes.ts) for the bar, its tones and its close.
  return (
    <AnimatePresence>
      {isVisible && (
        <div className={cn('pointer-events-none font-sans select-none', wrapperClass)}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            // ioiti-ui: the motion of everything that floats, without the overshoot a gesture's return keeps.
            exit={{ opacity: 0, y: 16, scale: 0.95, transition: motionTransitions.easeExit }}
            transition={motionTransitions.springSnappy}
            className={cn(
              // ioiti-ui: a bar that floats over the page, a toast's surface (TOAST), its own padding round its
              // buttons; glass under the glass material (glass-float).
              TOAST,
              'pointer-events-auto flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 overflow-x-auto max-w-full',
              className
            )}
            role="toolbar"
            aria-label="Bulk actions toolbar"
          >
            {/* Selected Count Indicator */}
            <div className="flex items-center gap-2 pl-3 pr-2 py-1 border-r border-border shrink-0">
              {/* ioiti-ui: the count, and the primary action below, in the accent (accent:). */}
              <span className="min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground accent:bg-brand accent:text-brand-foreground text-[11px] font-semibold font-mono tabular-nums flex items-center justify-center">
                {selectedCount}
              </span>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {selectedCount === 1 ? `${noun[0]} selected` : `${noun[1]} selected`}
              </span>

              {/* Select all toggle */}
              {onSelectAll && totalCount && (
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors ml-1 underline underline-offset-2 cursor-pointer"
                >
                  {isAllSelected ? 'Select none' : `All (${totalCount})`}
                </button>
              )}
            </div>

            {/* Action Buttons (the bar itself scrolls on narrow screens: ioiti-ui, so that no focus ring is cut) */}
            <div className="flex items-center gap-1.5 shrink-0 py-0.5">
              {actions.map((action) => {
                const isDanger = action.variant === 'danger';
                const isPrimary = action.variant === 'primary';
                // ioiti-ui: Button's looks: the negative tone soft at rest and filled under the pointer (not when it is
                // disabled), ink, or a raised control.
                const classes = cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-[color,background-color,border-color,opacity,scale] focus-ring whitespace-nowrap',
                  PRESSABLE,
                  isDanger
                    ? cn(TONE_SOFT.negative, 'border', TONE_LINE.negative, 'not-disabled:hover:bg-negative dark:not-disabled:hover:bg-negative not-disabled:hover:text-background')
                    : isPrimary
                    ? 'bg-primary text-primary-foreground not-disabled:hover:opacity-90 accent:bg-brand accent:hover:bg-brand/90 accent:text-brand-foreground'
                    : 'bg-surface hover:bg-surface-hover border border-border hover:border-border-hover text-text-secondary hover:text-foreground'
                );
                const content = (
                  <>
                    {action.icon}
                    <span>{action.label}</span>
                  </>
                );

                // ioiti-ui: what leads to another page is a link (a click with ⌘ or Ctrl opens it in another tab).
                const control =
                  action.href !== undefined && !action.disabled ? (
                    <LinkComponent href={action.href} onClick={action.onClick} className={classes}>
                      {content}
                    </LinkComponent>
                  ) : (
                    <button type="button" onClick={action.onClick} disabled={action.disabled} className={classes}>
                      {content}
                    </button>
                  );
                if (!action.title) return <React.Fragment key={action.id}>{control}</React.Fragment>;
                // ioiti-ui: a disabled control takes neither focus nor pointer: a wrapper takes them for its tooltip.
                return (
                  <DirectionalTooltip key={action.id} content={action.title} side="top">
                    {action.disabled ? (
                      <span tabIndex={0} className="inline-flex rounded-lg [&>:disabled]:pointer-events-none">
                        {control}
                      </span>
                    ) : (
                      control
                    )}
                  </DirectionalTooltip>
                );
              })}
            </div>

            {/* Clear selection close button */}
            {/* ioiti-ui: what it does in a Hint, shown on hover, keyboard focus and a tap, not a title. */}
            {onClearSelection && (
              <Hint content="Clear the selection">
              <button
                type="button"
                onClick={onClearSelection}
                className={cn(CLOSE_SM, 'ml-1 focus-ring')}
                aria-label="Clear the selection"
              >
                <X />
              </button>
              </Hint>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
