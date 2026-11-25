/** Where an error was caught, told with it to the application (IoitiProvider's `onError`). */
export interface ErrorReport {
    /** A boundary around a part of the page (ErrorBoundary, AppShell's around the page), or the router's page of an error. */
    source: 'boundary' | 'route';
    /** The components it was thrown in, as React says them: a boundary's. */
    componentStack?: string;
}
/** What the application reports an error with: to its error tracker, its server's log. */
export type ErrorReporter = (error: unknown, report: ErrorReport) => void;
export declare const ErrorReporterContext: import("react").Context<ErrorReporter | null>;
/** The application's way to report an error (IoitiProvider's `onError`), or none. */
export declare function useErrorReporter(): ErrorReporter | null;
/** Tells the application of an error once: an object already told is not told again. */
export declare function reportOnce(reporter: ErrorReporter | null | undefined, error: unknown, report: ErrorReport): void;
