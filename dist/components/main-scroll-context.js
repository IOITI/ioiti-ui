import { createContext, useContext } from 'react';
/** The shell's <main>: the page scrolls in it, not in the window. What follows the scroll reads it here. */
export const MainScrollContext = createContext(null);
/** The element the page scrolls in; null outside the shell (the tests of a page alone). */
export function useMainScroll() {
    return useContext(MainScrollContext);
}
