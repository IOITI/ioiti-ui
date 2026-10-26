'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils.js';
export const Loader = ({ size = 32, variant = 'arc', label = 'Loading...', reduceMotion = false, color = 'currentColor', className, ...props }) => {
    return (_jsxs("div", { role: "status", "aria-busy": "true", "aria-label": label, className: cn('inline-flex flex-col items-center justify-center gap-2 text-neutral-900 dark:text-[#FAFAFA]', className), ...props, children: [variant === 'arc' && (_jsx("div", { style: { width: size, height: size }, className: "relative flex items-center justify-center", children: _jsxs("svg", { className: cn('w-full h-full', !reduceMotion && 'animate-spin'), style: { animationDuration: '2.5s' }, viewBox: "0 0 40 40", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { cx: "20", cy: "20", r: "16", strokeWidth: "3", className: "stroke-neutral-300 opacity-60 dark:stroke-[#1F1F1F]" }), _jsx(motion.circle, { cx: "20", cy: "20", r: "16", stroke: color, strokeWidth: "3", strokeLinecap: "round", strokeDasharray: "100", strokeDashoffset: "65" })] }) })), variant === 'dots' && (_jsx("div", { style: { width: size * 1.5, height: size * 0.4 }, className: "flex items-center justify-center gap-1.5", children: [0, 1, 2].map((i) => (_jsx(motion.span, { className: "rounded-full bg-current", style: {
                        width: Math.max(4, size * 0.18),
                        height: Math.max(4, size * 0.18),
                        backgroundColor: color !== 'currentColor' ? color : undefined,
                    }, animate: reduceMotion
                        ? { opacity: [0.3, 0.8, 0.3] }
                        : {
                            scale: [0.8, 1.25, 0.8],
                            opacity: [0.3, 1, 0.3],
                        }, transition: {
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.22,
                        ease: 'easeInOut',
                    } }, i))) })), variant === 'line' && (_jsx("div", { style: { width: size * 2, height: Math.max(3, size * 0.08) }, className: "relative rounded-full bg-neutral-200 dark:bg-[#141414] overflow-hidden", children: _jsx(motion.div, { className: "absolute top-0 bottom-0 rounded-full", style: {
                        width: '35%',
                        backgroundColor: color,
                    }, animate: reduceMotion
                        ? { opacity: [0.4, 1, 0.4] }
                        : {
                            left: ['-35%', '100%'],
                        }, transition: {
                        duration: 1.8,
                        repeat: Infinity,
                        ease: [0.4, 0, 0.2, 1],
                    } }) })), variant === 'rings' && (_jsxs("div", { style: { width: size, height: size }, className: "relative flex items-center justify-center", children: [[0, 1].map((i) => (_jsx(motion.span, { className: "absolute inset-0 rounded-full border border-current", style: {
                            borderColor: color !== 'currentColor' ? color : undefined,
                        }, animate: reduceMotion
                            ? { opacity: [0.2, 0.6, 0.2] }
                            : {
                                scale: [0.6, 1.15],
                                opacity: [0.8, 0],
                            }, transition: {
                            duration: 2.2,
                            repeat: Infinity,
                            delay: i * 0.9,
                            ease: 'easeOut',
                        } }, i))), _jsx("span", { className: "rounded-full bg-current", style: {
                            width: Math.max(4, size * 0.2),
                            height: Math.max(4, size * 0.2),
                            backgroundColor: color !== 'currentColor' ? color : undefined,
                        } })] })), label && _jsx("span", { className: "sr-only", children: label })] }));
};
