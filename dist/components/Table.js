import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { cn } from '../lib/utils.js';
const DensityContext = createContext('compact');
const PartContext = createContext('body');
/**
 * A plain table of records or figures, as the pages write them: it scrolls sideways inside its own
 * frame when the screen is narrower than it (give it a `min-w-[40rem]` then).
 */
export function Table({ density = 'compact', wrapperClassName, className, children, ...props }) {
    return (_jsx("div", { className: cn('min-w-0 overflow-x-auto', wrapperClassName), children: _jsx("table", { className: cn(density === 'compact' ? 'w-full text-left text-xs' : 'w-full whitespace-nowrap text-sm', className), ...props, children: _jsx(DensityContext.Provider, { value: density, children: children }) }) }));
}
export function TableHead({ className, children, ...props }) {
    const density = useContext(DensityContext);
    return (_jsx("thead", { className: cn(density === 'compact' && 'text-muted-foreground', className), ...props, children: _jsx(PartContext.Provider, { value: "head", children: children }) }));
}
export function TableBody({ className, children, ...props }) {
    const density = useContext(DensityContext);
    return (_jsx("tbody", { className: cn(density === 'compact' ? 'divide-y divide-border/40' : 'tabular-nums', className), ...props, children: _jsx(PartContext.Provider, { value: "body", children: children }) }));
}
export function TableRow({ className, ...props }) {
    const density = useContext(DensityContext);
    const part = useContext(PartContext);
    const dense = density === 'dense' && (part === 'head' ? 'text-xs text-muted-foreground' : 'border-t border-border/50');
    return _jsx("tr", { className: cn(dense, className), ...props });
}
/** A column's heading in the head; a row's own heading (its first cell) in the body. */
export function TableHeaderCell({ numeric = false, className, scope, ...props }) {
    const density = useContext(DensityContext);
    const part = useContext(PartContext);
    return (_jsx("th", { scope: scope ?? (part === 'head' ? 'col' : 'row'), className: cn(density === 'compact' ? 'py-2 pr-4 font-medium last:pr-0' : 'p-2 font-medium', numeric ? 'text-right' : density === 'dense' && 'text-left', className), ...props }));
}
export function TableCell({ numeric = false, className, ...props }) {
    const density = useContext(DensityContext);
    return (_jsx("td", { className: cn(density === 'compact' ? 'py-2.5 pr-4 last:pr-0' : 'p-2', numeric && (density === 'compact' ? 'text-right tabular-nums' : 'text-right'), className), ...props }));
}
