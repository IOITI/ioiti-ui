'use client';

import React, { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';

export interface DrawCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  /** Indeterminate visual state */
  indeterminate?: boolean;
}

/**
 * DrawCheckbox — The checkmark draws itself (path length animation) and
 * settles with a tiny overshoot. The box also springs from 0.9 -> 1.02 -> 1.0
 * for a tactile "snap" feel.
 */
export const DrawCheckbox = forwardRef<HTMLInputElement, DrawCheckboxProps>(
  (
    {
      className,
      label,
      description,
      checked,
      defaultChecked,
      disabled,
      indeterminate = false,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [isChecked, setIsChecked] = useState(defaultChecked || false);
    // ioiti-ui: drawn at once, without the pop, where motion is reduced.
    const reduceMotion = useReducedMotion() ?? false;

    const isControlled = checked !== undefined;
    const currentChecked = isControlled ? checked : isChecked;
    const showCheck = currentChecked || indeterminate;

    // ioiti-ui: the input itself is indeterminate too, which screen readers say ("mixed"):
    // EasyUI drew the bar only.
    const inputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);
    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setIsChecked(e.target.checked);
      onChange?.(e);
    };

    return (
      <div
        className={cn(
          'flex items-start gap-2.5 select-none',
          disabled && 'opacity-30 cursor-not-allowed',
          className
        )}
      >
        {/* ioiti-ui: level with the first line of its label; alone (a table's cell), nothing above it. */}
        <div className={cn('relative flex items-center justify-center', (label || description) && 'mt-0.5')}>
          {/* ioiti-ui: the input lies over the box, transparent, and takes its clicks and the focus
              ring of the design. EasyUI's was `sr-only`, which clipped the ring, and the box passed
              its clicks on, which reached a table row's own handler as a click on the row. */}
          <input
            ref={setRefs}
            id={inputId}
            type="checkbox"
            checked={currentChecked}
            disabled={disabled}
            onChange={handleChange}
            // ioiti-ui: named by its label and described by its description, as `stretch-switch`: the
            // <label> holds both, which made one name of them.
            aria-labelledby={label ? `${inputId}-label` : undefined}
            aria-describedby={description ? `${inputId}-description` : undefined}
            className="peer absolute inset-0 m-0 appearance-none rounded-[4px] bg-transparent cursor-pointer disabled:cursor-not-allowed"
            {...props}
          />

          {/* Box: a tiny "pop" via scale 0.9 -> 1.04 -> 1.0 when checked */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{
              scale: showCheck && !reduceMotion ? [0.9, 1.04, 1] : 1,
            }}
            transition={{
              // Use a keyframed spring-like array for the "settle" overshoot.
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            // ioiti-ui: the colours are classes, EasyUI's tokens (both themes) and then the accent's,
            // under a theme that has one (accent:), as the radio and the switch; framer animated them
            // as inline styles, which no class outranks.
            className={cn(
              'w-4 h-4 rounded-[4px] border flex items-center justify-center pointer-events-none transition-colors duration-300',
              showCheck
                ? 'bg-accent border-accent accent:bg-brand accent:border-brand'
                : 'bg-surface-raised border-border'
            )}
          >
            {/* Path-draw checkmark with overshoot on stroke-dashoffset */}
            {currentChecked && !indeterminate && (
              <motion.svg
                viewBox="0 0 16 16"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black dark:text-white stroke-black dark:stroke-white accent:text-brand-foreground accent:stroke-brand-foreground"
                initial={reduceMotion ? false : { pathLength: 0, scale: 0.6, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  scale: [0.6, 1.18, 1], // tiny overshoot
                  opacity: 1,
                }}
                transition={{
                  pathLength: { duration: 0.28, ease: [0.65, 0, 0.35, 1] },
                  scale: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.12 },
                }}
              >
                <motion.path
                  d="M3.5 8.5 L6.5 11.5 L12.5 5"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.65, 0, 0.35, 1],
                  }}
                />
              </motion.svg>
            )}

            {/* Indeterminate: a centered bar that draws from left to right */}
            {indeterminate && (
              <motion.div
                initial={reduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={motionTransitions.springSnappy}
                style={{ transformOrigin: 'left center' }}
                className="w-2.5 h-[2px] rounded-full bg-black dark:bg-white accent:bg-brand-foreground"
              />
            )}
          </motion.div>
        </div>

        {(label || description) && (
          <label
            htmlFor={inputId}
            className={cn('cursor-pointer text-left', disabled && 'cursor-not-allowed')}
          >
            {label && (
              <div id={`${inputId}-label`} className="text-xs font-medium text-[var(--text-primary)] leading-tight">
                {label}
              </div>
            )}
            {description && (
              // ioiti-ui: the form's hints, 12 px in text-muted-foreground (--text-muted is under 4.5:1 on the dark surface).
              <div id={`${inputId}-description`} className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {description}
              </div>
            )}
          </label>
        )}
      </div>
    );
  }
);

DrawCheckbox.displayName = 'DrawCheckbox';
