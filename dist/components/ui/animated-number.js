'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { motion, useReducedMotionConfig, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils.js';
// ioiti-ui: the interface's locale, which the number is written in.
import { useLocale } from '../locale-context.js';
// ioiti-ui: each character, digit or not, in a box of one line's height, so that they all share one baseline with the
// text around them: the box is clipped by clip-path, which leaves the baseline where it is (EasyUI's overflow
// hidden moved it to the bottom of the box, and its digits stood higher than a sign or a % beside them).
const BOX = 'inline-flex h-[1.15em] leading-[1.15em] [clip-path:inset(0)]';
// Single Digit Rolling Column
const DigitColumn = ({ digit, stiffness, damping, mass }) => {
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
        return _jsx("span", { className: BOX, children: digit });
    }
    // ioiti-ui: as wide as its digits (tabular figures of the design's font, not EasyUI's monospace at 0.58em); as tall as
    // its ten digits (`self-start`: stretched to the box, one digit tall, a roll of 10 % moved it by a tenth of one).
    return (_jsx("span", { className: BOX, children: _jsx(motion.span, { style: { y }, className: "flex flex-col self-start", children: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (_jsx("span", { className: "h-[1.15em]", children: n }, n))) }) }));
};
export const AnimatedNumber = ({ value, decimals = 0, prefix = '', suffix = '', text, stiffness = 170, damping = 22, mass = 0.6, useGrouping = true, compact = false, className, }) => {
    const reduce = useReducedMotionConfig();
    // ioiti-ui: written in the interface's locale (IoitiProvider's), in Latin digits whatever it writes: only they roll.
    const { locale } = useLocale();
    const formatNumber = (val) => {
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
        return _jsx("span", { className: cn('tabular-nums', className), children: label });
    }
    // ioiti-ui: read as the value it shows (an aria-label on a span is not), its rolling digits hidden from screen
    // readers; colours inherited (EasyUI's text was white whatever the theme). Positioned, so that the text read
    // (sr-only) stays with it: in a table's frame that scrolls, it stood out of the frame, beyond the page.
    return (_jsxs("span", { className: cn('relative inline-flex items-baseline tabular-nums', className), children: [_jsx("span", { className: "sr-only", children: label }), _jsxs("span", { "aria-hidden": "true", className: "inline-flex items-baseline select-none", children: [!text && prefix && _jsx("span", { className: "mr-0.5", children: prefix }), chars.map((char, index) => (_jsx(DigitColumn, { digit: char, stiffness: stiffness, damping: damping, mass: mass }, `${index}-${/\d/.test(char) ? 'num' : char}`))), !text && suffix && _jsx("span", { className: "ml-0.5", children: suffix })] })] }));
};
