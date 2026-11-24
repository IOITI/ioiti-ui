'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useTransform, animate, useReducedMotionConfig } from 'framer-motion';
import { ChevronRight, Check, Trash2, Lock, Unlock, Archive, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { TONE_LINE, TONE_SOFT, TONE_SOLID, TONE_TEXT } from '../../lib/recipes.js';
// ioiti-ui: its tone, the package's word for a status (StatusTone, docs/conventions.md); its former `variant` said once
// in development.
import { deprecated } from '../../lib/deprecated.js';
// ioiti-ui: its words in the provider's language, its percentage in its locale.
import { useFormat, useMessages } from '../locale-context.js';
const SIZE_CONFIG = {
    sm: {
        trackHeight: 'h-10',
        padding: 'p-1',
        thumbSize: 32,
        thumbClass: 'size-8',
        offset: 40,
        text: 'text-xs',
        iconSize: 'size-3.5',
    },
    md: {
        trackHeight: 'h-12',
        padding: 'p-1',
        thumbSize: 40,
        thumbClass: 'size-10',
        offset: 48,
        text: 'text-sm',
        iconSize: 'size-4',
    },
    // ioiti-ui: the large thumb 48px, a step of the controls' heights (EasyUI's was 44px in a padding of 6px).
    lg: {
        trackHeight: 'h-14',
        padding: 'p-1',
        thumbSize: 48,
        thumbClass: 'size-12',
        offset: 56,
        text: 'text-base',
        iconSize: 'size-4.5',
    },
};
export const DragToConfirm = ({ label: givenLabel, confirmedLabel: givenConfirmedLabel, actionType = 'confirm', 
// ioiti-ui: its tone, and its former variant (read below).
tone: givenTone, variant, size = 'md', icon, confirmedIcon, isConfirmed: controlledConfirmed, onConfirm, onReset, autoResetDelay = 2500, disabled = false, haptic = true, className, }) => {
    // ioiti-ui: its words in the provider's language, the ones given over them.
    const words = useMessages().dialog;
    const label = givenLabel ?? words.slideToConfirm;
    const confirmedLabel = givenConfirmedLabel ?? words.confirmed;
    const [internalConfirmed, setInternalConfirmed] = useState(false);
    const isConfirmed = controlledConfirmed !== undefined ? controlledConfirmed : internalConfirmed;
    const trackRef = useRef(null);
    const thumbRef = useRef(null);
    const [dragMax, setDragMax] = useState(200);
    const resetTimerRef = useRef(null);
    const shouldReduceMotion = useReducedMotionConfig();
    // ioiti-ui: its percentage as the provider's locale writes one ("40%"; "40 %" in French).
    const { formatPercent } = useFormat();
    const x = useMotionValue(0);
    const currentSize = SIZE_CONFIG[size] || SIZE_CONFIG.md;
    // Resolve active theme tone archetype
    // ioiti-ui: a StatusTone, the one given, else the former `variant` (`default` read as `neutral`; said once in
    // development), else the action's.
    if (variant !== undefined)
        deprecated('drag-to-confirm-variant', 'DragToConfirm');
    const resolvedTone = givenTone ?? (variant === 'default' ? 'neutral' : variant) ?? (actionType === 'delete' ? 'danger' :
        actionType === 'unlock' ? 'warning' :
            actionType === 'submit' ? 'info' :
                'neutral');
    const calculateMaxDrag = useCallback(() => {
        if (trackRef.current) {
            const trackWidth = trackRef.current.offsetWidth;
            setDragMax(Math.max(40, trackWidth - currentSize.offset));
        }
    }, [currentSize.offset]);
    useEffect(() => {
        calculateMaxDrag();
        window.addEventListener('resize', calculateMaxDrag);
        return () => window.removeEventListener('resize', calculateMaxDrag);
    }, [calculateMaxDrag]);
    // Sync position with controlled isConfirmed changes
    useEffect(() => {
        if (controlledConfirmed !== undefined) {
            if (controlledConfirmed) {
                animate(x, dragMax, shouldReduceMotion ? { duration: 0 } : motionTransitions.springSnappy);
            }
            else {
                animate(x, 0, shouldReduceMotion ? { duration: 0 } : motionTransitions.springResponsive);
            }
        }
    }, [controlledConfirmed, dragMax, shouldReduceMotion, x]);
    // Cleanup autoReset timer on unmount
    useEffect(() => {
        return () => {
            if (resetTimerRef.current)
                clearTimeout(resetTimerRef.current);
        };
    }, []);
    // Text smoothly fades and nudges forward as user drags handle
    const textOpacity = useTransform(x, [0, dragMax * 0.55], [1, 0]);
    const textTranslateX = useTransform(x, [0, dragMax * 0.55], [0, 8]);
    // Progressive fill width right behind the draggable handle
    const progressFillWidth = useTransform(x, (val) => `${Math.min(dragMax + currentSize.thumbSize + 4, val + currentSize.thumbSize + 4)}px`);
    // ioiti-ui: how far the thumb is, in tenths of its track (all of it once confirmed), and in words: the confirmed
    // state's once confirmed. Said as the thumb moves, written on the slider without a render at every frame: it was
    // read once per render, and stood still through a drag.
    const valueAt = (at) => isConfirmed ? 100 : Math.min(100, Math.max(0, Math.round((at / (dragMax || 1)) * 10) * 10));
    const valueText = (value) => (isConfirmed ? confirmedLabel : formatPercent(value, false, 0));
    useMotionValueEvent(x, 'change', (at) => {
        const thumb = thumbRef.current;
        const value = valueAt(at);
        if (!thumb || thumb.getAttribute('aria-valuenow') === String(value))
            return;
        thumb.setAttribute('aria-valuenow', String(value));
        thumb.setAttribute('aria-valuetext', valueText(value));
    });
    const triggerHaptic = useCallback(() => {
        if (haptic && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(22);
            }
            catch {
                // Ignored if device policy denies vibration
            }
        }
    }, [haptic]);
    const confirmAction = useCallback(() => {
        triggerHaptic();
        animate(x, dragMax, shouldReduceMotion ? { duration: 0 } : motionTransitions.springSnappy);
        if (controlledConfirmed === undefined) {
            setInternalConfirmed(true);
        }
        onConfirm?.();
        if (autoResetDelay > 0) {
            if (resetTimerRef.current)
                clearTimeout(resetTimerRef.current);
            resetTimerRef.current = setTimeout(() => {
                if (controlledConfirmed === undefined) {
                    setInternalConfirmed(false);
                }
                animate(x, 0, shouldReduceMotion ? { duration: 0 } : motionTransitions.springResponsive);
                onReset?.();
            }, autoResetDelay);
        }
    }, [
        autoResetDelay,
        controlledConfirmed,
        dragMax,
        onConfirm,
        onReset,
        shouldReduceMotion,
        triggerHaptic,
        x,
    ]);
    const handleDragEnd = () => {
        const currentX = x.get();
        if (currentX >= dragMax * 0.85 && !isConfirmed) {
            confirmAction();
        }
        else {
            // Revert handle back to start with elastic return
            animate(x, 0, shouldReduceMotion ? { duration: 0 } : motionTransitions.springResponsive);
        }
    };
    const handleKeyboardConfirm = () => {
        if (disabled || isConfirmed)
            return;
        confirmAction();
    };
    // Archetype color profiles tailored for balanced light & dark appearance.
    // ioiti-ui: the design's tones (recipes.ts): danger the negative, warning and info their own, success the positive;
    // neutral, a neutral fill on its way and the positive once done.
    const toneOf = (each, iconColor) => ({
        fill: cn(TONE_SOFT[each], 'border-r', TONE_LINE[each]),
        confirmedTrack: cn(TONE_SOFT[each], TONE_LINE[each]),
        confirmedHandle: cn(TONE_SOLID[each], 'shadow-subtle'),
        confirmedText: cn(TONE_TEXT[each], 'font-semibold'),
        iconColor,
    });
    const getToneClasses = () => {
        switch (resolvedTone) {
            case 'danger':
                return toneOf('negative', TONE_TEXT.negative);
            case 'warning':
                return toneOf('warning', TONE_TEXT.warning);
            case 'info':
                return toneOf('info', TONE_TEXT.info);
            // ioiti-ui: success in the positive tone on its way too, its fill and its icon (EasyUI's drew it as the default).
            case 'success':
                return toneOf('positive', TONE_TEXT.positive);
            default:
                return { ...toneOf('positive', 'text-text-secondary'), fill: 'bg-border border-r border-border-hover' };
        }
    };
    const tone = getToneClasses();
    const getActionIcon = () => {
        switch (actionType) {
            case 'delete':
                return _jsx(Trash2, { className: cn(currentSize.iconSize, tone.iconColor) });
            case 'unlock':
                return isConfirmed ? (_jsx(Unlock, { className: cn(currentSize.iconSize) })) : (_jsx(Lock, { className: cn(currentSize.iconSize, tone.iconColor) }));
            case 'archive':
                return _jsx(Archive, { className: cn(currentSize.iconSize, tone.iconColor) });
            case 'submit':
                return _jsx(ArrowRight, { className: cn(currentSize.iconSize, tone.iconColor) });
            default:
                return _jsx(ChevronRight, { className: cn(currentSize.iconSize, tone.iconColor) });
        }
    };
    return (_jsxs("div", { className: cn('w-full max-w-sm select-none font-sans', className), children: [_jsxs("div", { ref: trackRef, className: cn('relative rounded-full border flex items-center overflow-hidden transition-colors duration-200', currentSize.trackHeight, currentSize.padding, isConfirmed ? tone.confirmedTrack : 'bg-surface-raised border-border', disabled && 'opacity-50 cursor-not-allowed'), children: [_jsx(motion.div, { style: {
                            width: isConfirmed ? '100%' : progressFillWidth,
                        }, className: cn('absolute left-0 top-0 bottom-0 rounded-full pointer-events-none z-0 transition-colors duration-200', tone.fill) }), _jsx(motion.div, { style: { opacity: isConfirmed ? 0 : textOpacity, x: textTranslateX }, className: cn('absolute inset-0 flex items-center justify-center pointer-events-none font-medium tracking-tight z-10 text-muted-foreground select-none', currentSize.text), children: label }), isConfirmed && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, transition: motionTransitions.springSnappy, className: cn('absolute inset-0 flex items-center justify-center pointer-events-none tracking-tight z-10 select-none', currentSize.text, tone.confirmedText), children: confirmedLabel })), _jsx(motion.div, { drag: disabled || isConfirmed ? false : 'x', dragConstraints: { left: 0, right: dragMax }, dragElastic: 0.06, dragMomentum: false, style: { x }, onDragEnd: handleDragEnd, whileDrag: { scale: 1.04 }, whileTap: disabled || isConfirmed ? undefined : { scale: 0.97 }, transition: motionTransitions.springSnappy, className: cn(currentSize.thumbClass, 
                        // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                        'rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20 relative select-none touch-none transition-[background-color,border-color,box-shadow]', isConfirmed
                            ? tone.confirmedHandle
                            : 'bg-surface border border-border text-text-secondary shadow-subtle hover:border-border-hover', 
                        // ioiti-ui: half its strength with the track (50%), not a second time.
                        disabled && 'cursor-not-allowed'), ref: thumbRef, tabIndex: disabled ? -1 : 0, role: "slider", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": valueAt(x.get()), "aria-valuetext": valueText(valueAt(x.get())), "aria-disabled": disabled || undefined, onKeyDown: (e) => {
                            // ioiti-ui: not ArrowRight, which on a slider means "a little further", not "all the way".
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleKeyboardConfirm();
                            }
                        }, children: isConfirmed ? (_jsx(motion.div, { initial: { scale: 0, rotate: -20 }, animate: { scale: 1, rotate: 0 }, transition: motionTransitions.springSnappy, children: confirmedIcon ?? _jsx(Check, { className: currentSize.iconSize }) })) : (icon ?? getActionIcon()) })] }), _jsx("div", { className: "sr-only", children: _jsx("button", { 
                    // ioiti-ui: for a screen reader's own navigation only. In the Tab order it was a
                    // stop nobody could see, on which Enter confirmed the action.
                    tabIndex: -1, type: "button", onClick: handleKeyboardConfirm, disabled: disabled || isConfirmed, children: label }) })] }));
};
