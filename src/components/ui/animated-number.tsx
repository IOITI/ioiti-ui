'use client';

import React, { useEffect } from 'react';
import { motion, useReducedMotionConfig, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils.js';
// ioiti-ui: the interface's locale, which the number is written in.
import { useLocale } from '../locale-context.js';

export interface AnimatedNumberProps {
  /** Numeric value to animate to */
  value: number;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Prepend text or currency symbol (e.g. "$", "+") */
  prefix?: string;
  /** Append text (e.g. "%", " users", "ms") */
  suffix?: string;
  /** ioiti-ui: the value as written (the application's formats: sign, currency and %), in place of the formatting below: its
   * digits roll, the rest stays. */
  text?: string;
  /** Spring physics stiffness */
  stiffness?: number;
  /** Spring physics damping */
  damping?: number;
  /** Mass of spring */
  mass?: number;
  /** Format as locale string (e.g. "1,250") */
  useGrouping?: boolean;
  /** Compact notation (ioiti-ui: as the interface's locale writes it, e.g. 1.2m, 45k in British English) */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

// ioiti-ui: each character, digit or not, in a box of one line's height, so that they all share one baseline with the
// text around them: the box is clipped by clip-path, which leaves the baseline where it is (EasyUI's overflow
// hidden moved it to the bottom of the box, and its digits stood higher than a sign or a % beside them).
const BOX = 'inline-flex h-[1.15em] leading-[1.15em] [clip-path:inset(0)]';

// Single Digit Rolling Column
const DigitColumn: React.FC<{
  digit: string;
  stiffness?: number;
  damping?: number;
  mass?: number;
}> = ({ digit, stiffness, damping, mass }) => {
  const isNumber = !isNaN(parseInt(digit, 10));
  const numValue = isNumber ? parseInt(digit, 10) : 0;

  const spring = useSpring(numValue, {
    stiffness,
    damping,
    mass,
  });

  const y = useTransform(spring, (current) => `-${current * 10}%`);

  useEffect(() => {
    spring.set(numValue);
  }, [spring, numValue]);

  if (!isNumber) {
    return <span className={BOX}>{digit}</span>;
  }

  // ioiti-ui: as wide as its digits (tabular figures of the design's font, not EasyUI's monospace at 0.58em); as tall as
  // its ten digits (`self-start`: stretched to the box, one digit tall, a roll of 10 % moved it by a tenth of one).
  return (
    <span className={BOX}>
      <motion.span style={{ y }} className="flex flex-col self-start">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1.15em]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  text,
  stiffness = 170,
  damping = 22,
  mass = 0.6,
  useGrouping = true,
  compact = false,
  className,
}) => {
  const reduce = useReducedMotionConfig();
  // ioiti-ui: written in the interface's locale (IoitiProvider's), in Latin digits whatever it writes: only they roll.
  const { locale } = useLocale();
  const formatNumber = (val: number): string => {
    if (compact) {
      const formatter = new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
        numberingSystem: 'latn',
      });
      return formatter.format(val);
    }

    // ioiti-ui: the locale's separators (Intl's), where EasyUI wrote a comma every three digits and a point. Rounded by
    // toFixed as before, which Intl would not do alike (it rounds 29.65 up); a true minus, as the package's formats
    // write it, where the locale puts its sign.
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping,
      numberingSystem: 'latn',
    })
      .formatToParts(Number(val.toFixed(decimals)))
      .map((part) => (part.type === 'minusSign' ? '−' : part.value))
      .join('');
  };

  const formattedStr = text ?? formatNumber(value);
  const chars = formattedStr.split('');
  const label = text ?? `${prefix}${formattedStr}${suffix}`;

  // ioiti-ui: still where motion is reduced: the value as text.
  if (reduce) {
    return <span className={cn('tabular-nums', className)}>{label}</span>;
  }

  // ioiti-ui: read as the value it shows (an aria-label on a span is not), its rolling digits hidden from screen
  // readers; colours inherited (EasyUI's text was white whatever the theme). Positioned, so that the text read
  // (sr-only) stays with it: in a table's frame that scrolls, it stood out of the frame, beyond the page.
  return (
    <span className={cn('relative inline-flex items-baseline tabular-nums', className)}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="inline-flex items-baseline select-none">
        {!text && prefix && <span className="mr-0.5">{prefix}</span>}
        {chars.map((char, index) => (
          <DigitColumn
            key={`${index}-${/\d/.test(char) ? 'num' : char}`}
            digit={char}
            stiffness={stiffness}
            damping={damping}
            mass={mass}
          />
        ))}
        {!text && suffix && <span className="ml-0.5">{suffix}</span>}
      </span>
    </span>
  );
};
