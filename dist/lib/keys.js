// The keys of a shortcut, written as a person reads them: `mod+k`, `shift+/`, `g o` (one key, then another).
// `mod` is the key a shortcut uses on this computer: ⌘ on Apple's, Ctrl elsewhere. Nothing here reads the
// browser when it loads: the platform is read when a key is drawn or pressed.
const ALIASES = {
    cmd: 'meta',
    command: 'meta',
    option: 'alt',
    control: 'ctrl',
    esc: 'escape',
    return: 'enter',
    up: 'arrowup',
    down: 'arrowdown',
    left: 'arrowleft',
    right: 'arrowright',
    del: 'delete',
    plus: '+',
};
const MODIFIERS = new Set(['mod', 'ctrl', 'meta', 'alt', 'shift']);
/** Whether the keys are an Apple computer's (⌘ for shortcuts). */
export function isApplePlatform() {
    if (typeof navigator === 'undefined')
        return false;
    const platform = navigator.userAgentData?.platform ?? navigator.platform ?? '';
    return /mac|iphone|ipad|ipod/i.test(platform);
}
/** `"mod+k"` as one stroke, `"g o"` as two pressed one after the other. */
export function parseKeys(keys) {
    return keys
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((stroke) => {
        const parts = stroke.split('+').map((part) => ALIASES[part.toLowerCase()] ?? part.toLowerCase());
        // `mod++` is mod and the plus key: the last part, empty, is the key.
        const key = parts[parts.length - 1] || '+';
        const held = new Set(parts.slice(0, -1).filter((part) => MODIFIERS.has(part)));
        return {
            key: ALIASES[key] ?? key,
            mod: held.has('mod'),
            ctrl: held.has('ctrl'),
            meta: held.has('meta'),
            alt: held.has('alt'),
            shift: held.has('shift'),
        };
    });
}
/** A key as `KeyboardEvent.key` names it, in this file's names: `space`, `escape`, `k`. */
function keyOf(key) {
    const lower = key.toLowerCase();
    if (lower === ' ' || lower === 'spacebar')
        return 'space';
    if (lower === 'esc')
        return 'escape';
    return lower;
}
/**
 * Whether a key pressed is this stroke. A character typed with Shift (`?`) is its own key, Shift not asked
 * of it: write the character (`?`), not the keys that type it on one keyboard (`shift+/`).
 */
export function matchesStroke(event, stroke, apple = isApplePlatform()) {
    if (keyOf(event.key) !== stroke.key)
        return false;
    const ctrl = stroke.ctrl || (stroke.mod && !apple);
    const meta = stroke.meta || (stroke.mod && apple);
    const symbol = stroke.key.length === 1 && !/[a-z0-9]/.test(stroke.key);
    return (event.ctrlKey === ctrl &&
        event.metaKey === meta &&
        event.altKey === stroke.alt &&
        (symbol ? true : event.shiftKey === stroke.shift));
}
const APPLE_MODIFIERS = {
    mod: { shown: '⌘', spoken: 'Command' },
    meta: { shown: '⌘', spoken: 'Command' },
    ctrl: { shown: '⌃', spoken: 'Control' },
    alt: { shown: '⌥', spoken: 'Option' },
    shift: { shown: '⇧', spoken: 'Shift' },
};
const OTHER_MODIFIERS = {
    mod: { shown: 'Ctrl' },
    meta: { shown: 'Meta' },
    ctrl: { shown: 'Ctrl' },
    alt: { shown: 'Alt' },
    shift: { shown: 'Shift' },
};
const NAMED = {
    enter: { shown: '↵', spoken: 'Enter' },
    escape: { shown: 'Esc', spoken: 'Escape' },
    tab: { shown: 'Tab' },
    space: { shown: 'Space' },
    backspace: { shown: '⌫', spoken: 'Backspace' },
    delete: { shown: 'Del', spoken: 'Delete' },
    arrowup: { shown: '↑', spoken: 'Up arrow' },
    arrowdown: { shown: '↓', spoken: 'Down arrow' },
    arrowleft: { shown: '←', spoken: 'Left arrow' },
    arrowright: { shown: '→', spoken: 'Right arrow' },
    pageup: { shown: 'PgUp', spoken: 'Page up' },
    pagedown: { shown: 'PgDn', spoken: 'Page down' },
    home: { shown: 'Home' },
    end: { shown: 'End' },
};
/** The keys of each stroke, as drawn here: modifiers first, in the order this computer writes them. */
export function keyLabels(keys, apple = isApplePlatform()) {
    const modifiers = apple ? APPLE_MODIFIERS : OTHER_MODIFIERS;
    // Apple's order is ⌃⌥⇧⌘; elsewhere Ctrl, Alt, Shift.
    const order = apple ? ['ctrl', 'alt', 'shift', 'meta', 'mod'] : ['mod', 'ctrl', 'meta', 'alt', 'shift'];
    return parseKeys(keys).map((stroke) => {
        const held = order.filter((name) => stroke[name] === true).map((name) => modifiers[name]);
        const key = NAMED[stroke.key] ?? { shown: stroke.key.length === 1 ? stroke.key.toUpperCase() : stroke.key };
        return [...held, key];
    });
}
/** The keys in words, for a screen reader or a sentence: "Command K", "G then O". */
export function describeKeys(keys, apple = isApplePlatform()) {
    return keyLabels(keys, apple)
        .map((stroke) => stroke.map((label) => label.spoken ?? label.shown).join(' '))
        .join(' then ');
}
