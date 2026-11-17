'use client';

import React, { useId, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';

export interface StretchSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  className?: string;
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
}) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const id = useId();
  const isControlled = checked !== undefined;
  const current = isControlled ? checked : isOn;

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
    const next = !current;
    if (!isControlled) setIsOn(next);
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {(label || description) && (
        <div
          className={cn('text-left cursor-pointer', disabled && 'cursor-not-allowed')}
          onClick={handleToggle}
        >
          {label && (
            <div id={`${id}-label`} className="text-sm font-medium text-foreground leading-tight">{label}</div>
          )}
          {description && (
            <div id={`${id}-description`} className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {description}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={current}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={description ? `${id}-description` : undefined}
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
          disabled && 'cursor-not-allowed'
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
    </div>
  );
};
