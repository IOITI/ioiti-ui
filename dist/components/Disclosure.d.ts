import type { ReactNode } from 'react';
interface DisclosureProps {
    /** What it holds, in a few words: always shown. */
    summary: ReactNode;
    children: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** `plain` in the flow of a page; `boxed` in a border of its own. */
    variant?: 'plain' | 'boxed';
    className?: string;
}
/**
 * More, shown on demand: the figures of a chart as a table, the details of a request, what a setting does.
 * The browser's own `<details>`: find in the page opens it on what it finds. For a list of sections, one
 * open at a time, `SmoothAccordion`.
 */
export declare function Disclosure({ summary, children, open, defaultOpen, onOpenChange, variant, className }: DisclosureProps): import("react").JSX.Element;
export {};
