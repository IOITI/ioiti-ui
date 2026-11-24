import { createContext, useContext, useEffect, useRef } from 'react';
import { matchesStroke, parseKeys } from '../lib/keys.js';
/** How long a key of a sequence ("g", then "o") waits for the next. */
const SEQUENCE_WAIT = 1000;
function typing(target) {
    if (!(target instanceof HTMLElement))
        return false;
    if (target.isContentEditable)
        return true;
    const tag = target.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT')
        return true;
    if (tag !== 'INPUT')
        return false;
    const type = target.type;
    return !['button', 'checkbox', 'radio', 'range', 'submit', 'reset', 'color', 'file'].includes(type);
}
export function createShortcutRegistry() {
    const entries = new Map();
    const listeners = new Set();
    let next = 0;
    let snapshot = [];
    let pressed = [];
    const changed = () => {
        snapshot = Array.from(entries.values());
        for (const listener of listeners)
            listener();
    };
    const onKeyDown = (event) => {
        if (event.defaultPrevented || ['Shift', 'Control', 'Alt', 'Meta'].includes(event.key))
            return;
        // A dialog is open: its keys are its own.
        if (document.querySelector('[aria-modal="true"]'))
            return;
        const now = event.timeStamp;
        pressed = [...pressed.filter((each) => now - each.at < SEQUENCE_WAIT), { stroke: event, at: now }].slice(-3);
        const inText = typing(event.target);
        for (const entry of entries.values()) {
            if (!entry.handler)
                continue;
            const held = entry.strokes.some((stroke) => stroke.mod || stroke.ctrl || stroke.meta);
            if (inText && !held && !entry.allowInInputs)
                continue;
            const last = pressed.slice(-entry.strokes.length);
            if (last.length !== entry.strokes.length)
                continue;
            if (!entry.strokes.every((stroke, index) => matchesStroke(last[index].stroke, stroke)))
                continue;
            event.preventDefault();
            pressed = [];
            entry.handler(event);
            return;
        }
    };
    return {
        register(shortcut) {
            const id = ++next;
            entries.set(id, { ...shortcut, id, strokes: parseKeys(shortcut.keys) });
            if (entries.size === 1)
                window.addEventListener('keydown', onKeyDown);
            changed();
            return () => {
                entries.delete(id);
                if (entries.size === 0)
                    window.removeEventListener('keydown', onKeyDown);
                changed();
            };
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        list: () => snapshot,
    };
}
// Outside IoitiProvider (a component rendered alone): one registry for the page.
export const ShortcutsContext = createContext(createShortcutRegistry());
/** The registry of the application's shortcuts. */
export function useShortcutRegistry() {
    return useContext(ShortcutsContext);
}
/**
 * A keyboard shortcut, heard while the component that registers it is there: `mod+k` (⌘K or Ctrl K),
 * `g o` (G, then O), `?`. Given a description, ShortcutsDialog lists it. Keys without ⌘ or Ctrl are not
 * heard while text is typed, nor any while a dialog is open.
 */
export function useShortcut(keys, handler, options = {}) {
    const registry = useShortcutRegistry();
    const { description, group, enabled = true, allowInInputs = false } = options;
    // The latest handler, without registering again at each render.
    const latest = useRef(handler);
    useEffect(() => {
        latest.current = handler;
    });
    const handles = handler !== null;
    useEffect(() => {
        if (!enabled)
            return;
        return registry.register({
            keys,
            description,
            group,
            allowInInputs,
            handler: handles ? (event) => latest.current?.(event) : null,
        });
    }, [registry, keys, description, group, enabled, allowInInputs, handles]);
}
