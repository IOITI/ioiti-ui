import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useRef } from 'react';
import { useScrollRegion } from '../lib/scroll-region.js';
import { cn } from '../lib/utils.js';
import { useMessages } from './locale-context.js';
const DensityContext = createContext('regular');
const PartContext = createContext('body');
/**
 * A plain table of records or figures, as the pages write them: it scrolls sideways inside its own
 * frame when the screen is narrower than it (give it a `min-w-[40rem]` then). The frame holds all it
 * scrolls, the text of its cells for screen readers too (`sr-only`, placed absolutely): out of a frame
 * that is not positioned, that text stood beyond the page, which then scrolled sideways onto nothing.
 * While it scrolls and its cells hold no control, the frame is a stop of the keyboard, a region named
 * as the table is ("Table" in the provider's language, where it has no name).
 */
const TABLE = { regular: 'w-full text-left text-sm', compact: 'w-full text-left text-xs', dense: 'w-full whitespace-nowrap text-sm' };
export function Table({ density = 'regular', wrapperClassName, className, children, ...props }) {
    const frame = useRef(null);
    const unnamed = useMessages().table.region;
    const region = useScrollRegion(frame, { label: props['aria-label'] ?? unnamed, labelledBy: props['aria-labelledby'] });
    return (_jsx("div", { ref: frame, ...region, className: cn('relative min-w-0 overflow-x-auto', wrapperClassName), children: _jsx("table", { className: cn(TABLE[density], className), ...props, children: _jsx(DensityContext.Provider, { value: density, children: children }) }) }));
}
export function TableHead({ className, children, ...props }) {
    const density = useContext(DensityContext);
    return (_jsx("thead", { className: cn(density !== 'dense' && 'text-muted-foreground', density === 'regular' && 'text-xs', className), ...props, children: _jsx(PartContext.Provider, { value: "head", children: children }) }));
}
export function TableBody({ className, children, ...props }) {
    const density = useContext(DensityContext);
    return (_jsx("tbody", { className: cn(density !== 'dense' ? 'divide-y divide-border/40' : 'tabular-nums', className), ...props, children: _jsx(PartContext.Provider, { value: "body", children: children }) }));
}
export function TableRow({ className, ...props }) {
    const density = useContext(DensityContext);
    const part = useContext(PartContext);
    const dense = density === 'dense' && (part === 'head' ? 'text-xs text-muted-foreground' : 'border-t border-border/40');
    return _jsx("tr", { className: cn(dense, className), ...props });
}
/** A column's heading in the head; a row's own heading (its first cell) in the body. */
export function TableHeaderCell({ numeric = false, className, scope, ...props }) {
    const density = useContext(DensityContext);
    const part = useContext(PartContext);
    return (_jsx("th", { scope: scope ?? (part === 'head' ? 'col' : 'row'), className: cn(density !== 'dense' ? 'py-2 pr-4 font-medium last:pr-0' : 'p-2 font-medium', numeric ? 'text-right' : density === 'dense' && 'text-left', className), ...props }));
}
export function TableCell({ numeric = false, className, ...props }) {
    const density = useContext(DensityContext);
    return (_jsx("td", { className: cn(density !== 'dense' ? 'py-2.5 pr-4 last:pr-0' : 'p-2', numeric && (density !== 'dense' ? 'text-right tabular-nums' : 'text-right'), className), ...props }));
}
