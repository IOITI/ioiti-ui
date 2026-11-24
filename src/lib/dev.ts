// What a component says to the developer who uses it amiss (a dialog with no name, a prop deprecated): once for each
// cause, in the console, and in development only. Every bundler writes `process.env.NODE_ENV` as 'production' in an
// application's build, where the first line returns: what follows, and the words of dev-messages.ts it reads, are
// left out of the build. Not in a try: a bundler keeps what a try holds.
import { DEV_MESSAGES } from './dev-messages.js'
import type { DevMessageId } from './dev-messages.js'

// The bundler's, or Node's in the tests: no type of Node in the package's own.
declare const process: { env: { NODE_ENV?: string } }

const said = new Set<string>()

/** Says once, in development, what a component was given amiss; `detail` tells one case from another (a count, a name). */
export function devWarn(id: DevMessageId, detail?: string): void {
  if (process.env.NODE_ENV === 'production') return
  const key = detail === undefined ? id : `${id}:${detail}`
  if (said.has(key)) return
  said.add(key)
  console.warn(`ioiti-ui: ${DEV_MESSAGES[id]}${detail === undefined ? '' : ` (${detail})`}`)
}
