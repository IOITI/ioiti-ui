import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { CopyButton } from './CopyButton.js';
import { Hint } from './Hint.js';
/** A value to read and copy, in a chip with its copy button: a reference, an API key, a webhook's address. */
export function CopyChip({ value, label, truncate = false, keep = { start: 8, end: 6 }, className }) {
    const cut = truncate === 'middle' && value.length > keep.start + keep.end + 1;
    const shown = cut ? `${value.slice(0, keep.start)}…${value.slice(-keep.end)}` : value;
    const short = cut || truncate === 'end';
    const text = (_jsxs("span", { className: cn('min-w-0 font-mono text-xs text-text-primary', truncate === 'end' ? 'truncate' : 'whitespace-nowrap'), children: [_jsx("span", { "aria-hidden": cut || undefined, children: shown }), cut && _jsx("span", { className: "sr-only", children: value })] }));
    return (_jsxs("span", { className: cn('inline-flex max-w-full items-center gap-0.5 rounded-md border border-border bg-surface py-0.5 pl-2 pr-0.5', className), children: [short ? (_jsx(Hint, { content: value, wrap: true, className: "min-w-0", children: text })) : (text), _jsx(CopyButton, { value: value, label: label ? `Copy ${label}` : 'Copy', size: "sm" })] }));
}
