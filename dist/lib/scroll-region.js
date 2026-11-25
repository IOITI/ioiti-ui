// A region that scrolls and holds nothing the keyboard reaches (a table wider than its frame, code taller than its box,
// a page of text) is a stop of the keyboard itself while it scrolls: tabbed to, its arrows scroll it, and a screen reader
// hears it as a region named by what it holds (WCAG 2.1.1; axe's `scrollable-region-focusable`). What fits is no stop:
// a stop that scrolls nothing is noise. Nor is a region that holds a control (a link, a button, a field): Tab reaches
// it, and the arrows scroll what holds the control that has the focus. Chrome makes the first kind a stop by itself,
// which axe does not see, and Safari does not.
import { useLayoutEffect, useState } from 'react';
import { focusables } from './anchor.js';
/** Whether an element scrolls: what it holds is wider or taller than what it shows. */
const scrolls = (element) => element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
/** Whether an element is drawn: not hidden, nor in a part hidden (a closed one, a folded one). jsdom: always. */
const shown = (element) => element.checkVisibility?.({ visibilityProperty: true }) ?? true;
/** Whether the keyboard reaches a control in an element: one in the tab order, drawn. */
const holdsControl = (element) => focusables(element).some(shown);
/** Attributes that make an element a control of the keyboard, or no longer one. */
const CONTROL_ATTRIBUTES = ['tabindex', 'disabled', 'href', 'hidden', 'inert', 'contenteditable'];
/**
 * Tells `onChange` whether an element is a stop (it scrolls, holding no control), then again as its size changes (the
 * window, a font arriving, rows added) and as what it holds changes. Without ResizeObserver (jsdom), once. Returns what
 * ends the watch.
 */
function watchRegion(element, onChange) {
    const ask = () => onChange(shown(element) && scrolls(element) && !holdsControl(element));
    ask();
    if (typeof ResizeObserver === 'undefined' || typeof MutationObserver === 'undefined')
        return () => { };
    // Its own box (the window, the page around it) and its children's, which are as wide and tall as what it holds.
    const sizes = new ResizeObserver(ask);
    const watchSizes = () => {
        sizes.disconnect();
        sizes.observe(element);
        for (const child of element.children)
            sizes.observe(child);
    };
    watchSizes();
    // What it holds, changed: its children's sizes watched in their turn, asked again once the frame is drawn.
    let frame = 0;
    const content = new MutationObserver((records) => {
        if (records.some((record) => record.type === 'childList' && record.target === element))
            watchSizes();
        if (!frame) {
            frame = requestAnimationFrame(() => {
                frame = 0;
                ask();
            });
        }
    });
    content.observe(element, { childList: true, subtree: true, attributes: true, attributeFilter: CONTROL_ATTRIBUTES });
    return () => {
        cancelAnimationFrame(frame);
        sizes.disconnect();
        content.disconnect();
    };
}
/**
 * The attributes that make a scrolling element (`ref`'s) a stop of the keyboard while it scrolls holding no control, to
 * spread on it (see the top of this file).
 */
export function useScrollRegion(ref, { label, labelledBy, region = true, key } = {}) {
    const [stop, setStop] = useState(false);
    // Before the browser paints: a region that scrolls is never drawn a frame without its name.
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        return watchRegion(element, setStop);
    }, [ref, key]);
    if (!stop)
        return {};
    if (!region)
        return { tabIndex: 0 };
    return labelledBy ? { tabIndex: 0, role: 'region', 'aria-labelledby': labelledBy } : { tabIndex: 0, role: 'region', 'aria-label': label };
}
