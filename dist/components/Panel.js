import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { usePageName, useTabTitle } from '../shell/page-trail-context.js';
/** The card every section of a page sits in. Same surface as the EasyUI data table. */
export function Panel({ id, title, description, action, className, bodyClassName, dense = false, children }) {
    return (_jsxs("section", { id: id, className: cn('rounded-2xl border border-border/70 bg-surface/50 text-foreground dark:bg-surface/25 glass-card', className), children: [(title || action) && (_jsxs("header", { className: "flex flex-wrap items-start justify-between gap-3 px-5 pt-5", children: [_jsxs("div", { className: "min-w-0", children: [title && _jsx("h2", { className: "text-sm font-semibold", children: title }), description && _jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: description })] }), action && _jsx("div", { className: "flex shrink-0 items-center gap-2", children: action })] })), _jsx("div", { className: cn('p-5', dense && 'pt-2', bodyClassName), children: children })] }));
}
/**
 * The title of a page and what it does. On a page deeper than the menu, its
 * title also ends the trail of the top bar, which every page has.
 */
export function PageHeader({ title, description, actions, parents }) {
    usePageName(title, parents);
    useTabTitle(title);
    return (_jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-2xl tracking-tight", children: title }), description && _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: description })] }), actions && _jsx("div", { className: "flex flex-wrap items-center gap-2", children: actions })] }));
}
