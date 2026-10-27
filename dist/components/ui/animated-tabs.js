'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isPlainClick } from '../../lib/links.js';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { useLinkComponent } from '../link-context.js';
export const AnimatedTabs = ({ tabs, defaultTab, activeTab: controlledActiveTab, onChange, className, tabsContainerClassName, renderContent = true, layoutId: customLayoutId, variant = 'default', linkComponent, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id || '');
    const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
    const uniqueId = React.useId();
    const indicatorLayoutId = customLayoutId || `active-tab-indicator-${uniqueId}`;
    React.useEffect(() => {
        if (defaultTab && controlledActiveTab === undefined) {
            setInternalActiveTab(defaultTab);
        }
    }, [defaultTab, controlledActiveTab]);
    const handleTabClick = (tabId) => {
        if (controlledActiveTab === undefined) {
            setInternalActiveTab(tabId);
        }
        onChange?.(tabId);
    };
    const currentTabObj = tabs.find((t) => t.id === activeTab);
    const isGlass = variant === 'glass' || variant === 'pill';
    return (_jsxs("div", { className: cn('flex flex-col gap-4', className), children: [_jsx("div", { className: cn('flex items-center gap-1 self-start select-none', isGlass
                    ? 'p-1 rounded-full bg-surface-raised backdrop-blur-xl border border-border dark:bg-[#0E0E0E] dark:border-[#1F1F1F]'
                    : 'p-1 rounded-lg bg-surface-raised border border-border dark:bg-[#0E0E0E] dark:border-[#1F1F1F]', tabsContainerClassName), children: tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Tab = tab.href !== undefined ? LinkComponent : 'button';
                    return (_jsxs(Tab, { ...(tab.href !== undefined ? { href: tab.href, 'aria-current': isActive ? 'page' : undefined } : { type: 'button' }), onClick: (e) => {
                            if (tab.href !== undefined) {
                                if (!isPlainClick(e))
                                    return;
                                e.preventDefault();
                            }
                            handleTabClick(tab.id);
                        }, className: cn('relative text-xs sm:text-sm font-medium transition-colors focus-ring select-none flex items-center gap-2 cursor-pointer', isGlass
                            ? 'px-4 py-1.5 rounded-full'
                            : 'px-3.5 py-1.5 rounded-md', isActive
                            ? // ioiti-ui: the tab shown, and its pill, in the accent where the theme has one (accent:).
                                'text-text-primary font-medium dark:text-[#FAFAFA] accent:text-brand-text'
                            : 'text-text-muted hover:text-text-secondary dark:text-muted-foreground dark:hover:text-[#A1A1A1]'), children: [isActive && (_jsx(motion.div, { layoutId: indicatorLayoutId, className: cn('absolute inset-0 shadow-xs', isGlass
                                    ? 'rounded-full bg-surface border border-border-hover dark:bg-[#141414] dark:border-[#1F1F1F]'
                                    : 'rounded-md bg-surface border border-border-hover dark:bg-[#141414] dark:border-[#1F1F1F]', 'accent:bg-brand-soft accent:border-brand/30'), transition: motionTransitions.springMorph })), _jsxs("span", { className: "relative z-10 flex items-center gap-1.5", children: [tab.icon && _jsx("span", { children: tab.icon }), tab.label, tab.badge && (_jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface-hover border border-border text-text-secondary dark:bg-[#141414] dark:border-[#1F1F1F] dark:text-[#A1A1A1]", children: tab.badge }))] })] }, tab.id));
                }) }), renderContent && (_jsx("div", { className: "relative min-h-[60px]", children: _jsx(AnimatePresence, { mode: "wait", children: currentTabObj?.content && (_jsx(motion.div, { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: motionTransitions.springGentle, className: "text-sm text-text-secondary dark:text-[#A1A1A1]", children: currentTabObj.content }, activeTab)) }) }))] }));
};
