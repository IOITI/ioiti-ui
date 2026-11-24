"use client";

import * as React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { TONE_LINE, TONE_MARK, TONE_SOFT, TONE_SOLID, TONE_TEXT, type Tone } from "../../lib/recipes.js";
// ioiti-ui: its tone, the package's word for a status (StatusTone, docs/conventions.md).
import type { StatusTone } from "../../lib/tones.js";
// ioiti-ui: its × button's name in the provider's language (`status`).
import { useMessages } from "../locale-context.js";

// ioiti-ui: what floats in takes the design's spring (EasyUI's was 520/36/0.6).
const spring = motionTransitions.springSnappy;

export type BadgeVariant = "soft" | "solid" | "outline";
/**
 * ioiti-ui: a StatusTone, the tones of a state (Alert's too): `neutral`, `info`, `success`, `warning`, `danger`. EasyUI's
 * had no `info`.
 */
export type BadgeTone = StatusTone;

// ioiti-ui: the design's tones (recipes.ts), the same as every other component's: danger is the negative red, not a
// palette's step, and each word keeps 4.5:1 on every surface. Info in its own, as Alert draws it.
const TONE: Record<BadgeTone, Tone> = { neutral: "neutral", info: "info", success: "positive", warning: "warning", danger: "negative" };

const styles: Record<BadgeVariant, Record<BadgeTone, string>> = {
  soft: {
    neutral: TONE_SOFT.neutral,
    info: TONE_SOFT.info,
    success: TONE_SOFT.positive,
    warning: TONE_SOFT.warning,
    danger: TONE_SOFT.negative,
  },
  solid: {
    // ioiti-ui: the emphasis, in the accent where the theme has one (accent:); the tones keep their colours.
    neutral: `${TONE_SOLID.neutral} accent:bg-brand accent:text-brand-foreground`,
    info: TONE_SOLID.info,
    success: TONE_SOLID.positive,
    warning: TONE_SOLID.warning,
    danger: TONE_SOLID.negative,
  },
  outline: {
    neutral: `${TONE_LINE.neutral} text-text-secondary`,
    info: `${TONE_LINE.info} ${TONE_TEXT.info}`,
    success: `${TONE_LINE.positive} ${TONE_TEXT.positive}`,
    warning: `${TONE_LINE.warning} ${TONE_TEXT.warning}`,
    danger: `${TONE_LINE.negative} ${TONE_TEXT.negative}`,
  },
};

const dots: Record<BadgeTone, string> = {
  neutral: TONE_MARK[TONE.neutral],
  info: TONE_MARK[TONE.info],
  success: TONE_MARK[TONE.success],
  warning: TONE_MARK[TONE.warning],
  danger: TONE_MARK[TONE.danger],
};

export type BadgeProps = Omit<HTMLMotionProps<"span">, "children"> & {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  /** Leading status dot. */
  dot?: boolean;
  /** Soft ping on the dot, use for live status only. */
  pulse?: boolean;
  /** Shows an × button (chip). */
  onRemove?: () => void;
  /**
   * ioiti-ui: the × button's name for a screen reader: "Remove Lyon", each chip's its own ("Remove" otherwise, in the
   * provider's language).
   */
  removeLabel?: string;
  /** ioiti-ui: whether the × button is a stop of the keyboard (a field of chips removes them with Backspace). */
  removeFocusable?: boolean;
  children?: React.ReactNode;
};

export function Badge({
  variant = "soft",
  tone = "neutral",
  dot,
  pulse,
  onRemove,
  removeLabel: givenRemoveLabel,
  removeFocusable = true,
  className,
  children,
  ...props
}: BadgeProps) {
  // ioiti-ui: the provider's word unless one is given.
  const words = useMessages().status;
  const removeLabel = givenRemoveLabel ?? words.remove;
  // strings & numbers roll when they change (counts, status labels)
  const roll = typeof children === "string" || typeof children === "number";

  return (
    <motion.span
      style={props.style}
      className={cn(
        "font-sans relative inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent px-2.5 text-xs font-medium",
        styles[variant][tone],
        onRemove && "pr-1.5",
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex size-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none",
                variant === "solid" ? "bg-current" : dots[tone]
              )}
            />
          )}
          <span className={cn("relative size-1.5 rounded-full", variant === "solid" ? "bg-current" : dots[tone])} />
        </span>
      )}

      {roll ? (
        <span className="relative inline-flex overflow-hidden py-px">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={String(children)}
              initial={{ y: "70%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-70%", opacity: 0 }}
              transition={spring}
              className="inline-block tabular-nums"
            >
              {children}
            </motion.span>
          </AnimatePresence>
        </span>
      ) : (
        children
      )}

      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          tabIndex={removeFocusable ? undefined : -1}
          onClick={onRemove}
          // ioiti-ui: no ring of its own (the global one), and a target of 24 px around its 16.
          className="relative grid size-4 cursor-pointer place-items-center rounded-full opacity-60 transition after:absolute after:-inset-1 after:content-[''] hover:bg-current/10 hover:opacity-100"
        >
          <X className="size-3" />
        </button>
      )}
    </motion.span>
  );
}
