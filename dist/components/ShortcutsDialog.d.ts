interface ShortcutsDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    /** The key that opens it; `null` for none (a button of the application's opens it). */
    keys?: string | null;
}
/**
 * The application's keyboard shortcuts, listed by group with their keys: those registered with a
 * description (`useShortcut`), while the parts that register them are on the page. `?` opens it, once
 * there is a shortcut to list; AppShell draws it.
 */
export declare function ShortcutsDialog({ open, onOpenChange, title, keys }: ShortcutsDialogProps): import("react").JSX.Element;
export {};
