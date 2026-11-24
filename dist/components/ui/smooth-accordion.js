'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
export const SmoothAccordion = ({ items, allowMultiple = false, defaultOpen = [], className, }) => {
    const [openIds, setOpenIds] = useState(defaultOpen);
    const toggle = (id) => {
        if (allowMultiple) {
            setOpenIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
        }
        else {
            setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
        }
    };
    return (_jsx("div", { className: cn('flex flex-col divide-y divide-neutral-200 dark:divide-[#1F1F1F] rounded-xl border border-neutral-200 dark:border-[#1F1F1F] bg-white dark:bg-[#0E0E0E] overflow-hidden glass-card', className), children: items.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (_jsxs("div", { className: "transition-colors", children: [_jsxs("button", { onClick: () => toggle(item.id), className: "flex w-full items-center justify-between p-4 text-left font-medium text-neutral-900 dark:text-[#FAFAFA] hover:bg-neutral-50 dark:hover:bg-[#141414] transition-colors focus-ring cursor-pointer", "aria-expanded": isOpen, children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-neutral-900 dark:text-[#FAFAFA]", children: item.title }), item.subtitle && (_jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: item.subtitle }))] }), _jsx(motion.div, { animate: { rotate: isOpen ? 180 : 0 }, transition: motionTransitions.springSnappy, className: "text-neutral-500 dark:text-[#525252] ml-2 shrink-0", children: _jsx(ChevronDown, { className: "w-4 h-4" }) })] }), _jsx(AnimatePresence, { initial: false, children: isOpen && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: motionTransitions.springGentle, className: "overflow-hidden", children: _jsx("div", { className: "px-4 pb-4 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-[#A1A1A1] leading-relaxed", children: item.content }) }, "content")) })] }, item.id));
        }) }));
};
