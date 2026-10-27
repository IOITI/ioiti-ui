import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, Copy, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { announce } from '../lib/announce.js';
import { cn, copyToClipboard } from '../lib/utils.js';
import { Hint } from './Hint.js';
const SAID = { idle: '', copied: 'Copied', failed: "Couldn't copy" };
/** Copies a value to the clipboard, and says it did: a check for two seconds, and the words for a screen reader. */
export function CopyButton({ value, label = 'Copy', showLabel = false, size = 'md', onCopy, className }) {
    const [outcome, setOutcome] = useState('idle');
    const button = useRef(null);
    const timer = useRef(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);
    const copy = async () => {
        const copied = await copyToClipboard(typeof value === 'function' ? value() : value).catch(() => false);
        // Where the clipboard is not given to the page, copying borrows the focus: it comes back here.
        button.current?.focus();
        setOutcome(copied ? 'copied' : 'failed');
        announce(copied ? SAID.copied : SAID.failed);
        onCopy?.(copied);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOutcome('idle'), 2000);
    };
    const icon = outcome === 'copied' ? (_jsx(Check, { className: "text-positive", "aria-hidden": true })) : outcome === 'failed' ? (_jsx(TriangleAlert, { className: "text-warning", "aria-hidden": true })) : (_jsx(Copy, { "aria-hidden": true }));
    const drawn = (_jsxs("button", { ref: button, type: "button", "aria-label": showLabel ? undefined : label, onClick: copy, className: cn('inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-text-secondary transition hover:bg-surface-hover hover:text-text-primary motion-safe:active:scale-95', size === 'sm' ? 'h-7 min-w-7 text-xs [&>svg]:size-3.5' : 'h-8 min-w-8 text-sm [&>svg]:size-4', showLabel && 'px-2', className), children: [icon, showLabel && _jsx("span", { children: outcome === 'idle' ? label : SAID[outcome] })] }));
    // An icon alone has its hint: what it does, then what came of it. A label written beside it says both.
    return _jsx(Hint, { content: showLabel ? '' : outcome === 'idle' ? label : SAID[outcome], children: drawn });
}
