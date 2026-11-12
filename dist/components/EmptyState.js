import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * What a page, a panel or a table says when it has nothing to show, and the way to something: an icon, what
 * there is not under a heading, why, and what to do about it. For one quiet line, `EmptyText`.
 */
export function EmptyState({ icon, title, headingLevel, description, actions, compact = false, className }) {
    const Heading = `h${headingLevel ?? (compact ? 3 : 2)}`;
    return (_jsxs("div", { className: cn('flex flex-col items-center whitespace-normal text-center', compact ? 'gap-1 px-4 py-6' : 'gap-1.5 px-6 py-12', className), children: [icon && (_jsx("div", { "aria-hidden": true, className: cn('grid place-items-center rounded-xl border border-border bg-surface-raised text-muted-foreground', compact ? 'mb-2 size-8 [&>svg]:size-4' : 'mb-3 size-10 [&>svg]:size-5'), children: icon })), _jsx(Heading, { className: cn('text-foreground', compact ? 'text-sm font-medium' : 'text-base font-semibold'), children: title }), description && _jsx("p", { className: cn('text-muted-foreground', compact ? 'max-w-sm text-xs' : 'max-w-md text-sm'), children: description }), actions && _jsx("div", { className: cn('flex flex-wrap items-center justify-center gap-2', compact ? 'mt-3' : 'mt-4'), children: actions })] }));
}
