import React from 'react';
export interface NavSectionItem {
    id: string;
    label: string;
    index?: string;
    /** ioiti-ui: its address (`#id`): the part is then a link, which can be opened in another tab at its place. */
    href?: string;
}
export interface ScrollProgressNavProps {
    /** Section navigation items */
    sections?: NavSectionItem[];
    /** Threshold in px to morph into floating pill */
    scrollThreshold?: number;
    /** Active section manual override or default */
    activeId?: string;
    /** Position mode: 'fixed' attaches to screen viewport, 'inline'/'sticky' stays within parent container */
    mode?: 'fixed' | 'inline' | 'sticky';
    /** Optional scroll container reference */
    containerRef?: React.RefObject<HTMLElement | null>;
    /** Callback fired when a section is clicked */
    onSectionClick?: (id: string) => void;
    /** Position alignment when mode is 'fixed': 'top-center' | 'bottom-center' | 'top-right' */
    position?: 'top-center' | 'bottom-center' | 'top-right';
    /** Custom class name */
    className?: string;
    /** ioiti-ui: what the nav is called (default 'Table of contents'). */
    label?: string;
}
export declare const ScrollProgressNav: React.FC<ScrollProgressNavProps>;
