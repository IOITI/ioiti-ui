import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDownToLine, ChevronDown, ChevronUp, Download, Search, WrapText } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { blocksInSight, findInLog, LOG_BLOCK, logLevel, matchParts, splitLog } from '../lib/log.js';
import { DISABLED, PRESSABLE } from '../lib/recipes.js';
import { cn } from '../lib/utils.js';
import { CopyButton } from './CopyButton.js';
import { FieldContext } from './field-context.js';
import { IconButton } from './IconButton.js';
import { useMessages } from './locale-context.js';
import { Input } from './ui/form.js';
/** A line's height unwrapped: text-[13px] on leading-5. */
const LINE = 20;
/** The height assumed for the view while it has none to measure (before layout, in a test). */
const UNMEASURED_VIEW = 600;
const LEVEL_TEXT = {
    error: 'text-(--negative)',
    warning: 'text-(--warning)',
    info: '',
};
// The level is also a mark at the line's edge: its colour is not the only sign of it.
const LEVEL_EDGE = {
    error: 'shadow-[inset_2px_0_0_var(--negative)]',
    warning: 'shadow-[inset_2px_0_0_var(--warning)]',
    info: 'shadow-[inset_2px_0_0_var(--info)]',
};
/**
 * A process's output as it is written (a build, a deploy, a job): numbered lines, errors and warnings
 * in their tones and marked at their edge, the newest kept in sight, a search that goes from one line found
 * to the next, wrapping, copying and downloading. Only the lines in sight are drawn: a log of a hundred
 * thousand lines scrolls as one of a hundred. Not read aloud line by line: a screen reader reads it when
 * asked.
 */
export function LogViewer({ lines, text, label, follow = true, maxLines = 50_000, droppedLines = 0, defaultWrap = false, height = 384, downloadName = 'log.txt', emptyText, className, }) {
    const words = useMessages().log;
    const all = useMemo(() => lines ?? splitLog(text ?? ''), [lines, text]);
    const cut = Math.max(0, all.length - Math.max(1, maxLines));
    const shown = useMemo(() => (cut ? all.slice(cut) : all), [all, cut]);
    const dropped = droppedLines + cut;
    const [wrap, setWrap] = useState(defaultWrap);
    const [query, setQuery] = useState('');
    const found = useMemo(() => findInLog(shown, query), [shown, query]);
    const [current, setCurrent] = useState(0);
    const [following, setFollowing] = useState(follow);
    const [sight, setSight] = useState({ top: 0, view: 0 });
    // The line to bring into sight (a match), by its index among the lines shown.
    const [target, setTarget] = useState(null);
    const scroller = useRef(null);
    // Heights of the blocks drawn wrapped, measured; a block not measured yet is as high as its lines unwrapped.
    const measured = useRef(new Map());
    const [, setMeasures] = useState(0);
    useEffect(() => measured.current.clear(), [wrap]);
    const firstLine = dropped;
    const firstBlock = Math.floor(firstLine / LOG_BLOCK);
    const blockCount = shown.length ? Math.floor((firstLine + shown.length - 1) / LOG_BLOCK) - firstBlock + 1 : 0;
    const range = useCallback((block) => {
        const id = firstBlock + block;
        return [Math.max(id * LOG_BLOCK, firstLine) - firstLine, Math.min((id + 1) * LOG_BLOCK, firstLine + shown.length) - firstLine];
    }, [firstBlock, firstLine, shown.length]);
    const heightOf = (block) => {
        const [start, end] = range(block);
        const count = end - start;
        const known = wrap ? measured.current.get(firstBlock + block) : undefined;
        return known ? (known.height * count) / known.count : count * LINE;
    };
    const { first, last, before, after } = blocksInSight(blockCount, heightOf, sight.top, sight.view || UNMEASURED_VIEW);
    const longest = useMemo(() => (wrap ? 0 : shown.reduce((most, line) => Math.max(most, line.length), 0)), [shown, wrap]);
    const observer = useRef(null);
    useEffect(() => {
        if (typeof ResizeObserver === 'undefined')
            return;
        observer.current = new ResizeObserver((entries) => {
            let changed = false;
            for (const entry of entries) {
                const element = entry.target;
                const id = Number(element.dataset.block);
                const count = Number(element.dataset.count);
                const size = element.getBoundingClientRect().height;
                const known = measured.current.get(id);
                if (size > 0 && (!known || known.height !== size || known.count !== count)) {
                    measured.current.set(id, { height: size, count });
                    changed = true;
                }
            }
            if (changed)
                setMeasures((version) => version + 1);
        });
        return () => observer.current?.disconnect();
    }, []);
    const watch = useCallback((element) => {
        if (element)
            observer.current?.observe(element);
    }, []);
    const readSight = () => {
        const element = scroller.current;
        if (!element)
            return;
        setSight((was) => (was.top === element.scrollTop && was.view === element.clientHeight ? was : { top: element.scrollTop, view: element.clientHeight }));
    };
    const onScroll = () => {
        const element = scroller.current;
        if (!element)
            return;
        readSight();
        const atEnd = element.scrollTop + element.clientHeight >= element.scrollHeight - LINE / 2;
        if (atEnd !== following)
            setFollowing(atEnd);
    };
    // Following: the newest line in sight after each change.
    useLayoutEffect(() => {
        const element = scroller.current;
        if (!following || !element)
            return;
        element.scrollTop = element.scrollHeight;
        readSight();
    });
    // A match brought into sight: first where its block says, then exactly, once it is drawn.
    useLayoutEffect(() => {
        const element = scroller.current;
        if (target === null || !element)
            return;
        const block = Math.floor((firstLine + target) / LOG_BLOCK) - firstBlock;
        let offset = 0;
        for (let index = 0; index < block; index++)
            offset += heightOf(index);
        offset += (target - range(block)[0]) * LINE;
        const view = element.clientHeight || UNMEASURED_VIEW;
        element.scrollTop = Math.max(0, offset - view / 2);
        setSight({ top: element.scrollTop, view: element.clientHeight });
        // oxlint-disable-next-line react-hooks/exhaustive-deps -- placed once per target; heights are read as they are
    }, [target]);
    useEffect(() => {
        if (target === null)
            return;
        const line = scroller.current?.querySelector(`[data-line="${firstLine + target + 1}"]`);
        line?.scrollIntoView?.({ block: 'nearest' });
    });
    const reveal = (index) => {
        setFollowing(false);
        setTarget(index);
    };
    const search = (value) => {
        setQuery(value);
        setCurrent(0);
        const matches = findInLog(shown, value);
        if (matches.length)
            reveal(matches[0]);
    };
    const go = (step) => {
        if (!found.length)
            return;
        const next = (current + step + found.length) % found.length;
        setCurrent(next);
        reveal(found[next]);
    };
    const download = () => {
        const url = URL.createObjectURL(new Blob([`${shown.join('\n')}\n`], { type: 'text/plain;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = downloadName;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
    };
    const currentLine = found.length ? found[Math.min(current, found.length - 1)] : null;
    const view = { height: typeof height === 'number' ? `${height}px` : height };
    const width = wrap ? undefined : { minWidth: `calc(3.5rem + ${longest}ch + 1.5rem)` };
    return (_jsxs("section", { "aria-label": label, className: cn('relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface', className), children: [_jsxs("div", { className: "flex flex-wrap items-center gap-1.5 border-b border-border py-1.5 pl-3 pr-1.5", children: [_jsx("span", { className: "mr-auto min-w-0 truncate text-xs font-medium text-foreground", children: label }), _jsx("div", { className: "w-48 max-w-full", children: _jsx(FieldContext.Provider, { value: null, children: _jsx(Input, { "aria-label": words.search(label), placeholder: words.searchPlaceholder, leftIcon: _jsx(Search, { className: "size-3.5" }), value: query, className: "h-8", onChange: (event) => search(event.target.value), onKeyDown: (event) => {
                                    if (event.key !== 'Enter')
                                        return;
                                    event.preventDefault();
                                    go(event.shiftKey ? -1 : 1);
                                } }) }) }), _jsx("span", { role: "status", className: "min-w-14 text-center text-xs tabular-nums text-muted-foreground", children: query.trim() ? (found.length ? words.matchPosition({ index: Math.min(current, found.length - 1) + 1, count: found.length }) : words.noMatch) : '' }), _jsx(IconButton, { label: words.previousMatch, hint: words.previousMatchHint('Shift+Enter'), icon: _jsx(ChevronUp, {}), disabled: !found.length, onClick: () => go(-1), className: cn('size-8', DISABLED) }), _jsx(IconButton, { label: words.nextMatch, hint: words.nextMatchHint('Enter'), icon: _jsx(ChevronDown, {}), disabled: !found.length, onClick: () => go(1), className: cn('size-8', DISABLED) }), _jsx(IconButton, { label: words.wrap, hint: wrap ? words.wrapped : words.unwrapped, icon: _jsx(WrapText, {}), "aria-pressed": wrap, onClick: () => setWrap((was) => !was), className: cn('size-8', wrap && 'bg-surface-hover text-foreground') }), _jsx(CopyButton, { value: () => shown.join('\n'), label: words.copy, size: "sm" }), _jsx(IconButton, { label: words.download, hint: words.downloadAs(downloadName), icon: _jsx(Download, {}), onClick: download, disabled: !shown.length, className: cn('size-8', DISABLED) })] }), dropped > 0 && (_jsx("p", { className: "border-b border-border px-3 py-1 text-xs text-muted-foreground", children: words.dropped(dropped) })), _jsx("div", { ref: scroller, role: "log", "aria-label": label, "aria-live": "off", tabIndex: 0, style: view, onScroll: onScroll, className: "overflow-auto font-mono text-[13px] leading-5 text-foreground", children: shown.length === 0 ? (_jsx("p", { className: "p-4 font-sans text-sm text-muted-foreground", children: emptyText ?? words.empty })) : (_jsxs("div", { style: width, className: "py-1.5", children: [_jsx("div", { "aria-hidden": true, style: { height: before } }), Array.from({ length: last - first + 1 }, (_, offset) => {
                            const block = first + offset;
                            const [start, end] = range(block);
                            return (_jsx("div", { ref: watch, "data-block": firstBlock + block, "data-count": end - start, children: shown.slice(start, end).map((line, at) => {
                                    const index = start + at;
                                    const level = logLevel(line);
                                    const isCurrent = index === currentLine;
                                    return (_jsxs("div", { "data-line": firstLine + index + 1, className: cn('flex', wrap ? 'min-h-5' : 'h-5', level && LEVEL_EDGE[level], isCurrent && 'bg-surface-hover'), children: [_jsx("span", { "aria-hidden": true, className: "w-14 shrink-0 select-none pr-3 text-right tabular-nums text-muted-foreground", children: firstLine + index + 1 }), _jsx("span", { className: cn('min-w-0 flex-1 pr-6', wrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre', level && LEVEL_TEXT[level]), children: line === ''
                                                    ? '​'
                                                    : query.trim()
                                                        ? matchParts(line, query).map((part, at) => part.match ? (_jsx("mark", { className: cn('rounded-sm text-inherit', isCurrent ? 'bg-(--warning)/40' : 'bg-(--warning)/20'), children: part.text }, at)) : (part.text))
                                                        : line })] }, index));
                                }) }, firstBlock + block));
                        }), _jsx("div", { "aria-hidden": true, style: { height: after } })] })) }), !following && shown.length > 0 && (_jsxs("button", { type: "button", onClick: () => {
                    setTarget(null);
                    setFollowing(true);
                }, className: cn('absolute bottom-3 right-4 flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium text-foreground shadow-subtle transition hover:bg-surface-hover focus-ring', PRESSABLE), children: [_jsx(ArrowDownToLine, { className: "size-3.5", "aria-hidden": true }), words.jumpToEnd] }))] }));
}
