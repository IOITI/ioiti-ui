import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppName } from '../components/app-context.js';
import { MainScrollContext } from '../components/main-scroll-context.js';
import { ThemeToggle } from '../components/ThemeToggle.js';
import { Sidebar, SidebarTrigger, useSidebar } from '../components/ui/sidebar.js';
import { cn } from '../lib/utils.js';
import { menuEntry, sidebarSections } from './navigation.js';
import { PageTrailProvider, TopBarTrail } from './PageTrail.js';
/**
 * The frame of every page: the sidebar (beside the page from md up, a drawer below; ⌘B folds it),
 * the top bar with the trail of where the page is, and the page itself, which scrolls on its own
 * under the top bar. A page names itself with PageHeader.
 */
export function AppShell(props) {
    return (_jsx(PageTrailProvider, { menu: props.menu, pathname: props.pathname, children: _jsx(Shell, { ...props }) }));
}
function Shell({ menu, pathname, children, appName, appDetail, brandMark, sidebarHeader, sidebarFooter, topBarChips, topBarEnd, isWide, home, linkComponent, defaultCollapsed, }) {
    const providedName = useAppName();
    const name = appName ?? providedName ?? '';
    const wide = isWide?.(pathname) ?? false;
    const [mobileOpen, setMobileOpen] = useState(false);
    const main = useRef(null);
    // Another page opens at its top: where the one left was scrolled to means nothing there. A change
    // of the query alone leaves the page where it is.
    useEffect(() => {
        if (main.current)
            main.current.scrollTop = 0;
    }, [pathname]);
    const current = menuEntry(menu, pathname);
    const sections = useMemo(() => sidebarSections(menu), [menu]);
    return (_jsxs("div", { className: "flex h-dvh overflow-hidden", children: [_jsx(Sidebar, { sections: sections, activeId: current?.id ?? '', linkComponent: linkComponent, header: sidebarHeader ?? _jsx(AppBrand, { name: name, detail: appDetail, mark: brandMark }), footer: sidebarFooter, defaultCollapsed: defaultCollapsed, mobileOpen: mobileOpen, onMobileOpenChange: setMobileOpen }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [_jsxs("header", { className: "flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6", children: [_jsx(SidebarTrigger, { onClick: () => setMobileOpen(true) }), _jsx("div", { className: "flex min-w-0 flex-1 items-center", children: _jsx(TopBarTrail, { home: home }) }), _jsx("div", { className: "flex shrink-0 items-center gap-2 empty:hidden", children: topBarChips }), topBarEnd === undefined ? _jsx(ThemeToggle, {}) : topBarEnd] }), _jsx("main", { ref: main, className: "relative flex-1 overflow-y-auto", children: _jsx("div", { className: cn('mx-auto flex w-full flex-col gap-6 p-4 sm:p-6', wide ? 'max-w-none' : 'max-w-7xl'), children: _jsx(MainScrollContext.Provider, { value: main, children: children }) }) })] })] }));
}
/** The application's name at the top of the sidebar, beside its mark; the mark alone once the sidebar is folded. */
export function AppBrand({ name, detail, mark }) {
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-xs font-bold text-background", children: mark ?? name.slice(0, 1).toUpperCase() }), _jsxs("div", { className: "min-w-0 leading-tight", children: [_jsx("p", { className: "truncate text-sm font-semibold", children: name }), detail && _jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: detail })] })] }));
}
/** An action at the bottom of the sidebar (signing out), its icon alone once the sidebar is folded. */
export function SidebarFooterButton({ icon, label, className, ...props }) {
    const { collapsed } = useSidebar();
    return (_jsxs("button", { type: "button", "aria-label": label, className: cn('flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm text-neutral-600 outline-none transition-colors hover:bg-neutral-200/70 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400/60 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white dark:focus-visible:ring-neutral-600/60', className), ...props, children: [_jsx("span", { className: "grid size-5 shrink-0 place-items-center [&>svg]:size-[18px]", children: icon }), !collapsed && _jsx("span", { className: "flex-1 whitespace-nowrap text-left", children: label })] }));
}
