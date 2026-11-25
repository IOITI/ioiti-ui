import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import { ErrorState } from '../shell/ErrorState.js';
import { ErrorReporterContext, reportOnce } from './error-context.js';
const changed = (before = [], after = []) => before.length !== after.length || before.some((value, index) => !Object.is(value, after[index]));
/**
 * What keeps a part of a page from taking the page down with it when it throws as it draws: the part shows what went
 * wrong (an ErrorState, or `fallback`) and the rest stays. The error is told to the application once (IoitiProvider's
 * `onError`). AppShell puts one around the page, the sidebar and top bar kept.
 */
export class ErrorBoundary extends Component {
    static contextType = ErrorReporterContext;
    state = { failed: false, error: undefined };
    // Whether the fallback's Try again drew it again: failed once more, its error's heading takes the focus, which the
    // Try again pressed had (it would be lost with it).
    retried = false;
    static getDerivedStateFromError(error) {
        return { failed: true, error };
    }
    componentDidCatch(error, info) {
        const componentStack = info.componentStack ?? undefined;
        this.props.onError?.(error, { componentStack });
        reportOnce(this.context, error, { source: 'boundary', componentStack });
    }
    componentDidUpdate(before) {
        if (this.state.failed && changed(before.resetKeys, this.props.resetKeys))
            this.reset();
        if (!this.state.failed)
            this.retried = false;
    }
    reset = () => {
        this.setState({ failed: false, error: undefined });
    };
    retry = () => {
        this.retried = true;
        this.reset();
    };
    render() {
        if (!this.state.failed)
            return this.props.children;
        const { fallback } = this.props;
        if (typeof fallback === 'function')
            return fallback({ error: this.state.error, reset: this.reset });
        if (fallback !== undefined)
            return fallback;
        return _jsx(ErrorState, { page: false, error: this.state.error, onRetry: this.retry, focusOnMount: this.retried });
    }
}
