import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { usePageName, useTabTitle } from '../shell/page-trail-context.js';
import { SECTION } from '../lib/recipes.js';
/**
 * The card every section of a page sits in. Same surface as the EasyUI data table. Never wider than the
 * place it is given: in a grid's column or a row, what it holds (a line that does not wrap, a wide table)
 * is laid out in its width, cut short or scrolled in its own frame, rather than widening the column.
 */
export function Panel({ id, title, description, action, className, bodyClassName, density = 'regular', children }) {
    return (_jsxs("section", { id: id, className: cn(SECTION, 'min-w-0 text-foreground glass-edge', className), children: [(title || action) && (_jsxs("header", { className: "flex flex-wrap items-start justify-between gap-3 px-5 pt-5", children: [_jsxs("div", { className: "min-w-0", children: [title && _jsx("h2", { className: "text-balance break-words text-sm font-semibold", children: title }), description && _jsx("p", { className: "mt-1 text-pretty text-xs text-muted-foreground", children: description })] }), action && _jsx("div", { className: "flex shrink-0 items-center gap-2", children: action })] })), _jsx("div", { className: cn('p-5', density === 'compact' && 'pt-2', bodyClassName), children: children })] }));
}
/**
 * A box nested in a panel: a figure's detail, a note, a group of fields set apart. A shade off the panel;
 * under glass, a faint tint of it (--glass-raised), not a solid surface over the glass.
 */
export function PanelInset({ className, children }) {
    return (_jsx("div", { className: cn('min-w-0 rounded-xl border border-border/60 bg-surface-raised/60 p-4 glass:border-[var(--glass-hairline)] glass:bg-[var(--glass-raised)]', className), children: children }));
}
/**
 * The title of a page and what it does. On a page deeper than the menu, its
 * name (its title, unless it is given one) also ends the trail of the top
 * bar, which every page has, and names the browser's tab.
 */
export function PageHeader({ title, name, description, actions, parents }) {
    usePageName(name ?? title, parents);
    useTabTitle(name ?? title);
    return (_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-balance break-words text-2xl tracking-tight", children: title }), description && _jsx("p", { className: "mt-1 text-pretty text-sm text-muted-foreground", children: description })] }), actions && _jsx("div", { className: "flex flex-wrap items-center gap-2", children: actions })] }));
}
