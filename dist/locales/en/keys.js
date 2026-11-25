/**
 * Keys as they are shown (Kbd, the hints, the sidebar's tip) and said to a screen reader where a key cap shows a
 * symbol (⌘, ↵); never in aria-keyshortcuts, which names keys in ARIA's English.
 */
export const keys = {
    /** "Ctrl": the Control key on a key cap (a computer that is not Apple's), and in a hint's words. */
    ctrl: 'Ctrl',
    /** "Alt": the Alt key. */
    alt: 'Alt',
    /** "Shift": the Shift key on a key cap, and Apple's ⇧ said. */
    shift: 'Shift',
    /** "Meta": the Meta key (the Windows key) on a computer that is not Apple's. */
    meta: 'Meta',
    /** "Command": Apple's ⌘, said. */
    command: 'Command',
    /** "Control": Apple's ⌃, said. */
    control: 'Control',
    /** "Option": Apple's ⌥, said. */
    option: 'Option',
    /** "Enter": the Enter key said (a key cap draws ↵), and named in a hint ("Shift+Enter"). */
    enter: 'Enter',
    /** "Esc": the Escape key on a key cap. */
    escape: 'Esc',
    /** "Escape": the Escape key, said. */
    escapeSpoken: 'Escape',
    /** "Tab": the Tab key. */
    tab: 'Tab',
    /** "Space": the space bar. */
    space: 'Space',
    /** "Backspace": the key that deletes backwards, said (a key cap draws ⌫). */
    backspace: 'Backspace',
    /** "Del": the Delete key on a key cap. */
    delete: 'Del',
    /** "Delete": the Delete key, said. */
    deleteSpoken: 'Delete',
    /** "Up arrow": ↑, said. */
    arrowUp: 'Up arrow',
    /** "Down arrow": ↓, said. */
    arrowDown: 'Down arrow',
    /** "Left arrow": ←, said. */
    arrowLeft: 'Left arrow',
    /** "Right arrow": →, said. */
    arrowRight: 'Right arrow',
    /** "PgUp": the Page Up key on a key cap. */
    pageUp: 'PgUp',
    /** "Page up": the Page Up key, said. */
    pageUpSpoken: 'Page up',
    /** "PgDn": the Page Down key on a key cap. */
    pageDown: 'PgDn',
    /** "Page down": the Page Down key, said. */
    pageDownSpoken: 'Page down',
    /** "Home": the Home key. */
    home: 'Home',
    /** "End": the End key. */
    end: 'End',
    /** "then": between the keys of a sequence, pressed one after the other ("G then O"). */
    then: 'then',
};
