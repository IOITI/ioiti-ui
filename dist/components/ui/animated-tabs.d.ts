import React from 'react';
export interface TabItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content?: React.ReactNode;
    badge?: string | number;
    /**
     * ioiti-ui: the address of the view the tab shows. The tab is then a link, which can be opened in another
     * tab; a plain click still goes through `onChange`.
     */
    href?: string;
}
export interface AnimatedTabsProps {
    tabs: TabItem[];
    /** ioiti-ui: the id of the tab shown, held by the page (told of each change by `onChange`). */
    value?: string;
    /** ioiti-ui: the id of the tab shown first, the tabs holding it then; the first tab by default. */
    defaultValue?: string;
    /** @deprecated Use `defaultValue`. Removed in 1.0. */
    defaultTab?: string;
    /** @deprecated Use `value`. Removed in 1.0. */
    activeTab?: string;
    onChange?: (tabId: string) => void;
    className?: string;
    tabsContainerClassName?: string;
    renderContent?: boolean;
    layoutId?: string;
    /** ioiti-ui: `default`, a row under a line; `pill`, a rounded track; `glass`, the same as `pill` (kept for EasyUI's). */
    variant?: 'default' | 'glass' | 'pill';
    /** ioiti-ui: what draws a tab that has an `href`; the application's link (LinkProvider) by default, else `a`. */
    linkComponent?: React.ElementType;
    /** ioiti-ui: the tabs' name for a screen reader: "Views of the order". */
    label?: string;
}
export declare const AnimatedTabs: React.FC<AnimatedTabsProps>;
