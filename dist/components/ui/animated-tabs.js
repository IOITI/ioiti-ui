'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// ioiti-ui: held by its caller or by itself, as every control (useControllableState).
import { useControllableState } from '../../lib/controllable.js';
import { isPlainClick } from '../../lib/links.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { useLinkComponent } from '../link-context.js';
export const Tabs = ({ tabs, value, defaultValue, onChange, className, tabsContainerClassName, renderContent = true, layoutId: customLayoutId, variant = 'default', linkComponent, label, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    // ioiti-ui: `value` and `defaultValue`, as every control, where EasyUI's said `activeTab` and `defaultTab`. A default
    // is the first tab shown only: EasyUI's showed it again whenever it changed.
    const [activeTab, handleTabClick] = useControllableState(value, defaultValue || tabs[0]?.id || '', onChange);
    const uniqueId = React.useId();
    const indicatorLayoutId = customLayoutId || `active-tab-indicator-${uniqueId}`;
    const currentTabObj = tabs.find((t) => t.id === activeTab);
    // ioiti-ui: `glass` is `pill` (EasyUI drew them alike): the glass material gives any surface its glass.
    const isGlass = variant === 'glass' || variant === 'pill';
    // ioiti-ui: tabs that switch panels are a tablist (tab, tabpanel, one stop of the keyboard, the arrows,
    // Home and End moving and choosing); tabs that lead to pages (`href`) stay links, the current one said so.
    const asTabs = tabs.every((tab) => tab.href === undefined);
    const tabId = (id) => `${uniqueId}-tab-${id}`;
    const panelId = `${uniqueId}-panel`;
    const tabRefs = React.useRef({});
    const onTabKeyDown = (event) => {
        if (!asTabs)
            return;
        const at = tabs.findIndex((tab) => tab.id === activeTab);
        const next = event.key === 'ArrowRight' ? (at + 1) % tabs.length
            : event.key === 'ArrowLeft' ? (at - 1 + tabs.length) % tabs.length
                : event.key === 'Home' ? 0
                    : event.key === 'End' ? tabs.length - 1
                        : null;
        if (next === null)
            return;
        event.preventDefault();
        handleTabClick(tabs[next].id);
        tabRefs.current[tabs[next].id]?.focus();
    };
    return (_jsxs("div", { className: cn('flex flex-col gap-4', className), children: [_jsx("div", { role: asTabs ? 'tablist' : undefined, "aria-label": label, onKeyDown: onTabKeyDown, className: cn(
                // ioiti-ui: never wider than its container: where the tabs do not all fit (a phone), the row scrolls
                // sideways in itself, each name on one line, without a bar (the tab cut at its end says there is
                // more), and holds what it scrolls (positioned). It made the page wider than the screen, the names
                // of its tabs broken over two lines.
                'relative flex max-w-full items-center gap-1 self-start overflow-x-auto whitespace-nowrap select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', isGlass
                    ? // ioiti-ui: no blur: the design blurs a tile and what floats only (glass-tile, glass-float), and this one,
                        // on a solid surface, blurred nothing seen.
                        'p-1 rounded-full bg-surface-raised border border-border'
                    : 'p-1 rounded-lg bg-surface-raised border border-border', tabsContainerClassName), children: tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Tab = tab.href !== undefined ? LinkComponent : 'button';
                    return (_jsxs(Tab, { ref: (element) => {
                            tabRefs.current[tab.id] = element;
                        }, ...(tab.href !== undefined ? { href: tab.href, 'aria-current': isActive ? 'page' : undefined } : { type: 'button' }), ...(asTabs
                            ? {
                                id: tabId(tab.id),
                                role: 'tab',
                                'aria-selected': isActive,
                                'aria-controls': renderContent ? panelId : undefined,
                                tabIndex: isActive ? 0 : -1,
                            }
                            : {}), onClick: (e) => {
                            if (tab.href !== undefined) {
                                if (!isPlainClick(e))
                                    return;
                                e.preventDefault();
                            }
                            handleTabClick(tab.id);
                        }, className: cn('relative text-sm font-medium transition-colors focus-ring select-none flex items-center gap-2 cursor-pointer', isGlass
                            ? 'px-4 py-1.5 rounded-full'
                            : 'px-3.5 py-1.5 rounded-md', isActive
                            ? // ioiti-ui: the tab shown, and its pill, in the accent where the theme has one (accent:).
                                'text-foreground font-medium accent:text-brand-text'
                            : 'text-muted-foreground hover:text-text-secondary'), children: [isActive && (_jsx(motion.div, { layoutId: indicatorLayoutId, 
                                // ioiti-ui: slides when the tab changes, only; a resize moves it with its tab (a spring had it trail).
                                layoutDependency: activeTab, className: cn('absolute inset-0 shadow-subtle', isGlass
                                    ? 'rounded-full bg-surface border border-border-hover'
                                    : 'rounded-md bg-surface border border-border-hover', 'accent:bg-brand-soft accent:border-brand/30'), transition: motionTransitions.springMorph })), _jsxs("span", { className: "relative z-10 flex items-center gap-1.5", children: [tab.icon && _jsx("span", { children: tab.icon }), tab.label, tab.badge !== undefined && tab.badge !== null && tab.badge !== '' && ' ', tab.badge !== undefined && tab.badge !== null && tab.badge !== '' && (_jsx("span", { className: "px-1.5 py-0.5 text-[11px] font-mono tabular-nums rounded-full bg-surface-hover border border-border text-text-secondary", children: tab.badge }))] })] }, tab.id));
                }) }), renderContent && (_jsx("div", { className: "relative min-h-[60px]", children: _jsx(AnimatePresence, { mode: "wait", children: currentTabObj?.content && (_jsx(motion.div, { ...(asTabs ? { id: panelId, role: 'tabpanel', 'aria-labelledby': tabId(activeTab), tabIndex: 0 } : {}), initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, 
                        // ioiti-ui: it leaves quicker than it came (easeExit).
                        exit: { opacity: 0, y: -6, transition: motionTransitions.easeExit }, transition: motionTransitions.springGentle, className: "text-sm text-text-secondary", children: currentTabObj.content }, activeTab)) }) }))] }));
};
