import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useLayoutEffect, useMemo, useRef, useState, ViewTransition } from 'react';
import { useAppName } from '../components/app-context.js';
import { MainScrollContext } from '../components/main-scroll-context.js';
import { ShortcutsDialog } from '../components/ShortcutsDialog.js';
import { ThemeToggle } from '../components/ThemeToggle.js';
import { Sidebar, SidebarTrigger, useSidebar } from '../components/ui/sidebar.js';
import { isPlainClick } from '../lib/links.js';
import { cn } from '../lib/utils.js';
import { menuEntry, sidebarSections } from './navigation.js';
import { usePageChanged } from './page-change.js';
import { PageTrailProvider, TopBarTrail } from './PageTrail.js';
/**
 * The frame of every page: the sidebar (beside the page from md up, a drawer below; ⌘B folds it),
 * the top bar with the trail of where the page is, and the page itself, which scrolls on its own
 * under the top bar. A page names itself with PageHeader.
 */
export function AppShell(props) {
    return (_jsx(PageTrailProvider, { menu: props.menu, pathname: props.pathname, children: _jsx(Shell, { ...props }) }));
}
function Shell({ menu, pathname, children, appName, appDetail, brandMark, sidebarHeader, sidebarFooter, topBarChips, topBarEnd, isWide, home, linkComponent, defaultCollapsed, shortcutsDialog = true, }) {
    const providedName = useAppName();
    const name = appName ?? providedName ?? '';
    const wide = isWide?.(pathname) ?? false;
    const [mobileOpen, setMobileOpen] = useState(false);
    const main = useRef(null);
    // Another page opens at its top: where the one left was scrolled to means nothing there. A change
    // of the query alone leaves the page where it is. Before the browser paints: no frame of the new
    // page where the old one was.
    useLayoutEffect(() => {
        if (main.current)
            main.current.scrollTop = 0;
    }, [pathname]);
    // Another page fades in as the one left fades out, the shell staying as it is (motion.css): where
    // the browser has view transitions and the page changes in a React transition, as the router's do.
    const pageChanged = usePageChanged(pathname);
    const current = menuEntry(menu, pathname);
    const sections = useMemo(() => sidebarSections(menu), [menu]);
    // Past the menu to the page: the page takes the focus for as long as it keeps it, without the address
    // taking its fragment (a change of the address a router's guard would have to judge).
    const mainId = useId();
    const skip = (event) => {
        const page = main.current;
        if (!isPlainClick(event) || !page)
            return;
        event.preventDefault();
        page.tabIndex = -1;
        page.addEventListener('blur', () => page.removeAttribute('tabindex'), { once: true });
        page.focus();
    };
    return (_jsxs("div", { className: "flex h-dvh overflow-hidden", children: [_jsx("a", { href: `#${mainId}`, onClick: skip, className: "sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-text-primary focus:shadow-lg", children: "Skip to the page" }), _jsx(Sidebar, { sections: sections, activeId: current?.id ?? '', linkComponent: linkComponent, header: sidebarHeader ?? _jsx(AppBrand, { name: name, detail: appDetail, mark: brandMark }), footer: sidebarFooter, defaultCollapsed: defaultCollapsed, mobileOpen: mobileOpen, onMobileOpenChange: setMobileOpen }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [_jsxs("header", { className: "flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6 glass-bar", children: [_jsx(SidebarTrigger, { onClick: () => setMobileOpen(true) }), _jsx("div", { className: "flex min-w-0 flex-1 items-center", children: _jsx(TopBarTrail, { home: home }) }), _jsx("div", { className: "flex shrink-0 items-center gap-2 empty:hidden", children: topBarChips }), topBarEnd === undefined ? _jsx(ThemeToggle, {}) : topBarEnd] }), _jsx(ViewTransition, { default: "none", update: pageChanged ? 'ioiti-page' : 'none', children: _jsx("main", { ref: main, id: mainId, className: "relative flex-1 overflow-y-auto", children: _jsx("div", { className: cn('relative mx-auto flex w-full flex-col gap-6 overflow-x-clip p-4 sm:p-6', wide ? 'max-w-none' : 'max-w-7xl'), children: _jsx(MainScrollContext.Provider, { value: main, children: children }) }) }) })] }), shortcutsDialog && _jsx(ShortcutsDialog, {})] }));
}
/**
 * The application's name at the top of the sidebar, beside its mark; the mark alone once the sidebar is folded.
 * The mark is in the accent, as a filled button is: its gradient and grain where it has them.
 */
export function AppBrand({ name, detail, mark }) {
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-xs font-bold text-background accent:bg-brand accent:bg-(image:--brand-fill) accent:text-brand-fill-foreground", children: mark ?? name.slice(0, 1).toUpperCase() }), _jsxs("div", { className: "min-w-0 leading-tight", children: [_jsx("p", { className: "truncate text-sm font-semibold", children: name }), detail && _jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: detail })] })] }));
}
/** An action at the bottom of the sidebar (signing out), its icon alone once the sidebar is folded. */
export function SidebarFooterButton({ icon, label, className, ...props }) {
    const { collapsed } = useSidebar();
    return (_jsxs("button", { type: "button", "aria-label": label, className: cn('flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm text-neutral-600 outline-none transition-colors hover:bg-neutral-200/70 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400/60 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white dark:focus-visible:ring-neutral-600/60', className), ...props, children: [_jsx("span", { className: "grid size-5 shrink-0 place-items-center [&>svg]:size-[18px]", children: icon }), !collapsed && _jsx("span", { className: "flex-1 whitespace-nowrap text-left", children: label })] }));
}
