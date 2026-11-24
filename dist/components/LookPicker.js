import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredLayer } from '../lib/anchor.js';
import { motionTransitions } from '../lib/motion-tokens.js';
import { FLOATING, PRESSABLE } from '../lib/recipes.js';
import { accentName, ACCENTS, lookLabel, materialName, MATERIALS } from '../lib/theme.js';
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
import { useMessages } from './locale-context.js';
import { ACCENT_SWATCH, MATERIAL_SWATCH } from './look-swatches.js';
import { useTheme } from './theme-context.js';
/**
 * The accent and the material, each person's own (kept in this browser, as the theme is): a button
 * for beside the theme's, `topBarEnd={<><LookPicker /><ThemeToggle /></>}`. Until one is picked, the
 * page shows the application's (`ioiti({ accent, material })`). A choice shows at once. The choices are a
 * layer in `document.body`, under the button; the focus goes into them (the accent shown), and Escape, a
 * press elsewhere or a Tab past their ends close them and give the button the focus again. In the menu of
 * the account instead: `UserMenu`'s `appearance` (`useAppearanceItems`). Its words are the provider's language's.
 */
export function LookPicker({ className }) {
    const { accent, material, setAccent, setMaterial } = useTheme();
    const words = useMessages().look;
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
    return (_jsxs("div", { className: cn('relative inline-flex shrink-0', className), children: [_jsx(Hint, { content: open ? '' : words.accentAndMaterial, side: "bottom", children: _jsx("button", { ref: button, type: "button", "aria-label": lookLabel(accent, material, words), "aria-expanded": open, "aria-controls": open ? `${id}-choices` : undefined, onClick: () => setOpen(!open), onKeyDown: layer.onTriggerKeyDown, 
                    // The top bar's icon buttons' look (IconButton's), held as pressed while its choices are open.
                    className: cn(PRESSABLE, 'grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-[color,background-color,scale] hover:bg-surface-hover hover:text-foreground focus-ring aria-expanded:bg-surface-hover aria-expanded:text-foreground'), children: _jsx(Palette, { className: "size-[18px]", "aria-hidden": true }) }) }), typeof document !== 'undefined' &&
                createPortal(_jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { ref: choices, id: `${id}-choices`, role: "group", "aria-label": words.accentAndMaterial, 
                        // Taken by a click on the panel itself, so that it does not count as a press elsewhere.
                        tabIndex: -1, onKeyDown: layer.onLayerKeyDown, initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97, transition: motionTransitions.easeExit }, transition: motionTransitions.springSnappy, style: { ...layer.style, transformOrigin: layer.side === 'top' ? 'bottom right' : 'top right' }, className: cn(FLOATING, 'z-50 w-72 space-y-3 overflow-auto p-3 outline-none'), children: [_jsx(Choices, { legend: words.accent, children: ACCENTS.map((value) => (_jsxs(Choice, { name: `${id}-accent`, checked: accent === value, onSelect: () => setAccent(value), children: [_jsx("span", { "data-swatch": value, "aria-hidden": true, className: cn('size-3 shrink-0 rounded-full', ACCENT_SWATCH[value]) }), accentName(value, words)] }, value))) }), _jsx(Choices, { legend: words.material, children: MATERIALS.map((value) => (_jsxs(Choice, { name: `${id}-material`, checked: material === value, onSelect: () => setMaterial(value), children: [_jsx("span", { "aria-hidden": true, className: cn('size-3 shrink-0 rounded-[4px]', MATERIAL_SWATCH[value]) }), materialName(value, words)] }, value))) })] })) }), document.body)] }));
}
function Choices({ legend, children }) {
    return (_jsxs("fieldset", { children: [_jsx("legend", { className: "mb-2 text-xs font-medium text-muted-foreground", children: legend }), _jsx("div", { className: "grid grid-cols-2 gap-1.5", children: children })] }));
}
/** A radio button the size of its label: the global focus ring goes round the whole choice. */
function Choice({ name, checked, onSelect, children }) {
    return (_jsxs("label", { className: "relative flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-border px-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-foreground has-checked:border-border-hover has-checked:bg-surface-raised has-checked:font-medium has-checked:text-foreground accent:has-checked:border-brand", children: [_jsx("input", { type: "radio", name: name, checked: checked, onChange: onSelect, className: "absolute inset-0 size-full cursor-pointer appearance-none rounded-lg" }), children] }));
}
