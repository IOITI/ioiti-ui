'use client';

import React, { useId, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
// ioiti-ui: held by its caller or by itself, as every control (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
// ioiti-ui: what a Field or a FormItem around it tells it (its id, what describes it, whether it is wrong).
import { invalidOf } from '../../lib/field-border.js';
import { joinIds, useFieldControl } from '../field-context.js';

export interface StretchSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  className?: string;
  /** ioiti-ui: the switch's id, for a `<label htmlFor>` elsewhere; in a FormItem, the item's, which its FormLabel names. */
  id?: string;
  /** ioiti-ui: the name it is sent under with its form while on, as a checkbox is; nothing is sent while off. */
  name?: string;
  /** ioiti-ui: what it sends under its `name` while on. */
  value?: string;
  /** ioiti-ui: it must be on (`aria-required`): the page checks it, and says so. */
  required?: boolean;
  /** ioiti-ui: its name, where no label names it (its own, a Field's, a FormLabel). */
  'aria-label'?: string;
  /** ioiti-ui: the id of what names it: a heading, a label elsewhere. */
  'aria-labelledby'?: string;
  /** ioiti-ui: the ids of what is read out with it, after its description; a Field or a FormItem around it adds its own. */
  'aria-describedby'?: string;
  /** ioiti-ui: marked invalid, as a Field or a FormItem in error marks it. */
  'aria-invalid'?: boolean | 'true' | 'false';
  /** ioiti-ui: the switch itself (its button), to focus it. */
  ref?: React.Ref<HTMLButtonElement>;
}

const TRACK_WIDTH = 36; // px (w-9)
const THUMB_SIZE = 14; // px (h-3.5 w-3.5)
const TRACK_PADDING = 2; // px-0.5
// ioiti-ui: the track's 1 px border is inside its 36 px (border-box): left out, the thumb went 2 px too far when on,
// against the track's edge, where off it stood 3 px from it.
const TRACK_BORDER = 1;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - (TRACK_PADDING + TRACK_BORDER) * 2;

/**
 * StretchSwitch — Thumb stretches slightly while dragging/pressing,
 * then snaps naturally to its destination.
 *
 * Implementation: while pressing, the thumb is allowed to grow horizontally
 * (scaleX > 1) and slightly vertically (scaleY < 1) so it looks "stretched".
 * On release, the spring (springSnappy) handles the snap to the new x.
 *
 * ioiti-ui: the switch is named by its label and described by its description, so
 * that a screen reader says which setting it is and not only "switch, on".
 */
export const StretchSwitch: React.FC<StretchSwitchProps> = ({
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  label,
  description,
  className,
  id: givenId,
  name,
  value = 'on',
  required,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ref,
}) => {
  const [current, setCurrent] = useControllableState(checked, defaultChecked, onChange);
  const id = useId();
  // ioiti-ui: named and described from outside too (`aria-*`, a Field or a FormItem around it), its id from a
  // FormItem, whose FormLabel then names it; it could take none of them.
  const control = useFieldControl({
    id: givenId,
    describedBy: joinIds(description ? `${id}-description` : null, describedBy),
    invalid: invalidOf(undefined, ariaInvalid),
  });

  const x = useMotionValue(current ? TRAVEL : 0);
  const [isPressed, setIsPressed] = useState(false);

  // Animate to the new x whenever current changes
  React.useEffect(() => {
    animate(x, current ? TRAVEL : 0, motionTransitions.springSnappy);
  }, [current, x]);

  // Stretch the thumb: while pressed, scaleX -> 1.18, scaleY -> 0.86 — looks stretched.
  const scaleX = useTransform(x, () => (isPressed ? 1.18 : 1));
  const scaleY = useTransform(x, () => (isPressed ? 0.86 : 1));

  const handleToggle = () => {
    if (disabled) return;
    setCurrent(!current);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 select-none',
        // ioiti-ui: disabled, its label and its control at half strength, its description whole: it says why (it was 2:1).
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      {(label || description) && (
        <div
          className={cn('text-left cursor-pointer', disabled && 'cursor-not-allowed')}
          onClick={(event) => {
            // ioiti-ui: a label around the switch (a Field's) would pass this click on to it, turning it back.
            event.preventDefault();
            handleToggle();
          }}
        >
          {label && (
            <div id={`${id}-label`} className={cn('text-sm font-medium text-foreground leading-tight', disabled && 'opacity-50')}>{label}</div>
          )}
          {description && (
            <div id={`${id}-description`} className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      )}

      <button
        ref={ref}
        id={control.id}
        type="button"
        role="switch"
        aria-checked={current}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy ?? (label && !ariaLabel ? `${id}-label` : undefined)}
        aria-describedby={control.describedBy}
        aria-invalid={control.invalid || undefined}
        aria-required={required || undefined}
        disabled={disabled}
        onPointerDown={() => !disabled && setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerCancel={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus-ring',
          current
            ? // ioiti-ui: on, in the accent under a theme that has one (accent:), its thumb on it.
              'bg-primary border-primary accent:bg-brand accent:border-brand'
            : 'bg-surface-raised border-border',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        style={{ paddingInline: TRACK_PADDING }}
      >
        <motion.span
          style={{ x, scaleX, scaleY, width: THUMB_SIZE, height: THUMB_SIZE }}
          className={cn(
            'pointer-events-none block my-auto rounded-full shadow-subtle origin-center',
            current ? 'bg-primary-foreground accent:bg-brand-foreground' : 'bg-muted-foreground'
          )}
        />
      </button>
      {/* ioiti-ui: sent with its form while on, as a checkbox is: a hidden input, which a label around the switch (a
          Field's) cannot take for its control, as it would a checkbox. */}
      {name && current ? <input type="hidden" name={name} value={value} disabled={disabled} /> : null}
    </div>
  );
};
