/**
 * ErrorState (and through it ErrorBoundary, AppShell's boundary): what went wrong, by its kind (`ErrorKind`: `other`,
 * `offline`, `chunk`), and the way on.
 */
export declare const error: {
    /** "Something went wrong": the heading of a page that failed. */
    otherPage: string;
    /** "This part could not be shown": the heading of a part of a page that failed. */
    otherPart: string;
    /** "Try again; if it fails again, come back to it later.": what to do, with a Try again. */
    otherRetry: string;
    /** "Come back to it later; if it fails again, tell whoever runs the application.": what to do, with nothing to press. */
    otherWait: string;
    /** "The server could not be reached": the heading of a page the server did not answer. */
    offlinePage: string;
    /** "The server could not be reached": the heading of a part of a page the server did not answer. */
    offlinePart: string;
    /** "Check the connection, then try again.": what to do, with a Try again. */
    offlineRetry: string;
    /** "Check the connection, then come back to it.": what to do, with nothing to press. */
    offlineWait: string;
    /** "This page could not be loaded": the heading of a page whose code did not load (a new version published). */
    chunkPage: string;
    /** "This part could not be loaded": the heading of a part of a page whose code did not load. */
    chunkPart: string;
    /** "A new version of the application may have been published since this page was opened: reloading gets it.": why, and what Reload does. */
    chunkReload: string;
    /** "Try again": the button that tries again. */
    tryAgain: string;
    /** "Reload": the button that reloads the page, for code that did not load. */
    reload: string;
    /** "Back to home": the way home of a page that failed, where it is given none. */
    backToHome: string;
    /** "Details": what a developer reads of the error, in development (a disclosure, and the name of its text). */
    details: string;
};
