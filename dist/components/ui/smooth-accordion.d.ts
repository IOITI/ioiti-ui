import React from 'react';
export interface AccordionItem {
    id: string;
    title: string;
    subtitle?: string;
    content: React.ReactNode;
}
export interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    /** ioiti-ui: the ids of the items open, held by the page (told of each change by `onChange`). */
    value?: string[];
    /** ioiti-ui: the ids of the items open at first, the accordion holding them then; none by default. */
    defaultValue?: string[];
    /** ioiti-ui: told of the ids of the items open, at each opening and closing. */
    onChange?: (value: string[]) => void;
    /** @deprecated Use `defaultValue`. Removed in 1.0. */
    defaultOpen?: string[];
    /**
     * ioiti-ui: each question in a heading of this level, which a screen reader lists with the page's own (none by
     * default); drawn as without it.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    className?: string;
}
export declare const Accordion: React.FC<AccordionProps>;
/** @deprecated Use `Accordion`. Removed in 1.0. */
export declare const SmoothAccordion: React.FC<AccordionProps>;
/** @deprecated Use `AccordionProps`. Removed in 1.0. */
export type SmoothAccordionProps = AccordionProps;
