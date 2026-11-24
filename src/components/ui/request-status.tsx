'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotionConfig } from 'framer-motion';
import { Check, AlertCircle, Copy, Send, Hourglass, CircleHelp, ArrowRight, X } from 'lucide-react';
import { cn, copyToClipboard } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, TONE_LINE, TONE_SOFT } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its buttons named in the provider's language.
import { useMessages } from '../locale-context.js';

// ioiti-ui: EasyUI's payment-status, made the steps of what the user asked for (an action sent from a page) rather
// than of a payment: asked, sent and waiting for its answer, done, refused, or no news ('unknown'). EasyUI's
// 'refunded' is gone.
export type RequestLifecycleStatus = 'processing' | 'verifying' | 'success' | 'failed' | 'unknown';

/** ioiti-ui: one figure of the outcome, in place of the receipt's items. */
export interface RequestStatusFigure {
  label: string;
  value: React.ReactNode;
}

export interface RequestStatusProps {
  /** Where the request stands. */
  status?: RequestLifecycleStatus;
  /** ioiti-ui: the step's heading, in the caller's words (EasyUI's were a payment's). */
  title: string;
  /** ioiti-ui: what the step means, in the caller's words. */
  description?: React.ReactNode;
  /** ioiti-ui: what it is about, in the pill (EasyUI's amount). */
  subject?: React.ReactNode;
  /** ioiti-ui: the outcome's figures, once known (EasyUI's transaction details and receipt). */
  figures?: RequestStatusFigure[];
  /** ioiti-ui: a reference to copy (an order, a request), with its name. */
  reference?: { label: string; value: string };
  /** ioiti-ui: where it is read further. */
  link?: { href: string; label: string };
  /** ioiti-ui: what draws the link; the application's (LinkProvider) by default. */
  linkComponent?: React.ElementType;
  /** ioiti-ui: the card is put away. It watched, and acted on nothing. */
  onDismiss?: () => void;
  /** Custom class name */
  className?: string;
}

// ioiti-ui: the design's tokens, and its tones (recipes.ts) for an outcome.
const BADGE = 'size-11 shrink-0 rounded-full flex items-center justify-center relative border';
const QUIET = 'bg-surface-raised border-border';

// ioiti-ui: no Retry, no other payment method, no receipt to view or download: the card follows what was asked and
// acts on nothing. Laid out in a row (the badge beside the words): docked at the edge of the screen, EasyUI's
// centred column took half of a phone's height.
export const RequestStatus: React.FC<RequestStatusProps> = ({
  status = 'processing',
  title,
  description,
  subject,
  figures = [],
  reference,
  link,
  linkComponent,
  onDismiss,
  className,
}) => {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  const words = useMessages().toast;
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotionConfig();
  // ioiti-ui: a spinner stands still where motion is reduced.
  const spin = reduce ? undefined : { rotate: 360 };

  const handleCopyId = () => {
    if (!reference) return;
    void copyToClipboard(reference.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        // ioiti-ui: a card in the page, with no shadow (it does not float); glass under the glass material (glass-card).
        'w-full rounded-2xl border border-border bg-surface p-5 text-left font-sans text-foreground glass-card',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Status Indicator Badge */}
        <div className="relative" aria-hidden="true">
          {status === 'processing' && (
            <div className={cn(BADGE, QUIET)}>
              {/* ioiti-ui: sending, in the accent where the theme has one (accent:). */}
              <motion.div
                className="absolute inset-0 rounded-full border border-foreground/25 border-t-foreground accent:border-brand/25 accent:border-t-brand"
                animate={spin}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
              <Send className="size-4 text-muted-foreground" />
            </div>
          )}

          {status === 'verifying' && (
            <div className={cn(BADGE, QUIET)}>
              <motion.div
                className="absolute inset-1 rounded-full border border-info/30 border-t-info"
                animate={spin}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <Hourglass className="size-5 text-info" />
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={motionTransitions.springSnappy}
              className={cn(BADGE, TONE_SOFT.positive, TONE_LINE.positive)}
            >
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ ...motionTransitions.easeSoft, delay: 0.1 }}
                />
              </svg>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={motionTransitions.springSnappy}
              className={cn(BADGE, TONE_SOFT.negative, TONE_LINE.negative)}
            >
              <AlertCircle className="size-6" />
            </motion.div>
          )}

          {status === 'unknown' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={motionTransitions.springSnappy}
              className={cn(BADGE, QUIET, 'text-muted-foreground')}
            >
              <CircleHelp className="size-6" />
            </motion.div>
          )}
        </div>

        {/* ioiti-ui: read out as it changes. */}
        <div className="min-w-0 flex-1" role="status" aria-live="polite">
          <h3 className="text-base font-semibold text-foreground tracking-tight text-balance">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 text-pretty">{description}</p>
          )}
          {/* Amount Pill. ioiti-ui: what it is about. */}
          {subject && (
            <div className="mt-3 inline-flex max-w-full items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border">
              <span className="truncate text-xs font-medium text-foreground">{subject}</span>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={words.dismiss}
            className={cn(CLOSE_SM, '-mr-1 -mt-1')}
          >
            <X />
          </button>
        )}
      </div>

      {/* Transaction Details Staggered Card. ioiti-ui: whenever there is something to show, a refusal too. */}
      <AnimatePresence mode="wait">
        {(figures.length > 0 || reference || link) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={motionTransitions.springGentle}
            className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm"
          >
            {figures.map((figure) => (
              <div key={figure.label} className="flex items-baseline justify-between gap-3 py-0.5">
                <span className="text-muted-foreground">{figure.label}</span>
                <span className="min-w-0 text-right tabular-nums text-foreground">{figure.value}</span>
              </div>
            ))}

            {reference && (
              <div className="flex items-center justify-between gap-3 py-0.5">
                <span className="text-muted-foreground">{reference.label}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex min-w-0 items-center gap-1 font-mono text-muted-foreground hover:text-foreground transition-[color,scale] px-1.5 py-0.5 rounded-md bg-surface-raised border border-border cursor-pointer motion-safe:active:scale-[0.97]"
                  aria-label={words.copyReference(reference)}
                >
                  <span className="truncate">{reference.value}</span>
                  {copied ? (
                    <Check className="size-3.5 shrink-0 text-positive" />
                  ) : (
                    <Copy className="size-3.5 shrink-0 text-muted-foreground" />
                  )}
                </button>
              </div>
            )}

            {link && (
              <div className="pt-2">
                <LinkComponent
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {link.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </LinkComponent>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
