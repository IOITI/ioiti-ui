import React from 'react';
export interface SpotlightSearchItem {
    id: string;
    title: string;
    category: 'Components' | 'Documentation' | 'Actions' | 'Navigation' | string;
    description?: string;
    icon?: React.ReactNode;
    shortcut?: string[];
    action?: () => void;
    /** ioiti-ui: where it leads: the entry is then a link (opened elsewhere with ⌘ or Ctrl), followed with Enter too. */
    href?: string;
    /** ioiti-ui: more words it is found by. */
    keywords?: string[];
}
export interface SpotlightSearchProps {
    /** Controlled open state */
    open?: boolean;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Optional close callback */
    onClose?: () => void;
    /** Searchable items database override */
    items?: SpotlightSearchItem[];
    /** Search input placeholder */
    placeholder?: string;
    /** Recent searches list */
    recentSearches?: string[];
    /** Callback when an item is selected */
    onSelect?: (item: SpotlightSearchItem) => void;
    /** Enable internal global Cmd+K shortcut */
    enableGlobalShortcut?: boolean;
    /**
     * ioiti-ui: what follows an entry's `href` when Enter chooses it (the router's navigate); the
     * application's (LinkProvider) by default.
     */
    onNavigate?: (href: string) => void;
    /** ioiti-ui: what draws an entry with an `href`; the application's link (LinkProvider) by default. */
    linkComponent?: React.ElementType;
    /** ioiti-ui: told of what is typed, for entries made from it. */
    onQueryChange?: (query: string) => void;
    /** ioiti-ui: the most entries listed at once; the others are found by typing. */
    limit?: number;
    /** ioiti-ui: what the dialog is called. */
    label?: string;
    /** ioiti-ui: the entries under a heading for each category, in the order the categories first come. */
    grouped?: boolean;
    /** Custom class name */
    className?: string;
}
export declare const SpotlightSearch: React.FC<SpotlightSearchProps>;
