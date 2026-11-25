/** The props of `ShortcutsDialog`. */
export interface ShortcutsDialogProps {
    /** Open, held by the page (told of each change by `onOpenChange`). */
    open?: boolean;
    /** Open at first, the dialog holding it then; closed by default. */
    defaultOpen?: boolean;
    /** Told of every change, whoever holds it: its keys open it and close it, as Escape does. */
    onOpenChange?: (open: boolean) => void;
    /** Its title; the provider's language's by default ("Keyboard shortcuts"). */
    title?: string;
    /** The key that opens it; `null` for none (a button of the application's opens it). */
    keys?: string | null;
}
/**
 * The application's keyboard shortcuts, listed by group with their keys: those registered with a
 * description (`useShortcut`), while the parts that register them are on the page. `?` opens and closes it, once
 * there is a shortcut to list; AppShell draws it.
 */
export declare function ShortcutsDialog({ open, defaultOpen, onOpenChange, title: givenTitle, keys }: ShortcutsDialogProps): import("react").JSX.Element;
