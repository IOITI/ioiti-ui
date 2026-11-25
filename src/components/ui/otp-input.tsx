'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
// ioiti-ui: held by its caller or by itself, as every control (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
import { fieldBorder, invalidOf } from '../../lib/field-border.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { DISABLED } from '../../lib/recipes.js';
import { cn } from '../../lib/utils.js';
// ioiti-ui: its names in the provider's language (`field`).
import { useMessages } from '../locale-context.js';
// ioiti-ui: what a Field or a FormItem around it tells it (its id, its label, what describes it, whether it is wrong),
// its `data-*` attributes and its ref, as a native field takes them.
import { dataAttributes, type DataAttributes } from '../../lib/data-attributes.js';
import { assignRef } from '../../lib/refs.js';
import { useFieldControl } from '../field-context.js';

// ioiti-ui: its `data-*` attributes on its outermost element (the group), as an element takes them.
export interface OTPInputProps extends DataAttributes {
  length?: number;
  value?: string;
  /** ioiti-ui: the code it starts with, the boxes holding it then (`value` held by the page instead). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  /** ioiti-ui: the code is wrong or incomplete: every box's border in the error's colour, and said (`aria-invalid`). */
  error?: boolean;
  className?: string;
  boxClassName?: string;
  /** ioiti-ui: the group's name; a Field's label, else the provider's language's by default ("One-time passcode"). */
  'aria-label'?: string;
  /** ioiti-ui: the id of what names the group: a heading. A Field's label names it without it. */
  'aria-labelledby'?: string;
  /** ioiti-ui: read out with it: what a Field around it says under it (its description, its error). */
  'aria-describedby'?: string;
  /** ioiti-ui: marked invalid, as a Field with an error marks it: drawn as `error`. */
  'aria-invalid'?: boolean | 'true' | 'false';
  /** ioiti-ui: the id of the first box, so that a `<label htmlFor>` leads to it; in a FormItem, the item's. */
  id?: string;
  /** ioiti-ui: the name its code is sent under with a form (a hidden input): its digits, as `onChange` gives them. */
  name?: string;
  /** ioiti-ui: its first box, where the code is typed, to focus it. */
  ref?: React.Ref<HTMLInputElement>;
}

const DIGIT_REGEX = /^[0-9]$/;

/** ioiti-ui: a code's digits, a box each. */
const digitsOf = (code: string, length: number) => Array.from({ length }, (_, i) => code[i] ?? '');

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  autoFocus = false,
  disabled = false,
  error = false,
  className,
  boxClassName,
  'aria-label': givenAriaLabel,
  'aria-labelledby': givenLabelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  id,
  name,
  ref,
  ...rest
}) => {
  // ioiti-ui: its name and its boxes' in the provider's language, the name given over it.
  const words = useMessages().field;
  // ioiti-ui: named (the group), described and marked by a Field or a FormItem around it too, its own props first; its
  // first box takes their id.
  const control = useFieldControl({
    id,
    labelledBy: givenLabelledBy,
    named: Boolean(givenAriaLabel),
    describedBy,
    invalid: invalidOf(error, ariaInvalid),
  });
  const ariaLabel = givenAriaLabel ?? (control.labelledBy ? undefined : words.otpName);
  // ioiti-ui: in error by its own prop, or marked invalid (a Field around it).
  const invalid = control.invalid;
  // ioiti-ui: held by the page (`value`, each box a digit of it) or by the boxes (from `defaultValue`), as every control
  // (useControllableState): the page told of the code, and once it is whole, either way. Held by the boxes, a box
  // emptied keeps its place.
  const [digits, setDigits] = useControllableState<string[]>(
    value === undefined ? undefined : digitsOf(value, length),
    digitsOf(defaultValue, length),
    (next) => {
      const joined = next.join('');
      onChange?.(joined);
      if (joined.length === length && next.every(Boolean)) {
        onComplete?.(joined);
      }
    }
  );
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
  }, [autoFocus]);

  const setDigitAt = (index: number, char: string) => {
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setPoppedIndex(index);
  };

  // A code of several digits at once, from the first box on.
  const fill = (text: string) => {
    const pasted = text.replace(/\D/g, '').slice(0, length);
    if (!pasted) return false;

    const next = Array.from({ length }, (_, i) => pasted[i] ?? '');
    setDigits(next);
    setPoppedIndex(pasted.length - 1);

    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
    return true;
  };

  // Digits arriving together in one box, set from that box on.
  const spread = (index: number, text: string) => {
    const placed = text.slice(0, length - index);
    const next = [...digits];
    for (let i = 0; i < placed.length; i++) next[index + i] = placed[i];
    setDigits(next);
    setPoppedIndex(index + placed.length - 1);
    inputRefs.current[Math.min(index + placed.length, length - 1)]?.focus();
  };

  const handleChange = (index: number, raw: string) => {
    // ioiti-ui: several characters at once in a box, which the boxes no longer cut to
    // one: a whole code (the autofill of a password manager or of the phone) fills
    // the boxes as a paste does; a few digits (a keyboard's suggestion) go on from
    // this box; a digit typed beside the one the box holds replaces it.
    if (raw.length > 1) {
      const previous = digits[index] ?? '';
      const typed = (previous && raw.startsWith(previous) ? raw.slice(previous.length) : raw).replace(/\D/g, '');
      if (typed.length >= length) {
        fill(typed);
        return;
      }
      if (typed.length > 1) {
        spread(index, typed);
        return;
      }
      // Nothing but letters beside the digit: it stays.
      if (!typed) return;
      raw = typed;
    }
    const char = raw.slice(-1);
    if (char && !DIGIT_REGEX.test(char)) return;

    setDigitAt(index, char);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        setDigitAt(index, '');
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigitAt(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (fill(e.clipboardData.getData('text'))) e.preventDefault();
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      // ioiti-ui: named by what it points to, or by its Field's label; its `data-*` attributes.
      aria-labelledby={control.labelledBy}
      aria-describedby={control.describedBy}
      {...dataAttributes(rest)}
      className={cn('flex gap-2', className)}
    >
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
            // ioiti-ui: the first box given to its caller's ref too.
            if (i === 0) assignRef(ref, el);
          }}
          id={i === 0 ? control.id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          value={digits[i] ?? ''}
          disabled={disabled}
          aria-label={words.otpDigit({ index: i + 1, count: length })}
          aria-invalid={invalid || undefined}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          animate={poppedIndex === i ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          onAnimationComplete={() => {
            if (poppedIndex === i) setPoppedIndex(null);
          }}
          // ioiti-ui: a tween, since framer-motion 13 animates a spring between two
          // keyframes only (the third stopped the pop at 1.25, or threw in development); the design's quick curve.
          transition={motionTransitions.easeFast}
          className={cn(
            // ioiti-ui: the look of the form's Input (its border, its surface, its text, in both themes), where
            // EasyUI's boxes were grey with a violet focus: a code's boxes under a password field look like it.
            'h-12 w-10 rounded-lg border bg-surface text-foreground',
            // ioiti-ui: the Input's border, or the error's; the box in focus in the accent, where the theme has one.
            fieldBorder(invalid),
            'text-center text-lg font-medium transition-colors duration-150',
            'outline-none placeholder:text-text-subtle',
            DISABLED,
            boxClassName
          )}
        />
      ))}
      {/* ioiti-ui: the code, sent with the form around it under its `name`. */}
      {name && <input type="hidden" name={name} value={digits.join('')} disabled={disabled} />}
    </div>
  );
};