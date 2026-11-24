import { Component } from 'react'
import type { ContextType, ErrorInfo, ReactNode } from 'react'

import { ErrorState } from '../shell/ErrorState.js'
import { ErrorReporterContext, reportOnce } from './error-context.js'

/** What a boundary's fallback is given: what was thrown, and the way to draw what failed again. */
export interface ErrorFallbackProps {
  error: unknown
  /** Draws what failed again (Try again): it may work now. */
  reset: () => void
}

export interface ErrorBoundaryProps {
  children: ReactNode
  /**
   * What is shown in place of what failed: a node, or a function given the error and `reset`. By default an
   * ErrorState of a part of a page, its Try again drawing it again.
   */
  fallback?: ReactNode | ((props: ErrorFallbackProps) => ReactNode)
  /** Told of the error as it is caught, with the components it was thrown in; IoitiProvider's `onError` is told too. */
  onError?: (error: unknown, info: { componentStack?: string }) => void
  /** Values which, once one changes, draw what failed again by themselves: the page's address (AppShell's). */
  resetKeys?: readonly unknown[]
}

interface ErrorBoundaryState {
  failed: boolean
  error: unknown
}

const changed = (before: readonly unknown[] = [], after: readonly unknown[] = []) =>
  before.length !== after.length || before.some((value, index) => !Object.is(value, after[index]))

/**
 * What keeps a part of a page from taking the page down with it when it throws as it draws: the part shows what went
 * wrong (an ErrorState, or `fallback`) and the rest stays. The error is told to the application once (IoitiProvider's
 * `onError`). AppShell puts one around the page, the sidebar and top bar kept.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = ErrorReporterContext
  declare context: ContextType<typeof ErrorReporterContext>

  state: ErrorBoundaryState = { failed: false, error: undefined }

  // Whether the fallback's Try again drew it again: failed once more, its error's heading takes the focus, which the
  // Try again pressed had (it would be lost with it).
  private retried = false

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { failed: true, error }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    const componentStack = info.componentStack ?? undefined
    this.props.onError?.(error, { componentStack })
    reportOnce(this.context, error, { source: 'boundary', componentStack })
  }

  componentDidUpdate(before: ErrorBoundaryProps) {
    if (this.state.failed && changed(before.resetKeys, this.props.resetKeys)) this.reset()
    if (!this.state.failed) this.retried = false
  }

  reset = () => {
    this.setState({ failed: false, error: undefined })
  }

  private retry = () => {
    this.retried = true
    this.reset()
  }

  render() {
    if (!this.state.failed) return this.props.children
    const { fallback } = this.props
    if (typeof fallback === 'function') return fallback({ error: this.state.error, reset: this.reset })
    if (fallback !== undefined) return fallback
    return <ErrorState page={false} error={this.state.error} onRetry={this.retry} focusOnMount={this.retried} />
  }
}
