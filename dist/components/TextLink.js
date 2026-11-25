import { jsx as _jsx } from "react/jsx-runtime";
import { deprecated } from '../lib/deprecated.js';
import { cn } from '../lib/utils.js';
import { useLinkComponent } from './link-context.js';
const LOOK = {
    /** In running text: underlined, and in the accent where the theme has one. */
    inline: 'underline underline-offset-2 accent:text-brand-text',
    /** In a list or a table, where every name is a link: underlined under the pointer, in the accent then. */
    hover: 'underline-offset-2 hover:underline accent:hover:text-brand-text',
    /** A panel's own way further ("View all"): small and quiet until hovered. */
    quiet: 'text-xs text-muted-foreground hover:text-foreground accent:hover:text-brand-text',
};
/**
 * A link made of words, drawn by the application's link (LinkProvider), or by a plain `<a>` for a page the
 * server answers (`reloadDocument`): opened in another tab with ⌘ or Ctrl.
 */
export function TextLink({ href, to, reloadDocument = false, variant = 'inline', className, ...props }) {
    const Link = useLinkComponent(reloadDocument ? 'a' : undefined);
    // Its former name read as today's, said once in development.
    if (to !== undefined)
        deprecated('link-to', 'TextLink');
    return (_jsx(Link, { href: href ?? to, className: cn(LOOK[variant], className), ...props }));
}
