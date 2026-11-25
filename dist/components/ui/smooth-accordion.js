'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
// ioiti-ui: held by its caller or by itself, as every control (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
export const Accordion = ({ items, allowMultiple = false, value, defaultValue, onChange, headingLevel, className, }) => {
    // ioiti-ui: `value`, `defaultValue` and `onChange`, as every control, where EasyUI's said `defaultOpen`.
    const [openIds, setOpenIds] = useControllableState(value, defaultValue ?? [], onChange);
    // ioiti-ui: the ids that tie each question to its answer (aria-controls, aria-labelledby).
    const baseId = useId();
    const Heading = headingLevel ? `h${headingLevel}` : null;
    const toggle = (id) => {
        if (allowMultiple) {
            setOpenIds(openIds.includes(id) ? openIds.filter((item) => item !== id) : [...openIds, id]);
        }
        else {
            setOpenIds(openIds.includes(id) ? [] : [id]);
        }
    };
    return (_jsx("div", { className: cn('flex flex-col divide-y divide-border rounded-xl border border-border bg-surface overflow-hidden glass-card', className), children: items.map((item, index) => {
            const isOpen = openIds.includes(item.id);
            const buttonId = `${baseId}-${index}-question`;
            const panelId = `${baseId}-${index}-answer`;
            // ioiti-ui: a button that submits no form it is in; it says which answer it opens (aria-controls, while it is
            // there).
            const question = (_jsxs("button", { type: "button", id: buttonId, onClick: () => toggle(item.id), className: "flex w-full items-center justify-between p-4 text-left font-medium text-foreground hover:bg-surface-hover transition-colors focus-ring cursor-pointer", "aria-expanded": isOpen, "aria-controls": isOpen ? panelId : undefined, children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-foreground", children: item.title }), item.subtitle && (_jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: item.subtitle }))] }), _jsx(motion.div, { animate: { rotate: isOpen ? 180 : 0 }, transition: motionTransitions.easeFast, className: "text-muted-foreground ml-2 shrink-0", children: _jsx(ChevronDown, { className: "size-4" }) })] }));
            return (_jsxs("div", { className: "transition-colors", children: [Heading ? _jsx(Heading, { className: "tracking-[inherit]", children: question }) : question, _jsx(AnimatePresence, { initial: false, children: isOpen && (_jsx(motion.div, { 
                            // ioiti-ui: the answer, a region named by its question.
                            id: panelId, role: "region", "aria-labelledby": buttonId, initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0, transition: motionTransitions.easeExit }, transition: motionTransitions.springGentle, className: "overflow-hidden", children: _jsx("div", { className: "px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed", children: item.content }) }, "content"
                        // ioiti-ui: the answer, a region named by its question.
                        )) })] }, item.id));
        }) }));
};
