import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, House } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLinkComponent } from '../components/link-context.js';
import { Breadcrumb } from '../components/ui/breadcrumb.js';
import { cn } from '../lib/utils.js';
import { DEFAULT_HOME } from './navigation.js';
import { NamedContext, PublisherContext, TrailContext, usePageTrail } from './page-trail-context.js';
/**
 * Keeps the name the page shown gives itself (usePageName), for the trail of
 * the top bar. A name is kept with its address and only read for it: the page
 * left behind takes its name away after the next page is drawn, never before.
 */
export function PageTrailProvider({ menu, pathname, children }) {
    const [named, publish] = useState(null);
    const publisher = useMemo(() => ({ pathname, publish }), [pathname]);
    const trail = useMemo(() => ({ menu, pathname }), [menu, pathname]);
    return (_jsx(TrailContext.Provider, { value: trail, children: _jsx(PublisherContext.Provider, { value: publisher, children: _jsx(NamedContext.Provider, { value: named?.pathname === pathname ? named : null, children: children }) }) }));
}
/**
 * The trail in the top bar: whole on a wide screen. Narrower, beside the
 * sidebar, its last two steps. On a phone, where the top bar has room for a
 * word or two, the step before the page alone (a link back when it is one):
 * the page's own name is its heading, just under.
 */
export function TopBarTrail({ home = DEFAULT_HOME }) {
    const Link = useLinkComponent();
    const items = [{ label: home.label, href: home.href, icon: _jsx(House, { "aria-hidden": true }) }, ...usePageTrail()];
    const tail = items.slice(-2);
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumb, { items: items, wrap: false, maxItems: items.length, className: "hidden min-w-0 lg:block" }), _jsx("nav", { "aria-label": "Breadcrumb", className: "min-w-0 lg:hidden", children: _jsx("ol", { className: "flex min-w-0 items-center gap-1 text-sm text-muted-foreground", children: tail.map((item, index) => {
                        const last = index === tail.length - 1;
                        return (_jsxs("li", { className: cn('flex min-w-0 items-center gap-1', !last && 'md:max-w-[45%] md:shrink-0', last && tail.length > 1 && 'hidden md:flex'), children: [index > 0 && _jsx(ChevronRight, { "aria-hidden": true, className: "size-3.5 shrink-0 text-neutral-300 dark:text-neutral-700" }), last || !item.href ? (_jsx("span", { "aria-current": last ? 'page' : undefined, className: cn('truncate', last && 'font-medium text-foreground'), children: item.label })) : (_jsxs(Link, { href: item.href, className: "flex min-w-0 items-center gap-0.5 hover:text-foreground", children: [_jsx(ChevronLeft, { "aria-hidden": true, className: "size-4 shrink-0 md:hidden" }), _jsx("span", { className: "truncate", children: item.label })] }))] }, `${index}-${item.label}`));
                    }) }) })] }));
}
