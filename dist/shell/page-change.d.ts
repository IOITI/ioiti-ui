/**
 * Whether this render shows another page than the one on screen: its address changed. A change of
 * the query alone is none, nor is the page's own (a filter, a refresh, a tab), even in a transition.
 * The shell moves the page only then (AppShell, src/styles/motion.css).
 */
export declare function usePageChanged(pathname: string): boolean;
