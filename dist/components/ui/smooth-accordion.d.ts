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
    className?: string;
}
export declare const SmoothAccordion: React.FC<SmoothAccordionProps>;
