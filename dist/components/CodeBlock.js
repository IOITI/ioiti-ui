import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { highlightCode, splitLines } from '../lib/highlight.js';
import { cn } from '../lib/utils.js';
import { CopyButton } from './CopyButton.js';
// The design's code colours (theme.css), each written out whole for Tailwind to find it.
const COLOUR = {
    keyword: 'text-(--code-keyword)',
    string: 'text-(--code-string)',
    number: 'text-(--code-number)',
    comment: 'text-(--code-comment)',
    function: 'text-(--code-function)',
    namespace: 'text-(--code-namespace)',
    type: 'text-(--code-type)',
    builtin: 'text-(--code-builtin)',
    operator: 'text-(--code-operator)',
    plain: '',
};
/**
 * Code to read and copy: a payload, a configuration, a command. Coloured in the design's code colours
 * (json, js and ts with jsx, css, shell), on a surface every one of them is read on at 4.5:1. As Elastic
 * UI's code block does.
 */
export function CodeBlock({ code, language = 'text', highlight, label, lineNumbers = false, highlightLines = [], maxHeight, wrap = false, copyable = true, className, }) {
    const lines = useMemo(() => splitLines(highlight ? highlight(code) : highlightCode(code, language)), [code, language, highlight]);
    const first = typeof lineNumbers === 'number' ? lineNumbers : 1;
    const numbered = lineNumbers !== false;
    const marked = new Set(highlightLines);
    const scroll = maxHeight === undefined ? undefined : { maxHeight };
    // Code that overflows is a region the keyboard can scroll; code that fits is no stop for it.
    const pre = useRef(null);
    const [scrolls, setScrolls] = useState(false);
    useLayoutEffect(() => {
        const element = pre.current;
        if (!element)
            return;
        const measure = () => setScrolls(element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight);
        measure();
        if (typeof ResizeObserver === 'undefined')
            return;
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [code, wrap, maxHeight]);
    const copy = copyable && _jsx(CopyButton, { value: code, label: "Copy the code", size: "sm" });
    return (_jsxs("figure", { className: cn('relative min-w-0 overflow-hidden rounded-xl border border-border bg-surface', className), children: [label && (_jsxs("figcaption", { className: "flex items-center justify-between gap-3 border-b border-border py-1 pl-3 pr-1.5 text-xs text-text-secondary", children: [_jsx("span", { className: "truncate", children: label }), copy] })), !label && copy && (_jsx("div", { className: "absolute right-0 top-0 z-10 flex bg-surface pb-1 pl-1 pr-1.5 pt-1.5 before:pointer-events-none before:absolute before:inset-y-0 before:right-full before:w-6 before:bg-linear-to-l before:from-surface before:to-transparent", children: copy })), _jsx("pre", { ref: pre, tabIndex: scrolls ? 0 : undefined, role: scrolls ? 'region' : undefined, "aria-label": scrolls ? (typeof label === 'string' ? label : 'Code') : undefined, style: scroll, className: cn('overflow-auto py-3 font-mono text-[12.5px] leading-relaxed text-text-primary', wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre', !label && copyable && 'pr-10'), children: _jsx("code", { className: "block min-w-fit", children: lines.map((tokens, index) => {
                        const number = first + index;
                        return (_jsxs("span", { className: cn('block px-3', marked.has(number) && 'bg-surface-hover shadow-[inset_2px_0_0_var(--chart-series)]'), children: [numbered && (_jsx("span", { "aria-hidden": true, className: "mr-4 inline-block w-6 select-none text-right text-text-muted", children: number })), tokens.length === 0
                                    ? '\u200b'
                                    : tokens.map((token, at) => (_jsx("span", { className: COLOUR[token.kind], children: token.text }, at)))] }, index));
                    }) }) })] }));
}
/** A word of code in a sentence: a name, a value, a key. */
export function Code({ children, className }) {
    return (_jsx("code", { className: cn('rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-text-primary', className), children: children }));
}
