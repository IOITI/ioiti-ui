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
    defaultTab?: string;
    activeTab?: string;
    onChange?: (tabId: string) => void;
    className?: string;
    tabsContainerClassName?: string;
    renderContent?: boolean;
    layoutId?: string;
    variant?: 'default' | 'glass' | 'pill';
    /** ioiti-ui: what draws a tab that has an `href`; the application's link (LinkProvider) by default, else `a`. */
    linkComponent?: React.ElementType;
    /** ioiti-ui: the tabs' name for a screen reader: "Views of the order". */
    label?: string;
}
export declare const AnimatedTabs: React.FC<AnimatedTabsProps>;
