// What a thrown error is, as a page that failed says it: what the person can do about it depends on its kind.

/**
 * - `chunk`: a part of the application that failed to load, most often because a new version was published since the
 *   page was opened (its files renamed): reloading gets the new one.
 * - `offline`: the server could not be reached (no network, a server down): trying again later may do.
 * - `other`: anything else, a fault of the page: trying again may do, else it is the application's to mend.
 */
export type ErrorKind = 'chunk' | 'offline' | 'other'

const CHUNK = /dynamically imported module|importing a module script failed|error loading dynamically imported module|loading (css )?chunk [\w-]+ failed/i
const OFFLINE = /^(failed to fetch|networkerror when attempting to fetch resource\.?|load failed|network request failed)$/i

/** The kind of a thrown error (see ErrorKind). */
export function errorKind(error: unknown): ErrorKind {
  const message = errorMessage(error)
  if (CHUNK.test(message)) return 'chunk'
  if (OFFLINE.test(message) || (typeof navigator !== 'undefined' && navigator.onLine === false)) return 'offline'
  return 'other'
}

/** What an error says of itself: its message, a string thrown, or nothing. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message
  return ''
}

/** What a developer reads of it, under "Details" in development: its name and message, then its stack. */
export function errorDetails(error: unknown): string {
  if (error instanceof Error) {
    const head = `${error.name}: ${error.message}`
    return error.stack?.includes(error.message) ? error.stack : [head, error.stack].filter(Boolean).join('\n')
  }
  if (typeof error === 'string') return error
  try {
    return JSON.stringify(error, null, 2) ?? String(error)
  } catch {
    return String(error)
  }
}
