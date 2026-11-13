'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Bell, CheckCheck, X } from 'lucide-react';
import { useAnchoredLayer } from '../../lib/anchor.js';
import { isPlainClick } from '../../lib/links.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: a moment is said from now, its full date in a hint.
import { RelativeTime } from '../RelativeTime.js';
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
  /** Controlled open state of notification drawer/panel. */
  isOpen?: boolean;
  /** Open state change handler. */
  onOpenChange?: (isOpen: boolean) => void;
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
   * ioiti-ui: they could not be read: what went wrong (`true`: "The notifications could not be read."), in place of
   * the list while there is none, above it otherwise (the list is then the last one read).
   */
  error?: React.ReactNode;
  /** ioiti-ui: reads them again: a "Try again" beside the error. */
  onRetry?: () => void;
  /** ioiti-ui: the trigger's own look, to sit with the buttons around it. */
  triggerClassName?: string;
  /** Custom CSS class names. */
  className?: string;
}

// ioiti-ui: each colour has a light value in front of EasyUI's own, kept behind `dark:`.
const DOT: Record<NotificationTone, string> = {
  neutral: 'bg-neutral-400 dark:bg-neutral-500',
  info: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500 animate-pulse',
};

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  isOpen: controlledIsOpen,
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
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const isPanelOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setPanelOpen = useCallback(
    (open: boolean) => {
      if (onOpenChange) onOpenChange(open);
      else setInternalIsOpen(open);
    },
    [onOpenChange]
  );

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

  // ioiti-ui: the notifications could not be read, and what to do about it.
  const failed = error !== undefined && error !== null && error !== false && error !== '';
  const failedSaid = error === true ? 'The notifications could not be read.' : error;
  const retry = failed && onRetry && (
    <button
      type="button"
      onClick={onRetry}
      className="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium text-neutral-900 underline-offset-2 hover:underline focus-ring cursor-pointer dark:text-[#FAFAFA]"
    >
      Try again
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
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        aria-expanded={isPanelOpen}
        aria-label={
          unreadCount > 0
            ? `${unreadCount} unread notifications`
            : 'Notifications'
        }
        className={cn(
          'relative cursor-pointer transition-colors',
          triggerClassName ??
            // ioiti-ui: the top bar's icon buttons' look (IconButton), where it sits: square, quiet until hovered, giving
            // a little when pressed; held as pressed while its panel is open. EasyUI's was a bordered box that grew.
            cn(
              'grid size-9 shrink-0 place-items-center rounded-lg transition motion-safe:active:scale-95 [&>svg]:size-[18px]',
              isPanelOpen
                ? 'bg-neutral-200/70 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-500 hover:bg-neutral-200/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
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
                'absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-rose-600 text-white font-mono font-bold border-2 border-background',
                showCount
                  ? 'min-w-[18px] h-[18px] px-1 text-[9px]'
                  : 'w-2.5 h-2.5'
              )}
            >
              {showCount && (unreadCount > 99 ? '99+' : unreadCount)}
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
            style={layer.style}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            // ioiti-ui: it leaves quicker than it came (easeExit), as everything that floats.
            exit={{ opacity: 0, y: 8, scale: 0.95, transition: motionTransitions.easeExit }}
            transition={motionTransitions.springSnappy}
            role="dialog"
            aria-label="Notifications"
            // ioiti-ui: on a phone the panel spans the screen but its edges (centred on the bell, it went past the edge).
            // Glass under the glass material (glass-float), its header clear on it.
            className="flex w-[calc(100vw-2rem)] flex-col outline-none sm:w-96 rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200 shadow-[0_16px_40px_rgba(0,0,0,0.12)] z-50 overflow-hidden dark:bg-[#0E0E0E]/95 dark:border-[#1F1F1F] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)] glass-float"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50 dark:border-[#1F1F1F] dark:bg-[#141414] glass:bg-transparent">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-900 dark:text-[#FAFAFA]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/20 text-[10px] font-mono dark:text-rose-400">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="p-1 rounded-lg text-[10px] text-muted-foreground hover:text-neutral-900 hover:bg-neutral-100 transition-colors flex items-center gap-1 cursor-pointer dark:hover:text-white dark:hover:bg-[#141414]"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer dark:hover:text-white dark:hover:bg-[#141414]"
                  aria-label="Close notifications"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ioiti-ui: the last list read stays under an error, which says it is not up to date. */}
            {failed && notifications.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-neutral-200 px-4 py-2 text-xs text-negative dark:border-[#1F1F1F]">
                <span className="min-w-0">{failedSaid}</span>
                {retry}
              </div>
            )}

            {/* List */}
            <div className="min-h-0 max-h-80 overflow-y-auto divide-y divide-neutral-200 dark:divide-[#1F1F1F]">
              {notifications.length === 0 && failed ? (
                // ioiti-ui: what is true when nothing could be read: not "No notifications right now".
                <div className="py-8 px-4 text-center">
                  <AlertCircle aria-hidden="true" className="w-6 h-6 text-negative mx-auto mb-2" />
                  <p className="text-xs text-negative">{failedSaid}</p>
                  {retry && <div className="mt-3 flex justify-center">{retry}</div>}
                </div>
              ) : notifications.length === 0 && loading ? (
                // ioiti-ui: entries to come, as high as they will be; named for screen readers.
                <div role="status" aria-label="Loading the notifications" className="divide-y divide-neutral-200 dark:divide-[#1F1F1F]">
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="p-3 flex items-start gap-3">
                      <Skeleton className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-4/5" />
                        <Skeleton className="h-2.5 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <Bell className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No notifications right now</p>
                </div>
              ) : (
                notifications.map((item) => {
                  const messageClass = cn(
                    'text-xs leading-relaxed text-neutral-600 dark:text-[#A1A1A1]',
                    !item.read && 'font-medium text-neutral-900 dark:text-[#FAFAFA]'
                  );

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        'p-3 flex items-start gap-3 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]',
                        !item.read && 'bg-neutral-50 dark:bg-[#141414]'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'w-2 h-2 rounded-full mt-1.5 shrink-0',
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
                        <span className="text-[10px] font-mono text-muted-foreground mt-1 block">
                          {typeof item.timestamp === 'string' ? item.timestamp : <RelativeTime value={item.timestamp} past />}
                        </span>
                      </div>

                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(item.id)}
                          className="p-1 rounded text-muted-foreground hover:text-neutral-900 hover:bg-neutral-100 transition-colors shrink-0 cursor-pointer dark:hover:text-white dark:hover:bg-[#0E0E0E]"
                          title="Mark as read"
                          aria-label="Mark notification as read"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>

            {footer && (
              <div className="border-t border-neutral-200 px-4 py-2.5 text-xs text-muted-foreground dark:border-[#1F1F1F]">{footer}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
