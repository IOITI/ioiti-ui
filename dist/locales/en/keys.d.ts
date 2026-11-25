/**
 * Keys as they are shown (Kbd, the hints, the sidebar's tip) and said to a screen reader where a key cap shows a
 * symbol (⌘, ↵); never in aria-keyshortcuts, which names keys in ARIA's English.
 */
export declare const keys: {
    /** "Ctrl": the Control key on a key cap (a computer that is not Apple's), and in a hint's words. */
    ctrl: string;
    /** "Alt": the Alt key. */
    alt: string;
    /** "Shift": the Shift key on a key cap, and Apple's ⇧ said. */
    shift: string;
    /** "Meta": the Meta key (the Windows key) on a computer that is not Apple's. */
    meta: string;
    /** "Command": Apple's ⌘, said. */
    command: string;
    /** "Control": Apple's ⌃, said. */
    control: string;
    /** "Option": Apple's ⌥, said. */
    option: string;
    /** "Enter": the Enter key said (a key cap draws ↵), and named in a hint ("Shift+Enter"). */
    enter: string;
    /** "Esc": the Escape key on a key cap. */
    escape: string;
    /** "Escape": the Escape key, said. */
    escapeSpoken: string;
    /** "Tab": the Tab key. */
    tab: string;
    /** "Space": the space bar. */
    space: string;
    /** "Backspace": the key that deletes backwards, said (a key cap draws ⌫). */
    backspace: string;
    /** "Del": the Delete key on a key cap. */
    delete: string;
    /** "Delete": the Delete key, said. */
    deleteSpoken: string;
    /** "Up arrow": ↑, said. */
    arrowUp: string;
    /** "Down arrow": ↓, said. */
    arrowDown: string;
    /** "Left arrow": ←, said. */
    arrowLeft: string;
    /** "Right arrow": →, said. */
    arrowRight: string;
    /** "PgUp": the Page Up key on a key cap. */
    pageUp: string;
    /** "Page up": the Page Up key, said. */
    pageUpSpoken: string;
    /** "PgDn": the Page Down key on a key cap. */
    pageDown: string;
    /** "Page down": the Page Down key, said. */
    pageDownSpoken: string;
    /** "Home": the Home key. */
    home: string;
    /** "End": the End key. */
    end: string;
    /** "then": between the keys of a sequence, pressed one after the other ("G then O"). */
    then: string;
};
