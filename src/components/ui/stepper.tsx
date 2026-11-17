"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotionConfig, type Variants } from "framer-motion";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { cn } from "../../lib/utils.js";

// ioiti-ui: the design's motion (motion-tokens), not curves of its own: the ring follows as an indicator, the line fills in.
const spring = motionTransitions.springSnappy;
const fill = motionTransitions.easeSoft;

export interface Step {
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  /** Zero-based index of the active step. */
  current: number;
  /** Makes completed steps clickable (jump back). */
  onStepChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Stepper({ steps, current, onStepChange, orientation = "horizontal", className }: StepperProps) {
  const uid = React.useId();
  const vertical = orientation === "vertical";
  const last = steps.length - 1;
  // ioiti-ui: the check drawn at once where motion is reduced (MotionConfig leaves a path's length as it is).
  const reduce = useReducedMotionConfig();

  // don't replay the check-draw for steps that are already done on first paint
  const ready = React.useRef(false);
  React.useEffect(() => {
    ready.current = true;
  }, []);

  return (
    <ol aria-label="Progress" className={cn(vertical ? "flex flex-col" : "flex w-full items-center", className)}>
      {steps.map((step, i) => {
        const state = i < current ? "complete" : i === current ? "current" : "upcoming";
        const clickable = !!onStepChange && state === "complete";

        const indicator = (
          <span
            className={cn(
              "relative grid size-7 shrink-0 place-items-center rounded-full border text-xs font-medium tabular-nums transition-colors duration-300",
              // ioiti-ui: steps done, the current one and the line between them in the accent, where the theme has one (accent:).
              state === "complete" &&
                "border-primary bg-primary text-primary-foreground accent:border-brand accent:bg-brand accent:text-brand-foreground",
              state === "current" && "border-foreground text-foreground accent:border-brand accent:text-brand-text",
              state === "upcoming" && "border-border text-muted-foreground"
            )}
          >
            {state === "current" && (
              <motion.span
                layoutId={`${uid}-ring`}
                transition={spring}
                className="absolute -inset-[5px] rounded-full border border-border-hover accent:border-brand/40"
              />
            )}
            {state === "complete" ? (
              <svg
                viewBox="0 0 24 24"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <motion.path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  initial={ready.current && !reduce ? { pathLength: 0 } : false}
                  animate={{ pathLength: 1 }}
                  transition={{ ...motionTransitions.easeSoft, delay: 0.08 }}
                />
              </svg>
            ) : (
              i + 1
            )}
          </span>
        );

        const label = (
          <span
            className={cn(
              "flex min-w-0 flex-col text-left",
              !vertical && state !== "current" && "hidden sm:flex"
            )}
          >
            <span
              className={cn(
                "truncate text-sm transition-colors duration-300",
                state === "upcoming" ? "text-muted-foreground" : "font-medium text-foreground"
              )}
            >
              {step.title}
              {state === "complete" && <span className="sr-only"> (completed)</span>}
            </span>
            {step.description && (
              <span className="truncate text-xs text-muted-foreground">{step.description}</span>
            )}
          </span>
        );

        const row = clickable ? (
          <button
            type="button"
            onClick={() => onStepChange!(i)}
            className={cn(
              // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
              "flex cursor-pointer gap-3 rounded-lg text-left outline-none",
              vertical ? "items-start" : "items-center"
            )}
          >
            {indicator}
            {label}
          </button>
        ) : (
          <div className={cn("flex gap-3", vertical ? "items-start" : "items-center")}>
            {indicator}
            {label}
          </div>
        );

        return (
          <li
            key={i}
            aria-current={state === "current" ? "step" : undefined}
            className={cn(
              vertical ? "relative pb-7 last:pb-0" : "flex items-center",
              !vertical && i < last && "flex-1"
            )}
          >
            {row}

            {i < last && (
              <span
                aria-hidden
                className={cn(
                  "overflow-hidden bg-border",
                  vertical ? "absolute bottom-1 left-[13.5px] top-[34px] w-px" : "relative mx-3 h-px flex-1"
                )}
              >
                <motion.span
                  initial={false}
                  animate={vertical ? { scaleY: i < current ? 1 : 0 } : { scaleX: i < current ? 1 : 0 }}
                  transition={fill}
                  className={cn(
                    "absolute inset-0 bg-primary accent:bg-brand",
                    vertical ? "origin-top" : "origin-left"
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ───────────── panels: slide in the direction you're travelling ───────────── */

const slide: Variants = {
  enter: (d: number) => ({ x: d * 24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  // ioiti-ui: it leaves quicker than the next arrives (easeExit).
  exit: (d: number) => ({ x: d * -24, opacity: 0, transition: motionTransitions.easeExit }),
};

export interface StepPanelsProps {
  current: number;
  /** One child per step, in order. */
  children: React.ReactNode;
  className?: string;
}

export function StepPanels({
  current,
  children,
  className,
}: StepPanelsProps) {
  const panels = React.Children.toArray(children);
  const prev = React.useRef(current);
  const dir = current >= prev.current ? 1 : -1;
  React.useEffect(() => {
    prev.current = current;
  }, [current]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={motionTransitions.easeSoft}
        >
          {panels[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
