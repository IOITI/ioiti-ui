import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useLayoutEffect, useMemo, useRef, useState, ViewTransition } from 'react';
import { useAppName } from '../components/app-context.js';
import { ErrorBoundary } from '../components/ErrorBoundary.js';
import { MainScrollContext } from '../components/main-scroll-context.js';
import { ShortcutsDialog } from '../components/ShortcutsDialog.js';
import { ThemeToggle } from '../components/ThemeToggle.js';
import { Sidebar, SidebarTrigger, useSidebar } from '../components/ui/sidebar.js';
import { isPlainClick } from '../lib/links.js';
import { useScrollRegion } from '../lib/scroll-region.js';
import { cn } from '../lib/utils.js';
import { menuEntry, sidebarSections } from './navigation.js';
import { ErrorState } from './ErrorState.js';
import { PageTrailProvider, TopBarTrail } from './PageTrail.js';
/**
 * The frame of every page: the sidebar (beside the page from md up, a drawer below; ⌘B folds it),
 * the top bar with the trail of where the page is, and the page itself, which scrolls on its own
 * under the top bar. A page names itself with PageHeader.
 */
export function AppShell(props) {
    return (_jsx(PageTrailProvider, { menu: props.menu, pathname: props.pathname, search: props.search, tabTitle: props.tabTitle, children: _jsx(Shell, { ...props }) }));
}
function Shell({ menu, pathname, hash, search, children, appName, appDetail, brandMark, sidebarHeader, sidebarFooter, topBarChips, topBarEnd, isWide, pageOf, home, linkComponent, defaultCollapsed, collapsedStorageKey, shortcutsDialog = true, className, errorFallback, pending = false, }) {
    const providedName = useAppName();
    const name = appName ?? providedName ?? '';
    const wide = isWide?.(pathname) ?? false;
    const [mobileOpen, setMobileOpen] = useState(false);
    // The phone's drawer, which the button that opens it names, and says open or closed.
    const drawerId = useId();
    const main = useRef(null);
    // Another page opens at its top: where the one left was scrolled to means nothing there. A change
    // of the query alone leaves the page where it is. Before the browser paints: no frame of the new
    // page where the old one was.
    // Another page fades in as the one left fades out, the shell staying as it is (motion.css): where the browser
    // has view transitions and the page changes in a React transition, as the router's do. The page's frame is
    // keyed by the page, which enters and leaves, and never animates as it updates: an update of the page after
    // it arrived (a part of it loading, a redirect to its first tab) moved the whole page again, a step after the
    // first. A new frame also opens the page at its top.
    // Every frame of this shell has one name, the shell's own: the frame leaving and the one arriving are a pair,
    // one picture each in one group (share). Each frame of its own name (React's, kept by a frame from its arrival
    // to its leaving), WebKit (Safari, every browser of an iPhone) drew the page left a second time from the
    // second change of page on, as arriving, under the name it had arrived with: both pages at full strength.
    const page = pageOf ? pageOf(pathname) : pathname;
    const frameName = `ioiti-page-${useId()}`;
    useScrollToPart(main, page, hash);
    const current = menuEntry(menu, pathname, search);
    const sections = useMemo(() => sidebarSections(menu), [menu]);
    // A page that scrolls holding no control (a page of text, of figures) is a stop of the keyboard itself, its arrows
    // scrolling it; one that holds a control is reached through it (scroll-region.ts). Each page's frame is its own.
    const pageStop = useScrollRegion(main, { region: false, key: page });
    // Past the menu to the page: the page takes the focus for as long as it keeps it (a stop already, it keeps its
    // tab index), without the address taking its fragment (a change of the address a router's guard would have to judge).
    const mainId = useId();
    const skip = (event) => {
        const page = main.current;
        if (!isPlainClick(event) || !page)
            return;
        event.preventDefault();
        if (!page.hasAttribute('tabindex')) {
            page.tabIndex = -1;
            page.addEventListener('blur', () => page.getAttribute('tabindex') === '-1' && page.removeAttribute('tabindex'), { once: true });
        }
        page.focus();
    };
    return (_jsxs("div", { className: cn('flex h-dvh overflow-hidden', className), children: [_jsx("a", { href: `#${mainId}`, onClick: skip, className: "sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-elevated", children: "Skip to the page" }), _jsx(Sidebar, { sections: sections, activeId: current?.id ?? '', linkComponent: linkComponent, header: sidebarHeader ?? _jsx(AppBrand, { name: name, detail: appDetail, mark: brandMark }), footer: sidebarFooter, defaultCollapsed: defaultCollapsed, collapsedStorageKey: collapsedStorageKey, mobileOpen: mobileOpen, onMobileOpenChange: setMobileOpen, drawerId: drawerId }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [_jsxs("header", { className: "relative flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6 glass-bar", children: [_jsx(SidebarTrigger, { onClick: () => setMobileOpen(true), "aria-expanded": mobileOpen, "aria-controls": mobileOpen ? drawerId : undefined }), _jsx("div", { className: "flex min-w-0 flex-1 items-center", children: _jsx(TopBarTrail, { home: home }) }), _jsx("div", { className: "flex shrink-0 items-center gap-2 empty:hidden", children: topBarChips }), topBarEnd === undefined ? _jsx(ThemeToggle, {}) : topBarEnd, _jsx("span", { "aria-hidden": true, className: cn('pointer-events-none absolute inset-x-0 -bottom-px h-0.5 bg-foreground/40 transition-opacity duration-300 ease-soft accent:bg-brand', pending ? 'opacity-100 delay-300 motion-safe:animate-pulse' : 'opacity-0') })] }), _jsx(ViewTransition, { name: frameName, default: "none", enter: "ioiti-page", exit: "ioiti-page", share: "ioiti-page", children: _jsx("main", { ref: main, id: mainId, ...pageStop, "aria-busy": pending || undefined, className: "relative flex-1 overflow-y-auto", children: _jsx("div", { className: cn('relative mx-auto flex w-full flex-col gap-6 overflow-x-clip p-4 sm:p-6', wide ? 'max-w-none' : 'max-w-7xl'), children: _jsx(MainScrollContext.Provider, { value: main, children: errorFallback === false ? (children) : (_jsx(ErrorBoundary, { resetKeys: [pathname], fallback: errorFallback ?? pageFallback, children: children })) }) }) }) }, page)] }), shortcutsDialog && _jsx(ShortcutsDialog, {})] }));
}
/** What a page that failed shows by default: an ErrorState of a page, its Try again drawing it again. */
const pageFallback = ({ error, reset }) => _jsx(ErrorState, { error: error, onRetry: reset });
/**
 * The part of the page an address shows (`#rules`), scrolled to the top of the page once it is there: the browser
 * does it for a page it loads, not for one a router draws. A part drawn late (a page loading, its data arriving) is
 * waited for, 3 s at most, and while the page and the part stay the same.
 */
function useScrollToPart(main, page, hash) {
    useLayoutEffect(() => {
        const scroller = main.current;
        const id = hash ? safeDecode(hash.replace(/^#/, '')) : '';
        if (!scroller || !id)
            return;
        const find = () => {
            const part = scroller.ownerDocument.getElementById(id);
            return part && scroller.contains(part) ? part : null;
        };
        const show = (part) => part.scrollIntoView?.({ block: 'start' });
        const found = find();
        if (found) {
            show(found);
            return;
        }
        const observer = new MutationObserver(() => {
            const part = find();
            if (!part)
                return;
            observer.disconnect();
            show(part);
        });
        observer.observe(scroller, { childList: true, subtree: true });
        const giveUp = window.setTimeout(() => observer.disconnect(), 3000);
        return () => {
            observer.disconnect();
            window.clearTimeout(giveUp);
        };
    }, [main, page, hash]);
}
function safeDecode(text) {
    try {
        return decodeURIComponent(text);
    }
    catch {
        return text;
    }
}
/**
 * The application's name at the top of the sidebar, beside its mark; the mark alone once the sidebar is folded.
 * The mark is in the accent, as a filled button is: its gradient and grain where it has them.
 */
export function AppBrand({ name, detail, mark }) {
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-xs font-bold text-background accent:bg-brand accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground", children: mark ?? name.slice(0, 1).toUpperCase() }), _jsxs("div", { className: "min-w-0 leading-tight", children: [_jsx("p", { className: "truncate text-sm font-semibold", children: name }), detail && _jsx("p", { className: "truncate text-xs text-muted-foreground", children: detail })] })] }));
}
/** An action at the bottom of the sidebar (signing out), its icon alone once the sidebar is folded. */
export function SidebarFooterButton({ icon, label, className, ...props }) {
    const { collapsed } = useSidebar();
    return (_jsxs("button", { type: "button", "aria-label": label, className: cn(
        // The design's focus ring alone (design.css), not one of its own beside it.
        'flex h-9 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-surface-hover hover:text-foreground', className), ...props, children: [_jsx("span", { className: "grid size-5 shrink-0 place-items-center [&>svg]:size-[18px]", children: icon }), !collapsed && _jsx("span", { className: "flex-1 whitespace-nowrap text-left", children: label })] }));
}
