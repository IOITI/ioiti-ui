import type { RefObject } from 'react';
/** The shell's <main>: the page scrolls in it, not in the window. What follows the scroll reads it here. */
export declare const MainScrollContext: import("react").Context<RefObject<HTMLElement | null> | null>;
/** The element the page scrolls in; null outside the shell (the tests of a page alone). */
export declare function useMainScroll(): RefObject<HTMLElement | null> | null;
