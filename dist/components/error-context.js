import { createContext, useContext } from 'react';
export const ErrorReporterContext = createContext(null);
/** The application's way to report an error (IoitiProvider's `onError`), or none. */
export function useErrorReporter() {
    return useContext(ErrorReporterContext);
}
// The errors told already: React draws a page twice in StrictMode, and an error may meet two boundaries.
const told = new WeakSet();
/** Tells the application of an error once: an object already told is not told again. */
export function reportOnce(reporter, error, report) {
    if (!reporter)
        return;
    if (error !== null && typeof error === 'object') {
        if (told.has(error))
            return;
        told.add(error);
    }
    reporter(error, report);
}
