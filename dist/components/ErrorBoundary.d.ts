import { Component } from 'react';
import type { ContextType, ErrorInfo, ReactNode } from 'react';
import { ErrorReporterContext } from './error-context.js';
/** What a boundary's fallback is given: what was thrown, and the way to draw what failed again. */
export interface ErrorFallbackProps {
    error: unknown;
    /** Draws what failed again (Try again): it may work now. */
    reset: () => void;
}
export interface ErrorBoundaryProps {
    children: ReactNode;
    /**
     * What is shown in place of what failed: a node, or a function given the error and `reset`. By default an
     * ErrorState of a part of a page, its Try again drawing it again.
     */
    fallback?: ReactNode | ((props: ErrorFallbackProps) => ReactNode);
    /** Told of the error as it is caught, with the components it was thrown in; IoitiProvider's `onError` is told too. */
    onError?: (error: unknown, info: {
        componentStack?: string;
    }) => void;
    /** Values which, once one changes, draw what failed again by themselves: the page's address (AppShell's). */
    resetKeys?: readonly unknown[];
}
interface ErrorBoundaryState {
    failed: boolean;
    error: unknown;
}
/**
 * What keeps a part of a page from taking the page down with it when it throws as it draws: the part shows what went
 * wrong (an ErrorState, or `fallback`) and the rest stays. The error is told to the application once (IoitiProvider's
 * `onError`). AppShell puts one around the page, the sidebar and top bar kept.
 */
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static contextType: import("react").Context<import("./error-context.js").ErrorReporter | null>;
    context: ContextType<typeof ErrorReporterContext>;
    state: ErrorBoundaryState;
    private retried;
    static getDerivedStateFromError(error: unknown): ErrorBoundaryState;
    componentDidCatch(error: unknown, info: ErrorInfo): void;
    componentDidUpdate(before: ErrorBoundaryProps): void;
    reset: () => void;
    private retry;
    render(): string | number | bigint | boolean | import("react").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
}
export {};
