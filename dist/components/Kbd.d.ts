import type { ReactNode } from 'react';
interface KbdProps {
    /**
     * The keys of a shortcut, as `useShortcut` takes them: `mod+k` (⌘K on an Apple computer, Ctrl K
     * elsewhere), `shift+?`, `g o` (G, then O).
     */
    keys?: string;
    /** A key named as it is, where there are no `keys`: `<Kbd>Esc</Kbd>`. */
    children?: ReactNode;
    className?: string;
}
/** A key to press, or the keys of a shortcut, as this computer writes them. */
export declare function Kbd({ keys, children, className }: KbdProps): import("react").JSX.Element;
export {};
