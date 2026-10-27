import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLinkComponent } from './link-context.js';
import { Button, buttonClassName } from './ui/button.js';
/**
 * What leads to another page, drawn as a button: a link, so that it can be opened in another tab
 * (a right click, a middle click, ⌘ or Ctrl and a click) as well as followed. Drawn by the
 * application's link (LinkProvider).
 */
export function ButtonLink({ to, variant = 'primary', size = 'md', leftIcon, rightIcon, className, children, ...props }) {
    const Link = useLinkComponent();
    if (!to) {
        return (_jsx(Button, { variant: variant, size: size, leftIcon: leftIcon, rightIcon: rightIcon, className: className, disabled: true, children: children }));
    }
    return (_jsxs(Link, { href: to, className: buttonClassName({ variant, size, className }), ...props, children: [leftIcon && _jsx("span", { className: "shrink-0", children: leftIcon }), children && _jsx("span", { children: children }), rightIcon && _jsx("span", { className: "shrink-0", children: rightIcon })] }));
}
