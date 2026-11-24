import type { ErrorReport } from 'ioiti-ui'

/**
 * Where the application's errors go: a page that failed to draw or to load, told once by ioiti-ui (IoitiProvider's
 * `onError`, in src/main.tsx), with where it was caught. Send them to your error tracker or your server's log here.
 */
export function reportError(error: unknown, report: ErrorReport): void {
  console.error('A page failed', report.source, error)
}
