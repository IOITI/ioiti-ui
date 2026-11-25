import type { ReactNode } from 'react';
/** The props of `Kbd`. */
export interface KbdProps {
    /**
     * The keys of a shortcut, as `useShortcut` takes them: `mod+k` (⌘K on an Apple computer, Ctrl K
     * elsewhere), `shift+?`, `g o` (G, then O).
     */
    keys?: string;
    /** A key named as it is, where there are no `keys`: `<Kbd>Esc</Kbd>` (`keys="escape"` names it in the provider's language). */
    children?: ReactNode;
    className?: string;
}
/**
 * A key to press, or the keys of a shortcut, as this computer writes them, named in the provider's language (« Maj »,
 * « Échap »): Apple's symbols stay symbols, said in its words.
 */
export declare function Kbd({ keys, children, className }: KbdProps): import("react").JSX.Element;
