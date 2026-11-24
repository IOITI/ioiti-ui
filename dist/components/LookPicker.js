import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredLayer } from '../lib/anchor.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { ACCENT_LABEL, ACCENTS, lookLabel, MATERIAL_LABEL, MATERIALS } from '../lib/theme.js';
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
import { ACCENT_SWATCH, MATERIAL_SWATCH } from './look-swatches.js';
import { useTheme } from './theme-context.js';
/**
 * The accent and the material, each person's own (kept in this browser, as the theme is): a button
 * for beside the theme's, `topBarEnd={<><LookPicker /><ThemeToggle /></>}`. Until one is picked, the
 * page shows the application's (`ioiti({ accent, material })`). A choice shows at once. The choices are a
 * layer in `document.body`, under the button; the focus goes into them (the accent shown), and Escape, a
 * press elsewhere or a Tab past their ends close them and give the button the focus again. In the menu of
 * the account instead: `UserMenu`'s `appearance` (`useAppearanceItems`).
 */
export function LookPicker({ className }) {
    const { accent, material, setAccent, setMaterial } = useTheme();
    const [open, setOpen] = useState(false);
    const id = useId();
    const button = useRef(null);
    const choices = useRef(null);
    // A layer in document.body (anchor.ts): drawn in the top bar, it was held by whatever makes the bar a stacking
    // context or the root of a backdrop (a blur, a filter, a transform, a z-index): the page was drawn over it, and
    // its own blur saw nothing of the page.
    const layer = useAnchoredLayer({
        open,
        onClose: () => setOpen(false),
        triggerRef: button,
        layerRef: choices,
        side: 'bottom',
        align: 'end',
        offset: 8,
    });
    return (_jsxs("div", { className: cn('relative inline-flex shrink-0', className), children: [_jsx(Hint, { content: open ? '' : 'Accent and material', side: "bottom", children: _jsx("button", { ref: button, type: "button", "aria-label": lookLabel(accent, material), "aria-expanded": open, "aria-controls": open ? `${id}-choices` : undefined, onClick: () => setOpen(!open), onKeyDown: layer.onTriggerKeyDown, className: "grid size-9 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-900 focus-ring aria-expanded:bg-neutral-200/70 aria-expanded:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white dark:aria-expanded:bg-neutral-800 dark:aria-expanded:text-white", children: _jsx(Palette, { className: "size-[18px]", "aria-hidden": true }) }) }), typeof document !== 'undefined' &&
                createPortal(_jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { ref: choices, id: `${id}-choices`, role: "group", "aria-label": "Accent and material", 
                        // Taken by a click on the panel itself, so that it does not count as a press elsewhere.
                        tabIndex: -1, onKeyDown: layer.onLayerKeyDown, initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, style: { ...layer.style, transformOrigin: layer.side === 'top' ? 'bottom right' : 'top right' }, className: "z-50 w-64 space-y-3 overflow-auto rounded-xl border border-border bg-surface p-3 text-foreground shadow-elevated outline-none glass-float", children: [_jsx(Choices, { legend: "Accent", children: ACCENTS.map((value) => (_jsxs(Choice, { name: `${id}-accent`, checked: accent === value, onSelect: () => setAccent(value), children: [_jsx("span", { "data-swatch": value, "aria-hidden": true, className: cn('size-3 shrink-0 rounded-full', ACCENT_SWATCH[value]) }), ACCENT_LABEL[value]] }, value))) }), _jsx(Choices, { legend: "Material", children: MATERIALS.map((value) => (_jsxs(Choice, { name: `${id}-material`, checked: material === value, onSelect: () => setMaterial(value), children: [_jsx("span", { "aria-hidden": true, className: cn('size-3 shrink-0 rounded-[4px]', MATERIAL_SWATCH[value]) }), MATERIAL_LABEL[value]] }, value))) })] })) }), document.body)] }));
}
function Choices({ legend, children }) {
    return (_jsxs("fieldset", { children: [_jsx("legend", { className: "mb-2 text-xs font-medium text-muted-foreground", children: legend }), _jsx("div", { className: "grid grid-cols-2 gap-1.5", children: children })] }));
}
/** A radio button the size of its label: the global focus ring goes round the whole choice. */
function Choice({ name, checked, onSelect, children }) {
    return (_jsxs("label", { className: "relative flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-border px-2.5 text-[13px] text-text-secondary transition-colors hover:bg-surface-hover hover:text-foreground has-checked:border-border-hover has-checked:bg-surface-raised has-checked:font-medium has-checked:text-foreground accent:has-checked:border-brand", children: [_jsx("input", { type: "radio", name: name, checked: checked, onChange: onSelect, className: "absolute inset-0 size-full cursor-pointer appearance-none rounded-lg" }), children] }));
}
