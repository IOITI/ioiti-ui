import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { useLinkComponent } from './link-context.js';
import { Button, BUTTON_LABEL_CLASS, buttonClassName, buttonIconClassName } from './ui/button.js';
/**
 * What leads to another page, drawn as a button: a link, so that it can be opened in another tab
 * (a right click, a middle click, ⌘ or Ctrl and a click) as well as followed. Drawn by the
 * application's link (LinkProvider), or by a plain `<a>` for a page the server answers (`reloadDocument`).
 */
export function ButtonLink({ to, reloadDocument = false, variant = 'primary', size = 'md', leftIcon, rightIcon, className, children, ...props }) {
    const Link = useLinkComponent(reloadDocument ? 'a' : undefined);
    if (!to) {
        return (_jsx(Button, { variant: variant, size: size, leftIcon: leftIcon, rightIcon: rightIcon, className: className, disabled: true, children: children }));
    }
    return (_jsxs(Link, { href: to, className: buttonClassName({ variant, size, className: cn('transition motion-safe:active:scale-[0.97]', className) }), ...props, children: [leftIcon && _jsx("span", { className: buttonIconClassName(size), children: leftIcon }), children && _jsx("span", { className: BUTTON_LABEL_CLASS, children: children }), rightIcon && _jsx("span", { className: buttonIconClassName(size), children: rightIcon })] }));
}
