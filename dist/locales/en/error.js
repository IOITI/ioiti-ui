/**
 * ErrorState (and through it ErrorBoundary, AppShell's boundary): what went wrong, by its kind (`ErrorKind`: `other`,
 * `offline`, `chunk`), and the way on.
 */
export const error = {
    /** "Something went wrong": the heading of a page that failed. */
    otherPage: 'Something went wrong',
    /** "This part could not be shown": the heading of a part of a page that failed. */
    otherPart: 'This part could not be shown',
    /** "Try again; if it fails again, come back to it later.": what to do, with a Try again. */
    otherRetry: 'Try again; if it fails again, come back to it later.',
    /** "Come back to it later; if it fails again, tell whoever runs the application.": what to do, with nothing to press. */
    otherWait: 'Come back to it later; if it fails again, tell whoever runs the application.',
    /** "The server could not be reached": the heading of a page the server did not answer. */
    offlinePage: 'The server could not be reached',
    /** "The server could not be reached": the heading of a part of a page the server did not answer. */
    offlinePart: 'The server could not be reached',
    /** "Check the connection, then try again.": what to do, with a Try again. */
    offlineRetry: 'Check the connection, then try again.',
    /** "Check the connection, then come back to it.": what to do, with nothing to press. */
    offlineWait: 'Check the connection, then come back to it.',
    /** "This page could not be loaded": the heading of a page whose code did not load (a new version published). */
    chunkPage: 'This page could not be loaded',
    /** "This part could not be loaded": the heading of a part of a page whose code did not load. */
    chunkPart: 'This part could not be loaded',
    /** "A new version of the application may have been published since this page was opened: reloading gets it.": why, and what Reload does. */
    chunkReload: 'A new version of the application may have been published since this page was opened: reloading gets it.',
    /** "Try again": the button that tries again. */
    tryAgain: 'Try again',
    /** "Reload": the button that reloads the page, for code that did not load. */
    reload: 'Reload',
    /** "Back to home": the way home of a page that failed, where it is given none. */
    backToHome: 'Back to home',
    /** "Details": what a developer reads of the error, in development (a disclosure, and the name of its text). */
    details: 'Details',
};
