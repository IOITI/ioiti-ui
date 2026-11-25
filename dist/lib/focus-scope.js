// What keeps the focus in a layer that holds the page (a dialog, the sidebar's drawer on a phone): moved into it as it
// opens, kept in it by Tab and Shift+Tab, given back to what had it once it closes. One scope keeps it at a time, the
// last one opened: a dialog opened from the drawer keeps it until it closes, then the drawer again (a child sheet, then
// its parent).
//
// A layer beside the page, the page still in use (a sheet without a backdrop: `contain: false`), is a scope that holds
// no page: the focus moved in and given back as well, but Tab goes in and out of it, and its Escape is its own only
// while the focus is in it. A key is for the latest scope opened that holds the page, or the focus.
//
// What floats beside a control in it (a menu, a list of options) is drawn in document.body, outside the scope, and keeps
// its own keys (useAnchoredLayer, anchor.ts): the scope listens on the document as a key bubbles up, after them, and
// leaves a key they took (`defaultPrevented`) alone, and one that composes a character (an IME's Escape).
import { useEffect, useRef } from 'react';
import { focusables } from './anchor.js';
const scopes = [];
/** The scope a key pressed on `target` is for: the latest one opened that holds the page, or the focus. */
function scopeFor(target) {
    return scopes.findLast((scope) => scope.holdsPage() || (target instanceof Node && scope.layer.contains(target)));
}
/**
 * The layer that keeps the focus now (the latest one opened that holds the page), if one does: what is said goes in it
 * (announce.ts).
 */
export function currentFocusScope() {
    return scopes.findLast((scope) => scope.holdsPage())?.layer ?? null;
}
/** The stops of the keyboard in a layer, in order (focusables): not what is inert (a sheet under its child). */
function stops(layer) {
    return focusables(layer).filter((element) => !element.closest('[inert]'));
}
/** Whether `node` comes after `other` in the document, not inside it. */
const after = (node, other) => !other.contains(node) && !!(other.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING);
/** Whether `node` comes before `other` in the document, or holds it (the layer itself). */
const before = (node, other) => !!(other.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING);
/** Keeps the focus in `ref`'s element while `active` (see the top of this file). */
export function useFocusScope(ref, { active, initialFocus, restoreFocus = true, onEscape, contain = true, autoFocus = true }) {
    const latest = useRef({ initialFocus, onEscape, restoreFocus, contain, autoFocus });
    useEffect(() => {
        latest.current = { initialFocus, onEscape, restoreFocus, contain, autoFocus };
    });
    useEffect(() => {
        const layer = ref.current;
        if (!active || !layer)
            return;
        const had = document.activeElement;
        const opener = had instanceof HTMLElement && had !== document.body && !layer.contains(had) ? had : null;
        const scope = { layer, holdsPage: () => latest.current.contain };
        scopes.push(scope);
        // In: unless it is there already (a field given autoFocus), or it stays where it is (`autoFocus: false`).
        if (latest.current.autoFocus && !layer.contains(document.activeElement)) {
            const first = latest.current.initialFocus?.() ?? stops(layer)[0] ?? layer;
            if (first === layer && !layer.hasAttribute('tabindex'))
                layer.tabIndex = -1;
            first.focus({ preventScroll: true });
        }
        const onKeyDown = (event) => {
            if (event.defaultPrevented || event.isComposing || event.keyCode === 229)
                return;
            if (scopeFor(event.target) !== scope)
                return;
            if (event.key === 'Escape') {
                latest.current.onEscape?.(event);
                return;
            }
            if (event.key !== 'Tab' || !latest.current.contain)
                return;
            const items = stops(layer);
            if (!items.length) {
                event.preventDefault();
                layer.focus({ preventScroll: true });
                return;
            }
            const [first, last] = [items[0], items[items.length - 1]];
            // Round to the other end from its last stop (or past it), Shift+Tab from its first (or before it: the layer
            // itself), and from outside it; in between, the browser's own order.
            const current = document.activeElement;
            const wraps = !(current instanceof Node) ||
                !layer.contains(current) ||
                (event.shiftKey ? current === first || before(current, first) : current === last || after(current, last));
            if (!wraps)
                return;
            event.preventDefault();
            const next = event.shiftKey ? last : first;
            next.focus({ preventScroll: true });
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            const at = scopes.indexOf(scope);
            if (at >= 0)
                scopes.splice(at, 1);
            // Back to what had it: unless the focus has gone somewhere of its own (a press elsewhere, a link followed).
            const now = document.activeElement;
            const lost = !now || now === document.body || layer.contains(now);
            if (latest.current.restoreFocus && lost && opener?.isConnected)
                opener.focus({ preventScroll: true });
        };
    }, [active, ref]);
}
