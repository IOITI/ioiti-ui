/**
 * - `chunk`: a part of the application that failed to load, most often because a new version was published since the
 *   page was opened (its files renamed): reloading gets the new one.
 * - `offline`: the server could not be reached (no network, a server down): trying again later may do.
 * - `other`: anything else, a fault of the page: trying again may do, else it is the application's to mend.
 */
export type ErrorKind = 'chunk' | 'offline' | 'other';
/** The kind of a thrown error (see ErrorKind). */
export declare function errorKind(error: unknown): ErrorKind;
/** What an error says of itself: its message, a string thrown, or nothing. */
export declare function errorMessage(error: unknown): string;
/** What a developer reads of it, under "Details" in development: its name and message, then its stack. */
export declare function errorDetails(error: unknown): string;
