import { jsx as _jsx } from "react/jsx-runtime";
import { useLinkComponent } from './link-context.js';
import { PeekCard } from './ui/peek-card.js';
/**
 * A link whose page is previewed on hover, on keyboard focus and on a first tap: what it leads to,
 * without leaving the page. It stays a link, which a click (and a second tap) follows.
 */
export function PeekLink({ to, content, className, children, openOnTap = true, 'aria-label': label }) {
    const Link = useLinkComponent();
    return (_jsx(PeekCard, { renderContent: content, href: to, openOnTap: openOnTap, children: _jsx(Link, { href: to, className: className, "aria-label": label, children: children }) }));
}
