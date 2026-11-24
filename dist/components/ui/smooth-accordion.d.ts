import React from 'react';
export interface AccordionItem {
    id: string;
    title: string;
    subtitle?: string;
    content: React.ReactNode;
}
export interface SmoothAccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpen?: string[];
    /**
     * ioiti-ui: each question in a heading of this level, which a screen reader lists with the page's own (none by
     * default); drawn as without it.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    className?: string;
}
export declare const SmoothAccordion: React.FC<SmoothAccordionProps>;
