'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Bell, CheckCheck, X } from 'lucide-react';
import { focusables, useAnchoredLayer } from '../../lib/anchor.js';
// ioiti-ui: held by its caller or by itself, as every layer (useControllableState); a former name said once, in
// development (deprecated).
import { useControllableState } from '../../lib/controllable.js';
import { deprecated } from '../../lib/deprecated.js';
import { isPlainClick } from '../../lib/links.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, FLOATING, PRESSABLE, TONE_LINE, TONE_MARK, TONE_SOFT, TONE_SOLID } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its words in the provider's language, its counts in its locale.
import { useFormat, useMessages } from '../locale-context.js';
// ioiti-ui: a moment is said from now, its full date in a hint.
import { RelativeTime } from '../RelativeTime.js';
import { Hint } from '../Hint.js';
import { Skeleton } from './skeleton.js';

/** ioiti-ui: what kind of news an entry is, for its dot. */
export type NotificationTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface Notification {
  id: string;
  message: string;
  /** ioiti-ui: a second line under the message. */
  detail?: string;
  timestamp: Date | string;
  read: boolean;
  action?: () => void;
  /** ioiti-ui: where it leads: the message is then a link (opened elsewhere with ⌘ or Ctrl). */
  href?: string;
  tone?: NotificationTone;
}

export interface NotificationBellProps {
  /** List of notifications. */
  notifications: Notification[];
  /** Handler when an item is marked as read. */
  onMarkAsRead: (id: string) => void;
  /** Optional handler to mark all as read. */
  onMarkAllAsRead?: () => void;
  /** ioiti-ui: its panel open, held by the page (told of each change by `onOpenChange`). */
  open?: boolean;
  /** ioiti-ui: its panel open at first, the bell holding it then; closed by default. */
  defaultOpen?: boolean;
  /** @deprecated Use `open`. Removed in 1.0. */
  isOpen?: boolean;
  /** Open state change handler. ioiti-ui: told of every change, whoever holds it. */
  onOpenChange?: (open: boolean) => void;
  /** Show numeric counter inside red badge. Default is true. */
  showCount?: boolean;
  /** ioiti-ui: what draws an entry's link; the application's (LinkProvider) by default. */
  linkComponent?: React.ElementType;
  /** ioiti-ui: under the list (a setting of the notifications, that only the latest are shown). */
  footer?: React.ReactNode;
  /**
   * ioiti-ui: the notifications are still being read: said in place of the list while there is none (never "No
   * notifications right now", which is not known yet).
   */
  loading?: boolean;
  /**
   * ioiti-ui: they could not be read: what went wrong (`true`: "The notifications could not be read.", in the provider's
   * language), in place of the list while there is none, above it otherwise (the list is then the last one read).
   */
  error?: React.ReactNode;
  /** ioiti-ui: reads them again: a "Try again" beside the error. */
  onRetry?: () => void;
  /** ioiti-ui: the trigger's own look, to sit with the buttons around it. */
  triggerClassName?: string;
  /** Custom CSS class names. */
  className?: string;
}

// ioiti-ui: the design's tones (recipes.ts), as a dot.
const DOT: Record<NotificationTone, string> = {
  neutral: TONE_MARK.neutral,
  info: TONE_MARK.info,
  success: TONE_MARK.positive,
  warning: TONE_MARK.warning,
  danger: `${TONE_MARK.negative} animate-pulse`,
};

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  open,
  defaultOpen = false,
  isOpen: formerOpen,
  onOpenChange,
  showCount = true,
  linkComponent,
  footer,
  loading = false,
  error,
  onRetry,
  triggerClassName,
  className,
}) => {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  // ioiti-ui: its words in the provider's language, its counts in its locale ("1 unread notification", counted).
  const words = useMessages().notification;
  const { formatNumber } = useFormat();
  const [isShaking, setIsShaking] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  // ioiti-ui: its list, whose entries the focus goes on to (below).
  const listRef = useRef<HTMLDivElement>(null);

  // ioiti-ui: `open`, as every layer; `isOpen`, its former name, read where it alone is given. Held by the bell unless
  // the page holds it, `onOpenChange` told either way: given without `isOpen`, it took the bell's own state's place,
  // and the panel never opened.
  if (formerOpen !== undefined) deprecated('notification-bell-is-open', 'NotificationBell');
  const [isPanelOpen, setPanelOpen] = useControllableState(open ?? formerOpen, defaultOpen, onOpenChange);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const prevCountRef = useRef(unreadCount);

  // Trigger subtle bell shake when new unread notifications arrive
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  // ioiti-ui: the panel is a layer in document.body, placed under the bell (anchor.ts): drawn in the top bar, it would
  // be held by a blur, a filter or a transform the bar took (its containing block, its backdrop's root: the panel's own
  // blur would see nothing of the page).
  // A press elsewhere, Escape and a Tab past its ends close it; the focus goes into it, and back to the bell.
  const layer = useAnchoredLayer({
    open: isPanelOpen,
    onClose: () => setPanelOpen(false),
    triggerRef,
    layerRef,
    side: 'bottom',
    align: 'end',
    offset: 8,
  });

  // ioiti-ui: what has the focus in the panel, and the entries after its own. A control that goes once pressed (Read
  // all, an entry's Mark as read, Try again) gave it to the page's body, the panel still open: its Escape no longer
  // heard, the next Tab from the top of the page.
  const focused = useRef<{ control: HTMLElement; entry: HTMLElement | null; after: HTMLElement[] } | null>(null);
  const followFocus = (event: React.FocusEvent<HTMLElement>) => {
    const control = event.target;
    const entries = Array.from(listRef.current?.children ?? []) as HTMLElement[];
    const at = entries.findIndex((entry) => entry.contains(control));
    focused.current =
      control === layerRef.current ? null : { control, entry: entries[at] ?? null, after: at >= 0 ? entries.slice(at + 1) : [] };
  };
  // ioiti-ui: that control gone (its entry read, or every one), the focus on the first control of an entry after its
  // own (the next to read), else on the panel: its keys its own still, Tab going on from there. Whenever it goes: at
  // once, or once the application has had its answer.
  useLayoutEffect(() => {
    const had = focused.current;
    if (!had || had.control.isConnected) return;
    focused.current = null;
    const panel = layerRef.current;
    if (!isPanelOpen || !panel?.isConnected) return;
    // The focus already elsewhere (a press on the page): left there.
    if (document.activeElement && document.activeElement !== document.body) return;
    const list = listRef.current;
    const listed = list ? (Array.from(list.children) as HTMLElement[]) : [];
    const after = had.entry?.isConnected ? listed.slice(listed.indexOf(had.entry) + 1) : had.after.filter((entry) => entry.isConnected);
    const next = after.map((entry) => focusables(entry)[0]).find((control) => control !== undefined);
    (next ?? panel).focus();
  });

  // ioiti-ui: the notifications could not be read, and what to do about it.
  const failed = error !== undefined && error !== null && error !== false && error !== '';
  const failedSaid = error === true ? words.readFailed : error;
  const retry = failed && onRetry && (
    <button
      type="button"
      onClick={onRetry}
      className="shrink-0 rounded-md px-1.5 py-0.5 text-sm font-medium text-foreground underline-offset-2 hover:underline focus-ring cursor-pointer"
    >
      {words.tryAgain}
    </button>
  );

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Bell Trigger Button */}
      <motion.button
        ref={triggerRef}
        type="button"
        onKeyDown={layer.onTriggerKeyDown}
        onClick={() => setPanelOpen(!isPanelOpen)}
        animate={
          isShaking
            ? {
                rotate: [0, -12, 10, -8, 6, -2, 0],
              }
            : {}
        }
        transition={{ ...motionTransitions.easeSoft, duration: 0.5 }}
        aria-expanded={isPanelOpen}
        aria-label={
          unreadCount > 0
            ? words.unread(unreadCount)
            : words.notifications
        }
        className={cn(
          'relative cursor-pointer transition-colors',
          triggerClassName ??
            // ioiti-ui: the top bar's icon buttons' look (IconButton), where it sits: square, quiet until hovered, giving
            // a little when pressed; held as pressed while its panel is open. EasyUI's was a bordered box that grew.
            cn(
              'grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-[color,background-color,scale] hover:bg-surface-hover hover:text-foreground [&>svg]:size-[18px]',
              PRESSABLE,
              isPanelOpen && 'bg-surface-hover text-foreground'
            )
        )}
      >
        <Bell />

        {/* Unread Badge / Red Dot */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={motionTransitions.springSnappy}
              className={cn(
                'absolute -top-1 -right-1 flex items-center justify-center rounded-full font-mono font-semibold tabular-nums border-2 border-background',
                TONE_SOLID.negative,
                showCount
                  ? 'min-w-[18px] h-[18px] px-1 text-[11px]'
                  : 'size-2.5'
              )}
            >
              {showCount && (unreadCount > 99 ? words.overflow(99) : formatNumber(unreadCount))}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Notification Panel */}
      {typeof document !== 'undefined' &&
        createPortal(
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            ref={layerRef}
            tabIndex={-1}
            onKeyDown={layer.onLayerKeyDown}
            // ioiti-ui: where the focus is in it, for it to stay in it when what holds it goes.
            onFocus={followFocus}
            style={layer.style}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
            exit={{ opacity: 0, y: 8, scale: 0.95, transition: motionTransitions.easeExit }}
            transition={motionTransitions.springSnappy}
            role="dialog"
            aria-label={words.notifications}
            // ioiti-ui: on a phone the panel spans the screen but its edges (centred on the bell, it went past the edge).
            // Glass under the glass material (glass-float), its header clear on it.
            className={cn(FLOATING, 'flex w-[calc(100vw-2rem)] flex-col outline-none sm:w-96 z-50 overflow-hidden')}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-raised glass:bg-transparent">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{words.notifications}</span>
                {unreadCount > 0 && (
                  <span className={cn('px-1.5 py-0.5 rounded-full border text-[11px] font-mono tabular-nums', TONE_SOFT.negative, TONE_LINE.negative)}>
                    {words.newCount(unreadCount)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* ioiti-ui: what it does in a Hint, not a title. */}
                {unreadCount > 0 && onMarkAllAsRead && (
                  <Hint content={words.markAllRead}>
                    <button
                      type="button"
                      onClick={onMarkAllAsRead}
                      className={cn('p-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-[color,background-color,scale] flex items-center gap-1', PRESSABLE)}
                    >
                      <CheckCheck className="size-3.5" />
                      <span>{words.readAll}</span>
                    </button>
                  </Hint>
                )}
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className={CLOSE_SM}
                  aria-label={words.close}
                >
                  <X />
                </button>
              </div>
            </div>

            {/* ioiti-ui: the last list read stays under an error, which says it is not up to date. */}
            {failed && notifications.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border px-4 py-2 text-sm text-negative">
                <span className="min-w-0">{failedSaid}</span>
                {retry}
              </div>
            )}

            {/* List */}
            <div ref={listRef} className="min-h-0 max-h-80 overflow-y-auto divide-y divide-border/40">
              {notifications.length === 0 && failed ? (
                // ioiti-ui: what is true when nothing could be read: not "No notifications right now".
                <div className="py-8 px-4 text-center">
                  <AlertCircle aria-hidden="true" className="size-6 text-negative mx-auto mb-2" />
                  <p className="text-sm text-negative">{failedSaid}</p>
                  {retry && <div className="mt-3 flex justify-center">{retry}</div>}
                </div>
              ) : notifications.length === 0 && loading ? (
                // ioiti-ui: entries to come, as high as they will be; named for screen readers.
                <div role="status" aria-label={words.loading} className="divide-y divide-border/40">
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="p-3 flex items-start gap-3">
                      <Skeleton className="size-2 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-4/5" />
                        <Skeleton className="h-2.5 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <Bell className="size-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{words.empty}</p>
                </div>
              ) : (
                notifications.map((item) => {
                  const messageClass = cn(
                    'text-sm leading-relaxed text-muted-foreground',
                    !item.read && 'font-medium text-foreground'
                  );

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        'p-3 flex items-start gap-3 transition-colors hover:bg-surface-hover',
                        !item.read && 'bg-surface-hover'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'size-2 rounded-full mt-1.5 shrink-0',
                          item.read ? 'bg-transparent' : DOT[item.tone ?? 'danger']
                        )}
                      />

                      <div className="flex-1 min-w-0">
                        {/* ioiti-ui: an entry that leads somewhere is a link; followed, it is read and the panel closes. */}
                        {item.href !== undefined ? (
                          <LinkComponent
                            href={item.href}
                            onClick={(e: React.MouseEvent) => {
                              onMarkAsRead(item.id);
                              if (isPlainClick(e)) setPanelOpen(false);
                            }}
                            className={cn(messageClass, 'block underline-offset-2 hover:underline')}
                          >
                            {item.message}
                          </LinkComponent>
                        ) : (
                          <p className={messageClass}>{item.message}</p>
                        )}
                        {item.detail && (
                          <p className="text-xs text-muted-foreground leading-relaxed [overflow-wrap:anywhere]">{item.detail}</p>
                        )}
                        {/* ioiti-ui: a Date is said from now ("3 min ago", the day it was only in EasyUI), a string as the application wrote it. */}
                        <span className="text-xs font-mono text-muted-foreground mt-1 block">
                          {typeof item.timestamp === 'string' ? item.timestamp : <RelativeTime value={item.timestamp} past />}
                        </span>
                      </div>

                      {/* ioiti-ui: what it does in a Hint, not a title. */}
                      {!item.read && (
                        <Hint content={words.markRead}>
                          <button
                            type="button"
                            onClick={() => onMarkAsRead(item.id)}
                            className={cn('p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-raised transition-[color,background-color,scale] shrink-0', PRESSABLE)}
                            aria-label={words.markNotificationRead}
                          >
                            <CheckCheck className="size-3.5" />
                          </button>
                        </Hint>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>

            {footer && (
              <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">{footer}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
