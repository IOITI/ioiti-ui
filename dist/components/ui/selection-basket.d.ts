import React from 'react';
export interface SelectionActionItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger' | 'primary';
    onClick?: () => void;
    /** ioiti-ui: where it leads, when it leads to another page: a link, drawn by `linkComponent`. */
    href?: string;
    /** ioiti-ui: not possible for the selection now; `title` says why, in a tooltip (hover, focus, tap). */
    disabled?: boolean;
    title?: string;
}
export interface SelectionBasketProps {
    /** Count of selected items */
    selectedCount: number;
    /** Total count of all items (for select all calculation) */
    totalCount?: number;
    /**
     * Position mode: 'fixed' attaches to browser viewport, 'contained' / 'inline' stays within parent container.
     * ioiti-ui: 'sticky' stays at the bottom of the screen while its list is on it, and rests under the list past it.
     */
    mode?: 'fixed' | 'contained' | 'inline' | 'sticky';
    /** Custom actions list */
    actions?: SelectionActionItem[];
    /** Callback to clear all selections */
    onClearSelection?: () => void;
    /** Callback to select all items */
    onSelectAll?: () => void;
    /** ioiti-ui: whether every item that can be is selected (EasyUI compares the counts, wrong once a search hides some). */
    allSelected?: boolean;
    /** ioiti-ui: what an item is, one and several ("file", "files"). */
    noun?: [string, string];
    /** ioiti-ui: what draws an action that has an `href`; the application's link (LinkProvider) by default. */
    linkComponent?: React.ElementType;
    /** Custom class name */
    className?: string;
}
export declare const SelectionBasket: React.FC<SelectionBasketProps>;
