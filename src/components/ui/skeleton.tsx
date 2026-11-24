"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { cn } from "../../lib/utils.js";
// ioiti-ui: what loads is named in the provider's language (`status`).
import { useMessages } from "../locale-context.js";

export interface SkeletonProps extends React.ComponentProps<"div"> {}

/** A quiet block with a slow light sweep. Size it with className. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden rounded-md bg-muted", className)}
      {...props}
    >
      <motion.span
        // ioiti-ui: the sweep in the design's tokens (the surface's light, a hint of the text's in dark), its loop's own
        // time on the design's curve.
        className="absolute inset-0 bg-linear-to-r from-transparent via-surface/65 to-transparent dark:via-foreground/7"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ ...motionTransitions.easeSoft, duration: 1.6, repeat: Infinity, repeatDelay: 0.2 }}
      />
    </div>
  );
}

const WIDTHS = ["100%", "94%", "98%", "88%"];

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({
  lines = 3,
  className,
}: SkeletonTextProps) {
  return (
    <div aria-hidden className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className="h-3.5"
          style={{ width: i === lines - 1 && lines > 1 ? "62%" : WIDTHS[i % WIDTHS.length] }}
        />
      ))}
    </div>
  );
}

export interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

export function SkeletonAvatar({ size = 40, className }: SkeletonAvatarProps) {
  return <Skeleton className={cn("shrink-0 rounded-full", className)} style={{ width: size, height: size }} />;
}

export interface SkeletonRevealProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Swap a skeleton for real content. Content eases in (fade, rise, un-blur).
 * Make the skeleton roughly the same size as the content so nothing jumps.
 */
export function SkeletonReveal({
  loading,
  skeleton,
  children,
  className,
}: SkeletonRevealProps) {
  const words = useMessages().status;
  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div
            key="skeleton"
            role="status"
            aria-busy="true"
            aria-label={words.loadingName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={motionTransitions.easeSoft}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
