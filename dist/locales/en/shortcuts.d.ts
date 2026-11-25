/** The keyboard shortcuts: ShortcutsDialog, and the shortcuts the package registers itself (the sidebar's ⌘B). */
export declare const shortcuts: {
    /** "Keyboard shortcuts": ShortcutsDialog's title, where it is given none. */
    title: string;
    /** "General": the heading of the shortcuts registered without a group, and of the dialog's own. */
    general: string;
    /** "Navigation": the heading of the shortcuts that move about the application (the sidebar's). */
    navigation: string;
    /** "Show the keyboard shortcuts": what the key that opens the dialog does (`?`), in its list. */
    showShortcuts: string;
    /** "? shows this list again.": under the list, the keys that open it, drawn as key caps where the words put them. */
    showAgain: (keys: string) => string;
    /** "Collapse or expand the sidebar": what the sidebar's ⌘B does (the drawer on a phone). */
    toggleSidebar: string;
};
