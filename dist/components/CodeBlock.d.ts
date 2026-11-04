import type { ReactNode } from 'react';
import type { CodeLanguage, CodeToken } from '../lib/highlight.js';
interface CodeBlockProps {
    code: string;
    /** How it is coloured: `text` not at all. */
    language?: CodeLanguage;
    /** Another language's tokens, from the code: its own tokeniser. */
    highlight?: (code: string) => CodeToken[];
    /** Above the code: a file's name, what the code is. */
    label?: ReactNode;
    /** The lines numbered, from 1 or from the number given. */
    lineNumbers?: boolean | number;
    /** Lines to look at, by their number (from 1, or from `lineNumbers`). */
    highlightLines?: number[];
    /** Taller code scrolls inside it. */
    maxHeight?: number | string;
    /** Long lines wrapped, rather than scrolled sideways. */
    wrap?: boolean;
    /** A button that copies the code. */
    copyable?: boolean;
    className?: string;
}
/**
 * Code to read and copy: a payload, a configuration, a command. Coloured in the design's code colours
 * (json, js and ts with jsx, css, shell), on a surface every one of them is read on at 4.5:1. As Elastic
 * UI's code block does.
 */
export declare function CodeBlock({ code, language, highlight, label, lineNumbers, highlightLines, maxHeight, wrap, copyable, className, }: CodeBlockProps): import("react").JSX.Element;
/** A word of code in a sentence: a name, a value, a key. */
export declare function Code({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export {};
