import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircleCheck, CircleDashed, CircleX } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { useLinkComponent } from './link-context.js';
const LOOK = {
    pass: { icon: CircleCheck, className: 'text-positive', said: 'Passed' },
    fail: { icon: CircleX, className: 'text-negative', said: 'Failed' },
    open: { icon: CircleDashed, className: 'text-muted-foreground', said: 'Not checked' },
};
/** A check's outcome as an icon, named for a screen reader unless what it stands beside says it already. */
export function CheckIcon({ state, named = true }) {
    const Icon = LOOK[state].icon;
    return (_jsx(Icon, { className: cn('mt-0.5 size-4 shrink-0', LOOK[state].className), "aria-label": named ? LOOK[state].said : undefined, "aria-hidden": named ? undefined : true }));
}
/**
 * Checks and what each found, an icon telling passed, failed and open apart (and
 * named for a screen reader). A check with an address leads to what says more of it.
 */
export function CheckList({ checks, label, hrefOf, className, }) {
    const Link = useLinkComponent();
    return (_jsx("ul", { className: cn('grid gap-x-6 gap-y-2.5 text-sm', className), "aria-label": label, children: checks.map((check) => {
            const href = hrefOf?.(check) ?? null;
            return (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckIcon, { state: check.state }), _jsxs("div", { className: "min-w-0", children: [href ? (_jsx(Link, { href: href, className: "font-medium underline-offset-4 hover:underline", children: check.label })) : (_jsx("span", { className: "font-medium", children: check.label })), _jsx("p", { className: "text-xs text-muted-foreground", children: check.detail })] })] }, check.id));
        }) }));
}
