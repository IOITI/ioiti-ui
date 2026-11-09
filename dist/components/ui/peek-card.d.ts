import React from 'react';
export interface PeekCardProps {
    /** Trigger element (e.g. text link, badge, invoice pill). ioiti-ui: one element, which keeps its own focus and click. */
    children: React.ReactElement;
    /** Custom peek preview renderer. ioiti-ui: called only while the card is open: what it reads is read then. */
    renderContent: () => React.ReactNode;
    /** Hover delay in milliseconds */
    delay?: number;
    /** Placement preference: 'top' | 'bottom' | 'auto' */
    placement?: 'top' | 'bottom' | 'auto';
    /**
     * ioiti-ui: on a touch screen, the first tap on the trigger opens the card instead of following the trigger's link;
     * a second tap follows it, and so does the card's own link. Off, a tap follows the link at once.
     */
    openOnTap?: boolean;
    /** ioiti-ui: the card's own link to what it shows ("Open"), drawn by `linkComponent`. */
    href?: string;
    hrefLabel?: string;
    linkComponent?: React.ElementType;
    /** Custom class name for trigger */
    className?: string;
}
export declare const PeekCard: React.FC<PeekCardProps>;
