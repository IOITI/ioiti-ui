import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRight } from 'lucide-react';
import { useControllableState } from '../lib/controllable.js';
import { cn } from '../lib/utils.js';
/**
 * More, shown on demand: the figures of a chart as a table, the details of a request, what a setting does.
 * The browser's own `<details>`: find in the page opens it on what it finds. For a list of sections, one
 * open at a time, `SmoothAccordion`.
 */
export function Disclosure({ summary, children, open, defaultOpen = false, onOpenChange, variant = 'plain', className }) {
    const [current, setCurrent] = useControllableState(open, defaultOpen, onOpenChange);
    const controlled = open !== undefined;
    // Held by its caller, a click asks for the change rather than making it.
    const onClick = (event) => {
        if (!controlled)
            return;
        event.preventDefault();
        setCurrent(!current);
    };
    // The browser opened or closed it (a click; find in the page, a link to what it holds): told once.
    const onToggle = (event) => {
        if (event.currentTarget.open !== current)
            setCurrent(event.currentTarget.open);
    };
    const boxed = variant === 'boxed';
    return (_jsxs("details", { open: current, onToggle: onToggle, className: cn('group text-sm', 
        // Its height follows what it holds where the browser can animate to a height of auto.
        '[interpolate-size:allow-keywords] details-content:h-0 details-content:overflow-clip open:details-content:h-auto', 'motion-safe:details-content:transition-[height,content-visibility] motion-safe:details-content:duration-300 motion-safe:details-content:ease-soft motion-safe:details-content:[transition-behavior:allow-discrete]', boxed && 'rounded-xl border border-border', className), children: [_jsxs("summary", { onClick: onClick, className: cn('flex cursor-pointer list-none items-center gap-2 rounded-lg font-medium text-text-secondary transition-colors hover:text-text-primary [&::-webkit-details-marker]:hidden', boxed ? 'px-4 py-3' : 'py-1'), children: [_jsx(ChevronRight, { "aria-hidden": true, className: "size-4 shrink-0 text-text-muted motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-soft group-open:rotate-90" }), summary] }), _jsx("div", { className: cn('text-text-primary', boxed ? 'px-4 pb-4' : 'pb-1 pl-6 pt-2'), children: children })] }));
}
