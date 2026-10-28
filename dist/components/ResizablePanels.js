import { jsx as _jsx } from "react/jsx-runtime";
import { Children, isValidElement, useId, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils.js';
/** A panel of `ResizablePanels`: its content scrolls inside it. */
export function ResizablePanel(props) {
    // Drawn by ResizablePanels, which gives it its size.
    void props;
    return null;
}
/** The handle between two panels: dragged, or moved with the arrow keys once it has the focus. */
export function ResizableHandle(props) {
    void props;
    return null;
}
const STEP = 2;
const BIG_STEP = 10;
const round = (value) => Math.round(value * 100) / 100;
/**
 * Panels side by side, or one over the other, each sized by the handle between them: dragged, or with the
 * arrow keys once it has the focus (Shift for more, Home and End to the ends, Enter to fold a panel away,
 * a double click back to the first sizes). A separator with its value to a screen reader. As Elastic UI's
 * resizable container does.
 */
export function ResizablePanels({ direction = 'horizontal', onSizesChange, stackBelow, className, children }) {
    const items = Children.toArray(children).filter(isValidElement);
    const panels = items.filter((item) => item.type === ResizablePanel);
    const defaults = panels.map((panel) => panel.props.defaultSize);
    const [sizes, setSizes] = useState(defaults);
    const [folded, setFolded] = useState({});
    const id = useId();
    const box = useRef(null);
    const drag = useRef(null);
    const horizontal = direction === 'horizontal';
    // Narrower than `stackBelow`: one under the other.
    const [stacked, setStacked] = useState(false);
    useLayoutEffect(() => {
        const element = box.current;
        if (!element || stackBelow === undefined)
            return;
        const measure = () => setStacked(element.clientWidth > 0 && element.clientWidth < stackBelow);
        measure();
        if (typeof ResizeObserver === 'undefined')
            return;
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [stackBelow]);
    const bounds = (index) => ({
        min: panels[index]?.props.minSize ?? 5,
        max: panels[index]?.props.maxSize ?? 95,
    });
    /** Moves the edge after panel `index` so that it takes `size`, the panel after it the rest of their two. */
    const resize = (index, size, from = sizes, commit = true) => {
        const pair = from[index] + from[index + 1];
        const first = bounds(index);
        const second = bounds(index + 1);
        const low = Math.max(first.min, pair - second.max);
        const high = Math.min(first.max, pair - second.min);
        const next = Math.min(Math.max(size, low), high);
        const updated = from.map((each, at) => (at === index ? round(next) : at === index + 1 ? round(pair - next) : each));
        setSizes(updated);
        setFolded({});
        if (commit)
            onSizesChange?.(updated);
        return updated;
    };
    /** Folds away the collapsible panel beside the edge after `index`, or unfolds it. */
    const fold = (index) => {
        const target = panels[index]?.props.collapsible ? index : panels[index + 1]?.props.collapsible ? index + 1 : null;
        if (target === null)
            return;
        const other = target === index ? index + 1 : index;
        const before = folded[target];
        const updated = before !== undefined
            ? sizes.map((each, at) => (at === target ? before : at === other ? round(each - before) : each))
            : sizes.map((each, at) => (at === target ? 0 : at === other ? round(each + sizes[target]) : each));
        setSizes(updated);
        setFolded(before !== undefined ? {} : { [target]: sizes[target] });
        onSizesChange?.(updated);
    };
    const onKeyDown = (event, index) => {
        const by = event.shiftKey ? BIG_STEP : STEP;
        const grow = horizontal ? 'ArrowRight' : 'ArrowDown';
        const shrink = horizontal ? 'ArrowLeft' : 'ArrowUp';
        if (event.key === grow)
            resize(index, sizes[index] + by);
        else if (event.key === shrink)
            resize(index, sizes[index] - by);
        else if (event.key === 'Home')
            resize(index, 0);
        else if (event.key === 'End')
            resize(index, 100);
        else if (event.key === 'Enter')
            fold(index);
        else
            return;
        event.preventDefault();
    };
    const onPointerDown = (event, index) => {
        const element = box.current;
        if (!element || event.button !== 0)
            return;
        event.preventDefault();
        // The room the panels share: the box, less its handles.
        const handles = Array.from(element.querySelectorAll(':scope > [role="separator"]'));
        const taken = handles.reduce((sum, handle) => sum + (horizontal ? handle.offsetWidth : handle.offsetHeight), 0);
        const room = Math.max((horizontal ? element.clientWidth : element.clientHeight) - taken, 1);
        drag.current = { index, start: horizontal ? event.clientX : event.clientY, sizes, room };
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event) => {
        const moving = drag.current;
        if (!moving)
            return;
        const moved = ((horizontal ? event.clientX : event.clientY) - moving.start) / moving.room * 100;
        resize(moving.index, moving.sizes[moving.index] + moved, moving.sizes, false);
    };
    const onPointerUp = () => {
        if (!drag.current)
            return;
        drag.current = null;
        onSizesChange?.(sizes);
    };
    // The place of each panel and handle among its kind.
    const nth = (at) => items.slice(0, at).filter((each) => each.type === items[at].type).length;
    return (_jsx("div", { ref: box, className: cn('flex min-h-0 min-w-0', horizontal && !stacked ? 'flex-row' : 'flex-col', className), children: items.map((item, at) => {
            if (item.type === ResizablePanel) {
                const index = nth(at);
                const panel = item.props;
                return (_jsx("div", { id: `${id}-${index}`, className: cn('min-h-0 min-w-0 overflow-auto', folded[index] !== undefined && 'invisible', panel.className), style: stacked ? undefined : { flex: `${sizes[index]} 1 0px` }, children: panel.children }, item.key ?? `panel-${index}`));
            }
            if (item.type === ResizableHandle) {
                const index = nth(at);
                if (stacked)
                    return null;
                const handle = item.props;
                const { min, max } = bounds(index);
                return (_jsx("div", { role: "separator", tabIndex: 0, "aria-label": handle.label ?? (panels[index]?.props.label ? `Resize ${panels[index].props.label}` : 'Resize'), "aria-controls": `${id}-${index}`, "aria-orientation": horizontal ? 'vertical' : 'horizontal', "aria-valuenow": Math.round(sizes[index]), "aria-valuemin": min, "aria-valuemax": max, onKeyDown: (event) => onKeyDown(event, index), onPointerDown: (event) => onPointerDown(event, index), onPointerMove: onPointerMove, onPointerUp: onPointerUp, onPointerCancel: onPointerUp, onDoubleClick: () => {
                        setSizes(defaults);
                        setFolded({});
                        onSizesChange?.(defaults);
                    }, className: cn('group relative flex shrink-0 touch-none select-none items-center justify-center', horizontal ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize'), children: _jsx("span", { "aria-hidden": true, className: cn('rounded-full bg-border transition-colors group-hover:bg-border-hover group-active:bg-foreground/40 accent:group-active:bg-brand', horizontal ? 'h-full w-px group-hover:w-0.5' : 'h-px w-full group-hover:h-0.5') }) }, item.key ?? `handle-${index}`));
            }
            return item;
        }) }));
}
