'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { dataAttributes } from '../../lib/data-attributes.js';
import { assignRef } from '../../lib/refs.js';
import { useFieldControl } from '../field-context.js';
const DIGIT_REGEX = /^[0-9]$/;
/** ioiti-ui: a code's digits, a box each. */
const digitsOf = (code, length) => Array.from({ length }, (_, i) => code[i] ?? '');
export const OTPInput = ({ length = 6, value, defaultValue = '', onChange, onComplete, autoFocus = false, disabled = false, error = false, className, boxClassName, 'aria-label': givenAriaLabel, 'aria-labelledby': givenLabelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, id, name, ref, ...rest }) => {
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
    const [digits, setDigits] = useControllableState(value === undefined ? undefined : digitsOf(value, length), digitsOf(defaultValue, length), (next) => {
        const joined = next.join('');
        onChange?.(joined);
        if (joined.length === length && next.every(Boolean)) {
            onComplete?.(joined);
        }
    });
    const [poppedIndex, setPoppedIndex] = useState(null);
    const inputRefs = useRef([]);
    useEffect(() => {
        if (autoFocus)
            inputRefs.current[0]?.focus();
    }, [autoFocus]);
    const setDigitAt = (index, char) => {
        const next = [...digits];
        next[index] = char;
        setDigits(next);
        setPoppedIndex(index);
    };
    // A code of several digits at once, from the first box on.
    const fill = (text) => {
        const pasted = text.replace(/\D/g, '').slice(0, length);
        if (!pasted)
            return false;
        const next = Array.from({ length }, (_, i) => pasted[i] ?? '');
        setDigits(next);
        setPoppedIndex(pasted.length - 1);
        const focusIndex = Math.min(pasted.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
        return true;
    };
    // Digits arriving together in one box, set from that box on.
    const spread = (index, text) => {
        const placed = text.slice(0, length - index);
        const next = [...digits];
        for (let i = 0; i < placed.length; i++)
            next[index + i] = placed[i];
        setDigits(next);
        setPoppedIndex(index + placed.length - 1);
        inputRefs.current[Math.min(index + placed.length, length - 1)]?.focus();
    };
    const handleChange = (index, raw) => {
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
            if (!typed)
                return;
            raw = typed;
        }
        const char = raw.slice(-1);
        if (char && !DIGIT_REGEX.test(char))
            return;
        setDigitAt(index, char);
        if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (digits[index]) {
                setDigitAt(index, '');
            }
            else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
                setDigitAt(index - 1, '');
            }
        }
        else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }
        else if (e.key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handlePaste = (e) => {
        if (fill(e.clipboardData.getData('text')))
            e.preventDefault();
    };
    return (_jsxs("div", { role: "group", "aria-label": ariaLabel, "aria-labelledby": control.labelledBy, "aria-describedby": control.describedBy, ...dataAttributes(rest), className: cn('flex gap-2', className), children: [Array.from({ length }).map((_, i) => (_jsx(motion.input, { ref: (el) => {
                    inputRefs.current[i] = el;
                    // ioiti-ui: the first box given to its caller's ref too.
                    if (i === 0)
                        assignRef(ref, el);
                }, id: i === 0 ? control.id : undefined, type: "text", inputMode: "numeric", autoComplete: i === 0 ? 'one-time-code' : 'off', value: digits[i] ?? '', disabled: disabled, "aria-label": words.otpDigit({ index: i + 1, count: length }), "aria-invalid": invalid || undefined, onChange: (e) => handleChange(i, e.target.value), onKeyDown: (e) => handleKeyDown(i, e), onPaste: handlePaste, onFocus: (e) => e.target.select(), animate: poppedIndex === i ? { scale: [1, 1.25, 1] } : { scale: 1 }, onAnimationComplete: () => {
                    if (poppedIndex === i)
                        setPoppedIndex(null);
                }, 
                // ioiti-ui: a tween, since framer-motion 13 animates a spring between two
                // keyframes only (the third stopped the pop at 1.25, or threw in development); the design's quick curve.
                transition: motionTransitions.easeFast, className: cn(
                // ioiti-ui: the look of the form's Input (its border, its surface, its text, in both themes), where
                // EasyUI's boxes were grey with a violet focus: a code's boxes under a password field look like it.
                'h-12 w-10 rounded-lg border bg-surface text-foreground', 
                // ioiti-ui: the Input's border, or the error's; the box in focus in the accent, where the theme has one.
                fieldBorder(invalid), 'text-center text-lg font-medium transition-colors duration-150', 'outline-none placeholder:text-text-subtle', DISABLED, boxClassName) }, i))), name && _jsx("input", { type: "hidden", name: name, value: digits.join(''), disabled: disabled })] }));
};
