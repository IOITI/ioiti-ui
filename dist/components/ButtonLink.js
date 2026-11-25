import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
import { deprecated } from '../lib/deprecated.js';
import { cn } from '../lib/utils.js';
import { useLinkComponent } from './link-context.js';
import { Button, BUTTON_LABEL_CLASS, buttonClassName, buttonIconClassName } from './ui/button.js';
/**
 * What leads to another page, drawn as a button: a link, so that it can be opened in another tab
 * (a right click, a middle click, ⌘ or Ctrl and a click) as well as followed. Drawn by the
 * application's link (LinkProvider), or by a plain `<a>` for a page the server answers (`reloadDocument`).
 */
export function ButtonLink({ href, to, reloadDocument = false, variant: givenVariant = 'primary', size = 'md', pending = false, leftIcon, rightIcon, className, children, onClick, ...props }) {
    const Link = useLinkComponent(reloadDocument ? 'a' : undefined);
    // Its former names read as today's, each said once in development.
    if (to !== undefined)
        deprecated('link-to', 'ButtonLink');
    if (givenVariant === 'destructive')
        deprecated('button-destructive', 'ButtonLink');
    const target = href === undefined ? to : href;
    const variant = givenVariant === 'destructive' ? 'danger' : givenVariant;
    if (!target) {
        return (_jsx(Button, { variant: variant, size: size, pending: pending, leftIcon: leftIcon, rightIcon: rightIcon, className: className, disabled: true, children: children }));
    }
    return (_jsxs(Link, { href: target, className: buttonClassName({
            variant,
            size,
            // On its way, it looks as a pending Button does (DISABLED's half), and gives no more under a press.
            className: cn('transition', pending ? 'cursor-not-allowed opacity-50' : 'motion-safe:active:scale-[0.97]', className),
        }), "aria-busy": pending || undefined, "aria-disabled": pending || undefined, 
        // On its way already: once is enough.
        onClick: pending ? (event) => event.preventDefault() : onClick, ...props, children: [pending ? (_jsx("span", { className: buttonIconClassName(size), children: _jsx(Loader2, { className: "motion-safe:animate-spin", "aria-hidden": true }) })) : (leftIcon && _jsx("span", { className: buttonIconClassName(size), children: leftIcon })), children && _jsx("span", { className: BUTTON_LABEL_CLASS, children: children }), !pending && rightIcon && _jsx("span", { className: buttonIconClassName(size), children: rightIcon })] }));
}
