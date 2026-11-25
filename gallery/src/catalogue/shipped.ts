// What the gallery says of a release: its version, the version each name first shipped in (since.json, which
// scripts/since.mjs writes at each release), and where a component's code is on GitHub.
import packageJson from '../../../package.json'
import SINCE from '../since.json'
import { COMPONENT_PROPS } from './props'

/** The gallery's version: the package's, which a release sets. */
export const VERSION = packageJson.version

/** The repository on GitHub, as package.json names it. */
export const REPOSITORY = packageJson.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')

const SHIPPED: Record<string, string> = SINCE

/** The version a name first shipped in; none for a name no release has had yet. */
export function sinceOf(name: string, since: Record<string, string> = SHIPPED): string | undefined {
  return Object.hasOwn(since, name) ? since[name] : undefined
}

/** A name not shipped yet, or shipped in the gallery's own version. */
export function isNew(name: string, since: Record<string, string> = SHIPPED, version = VERSION): boolean {
  const first = sinceOf(name, since)
  return first === undefined || first === version
}

/**
 * Where a component's code is on GitHub: its file at the tag of the gallery's version, or on `main` for a name no
 * release has had (its file may be none of the tag's). None for a name whose file the props do not know.
 */
export function sourceOf(name: string, since: Record<string, string> = SHIPPED, version = VERSION): string | undefined {
  const file = COMPONENT_PROPS[name]?.file
  if (!file) return undefined
  return `${REPOSITORY}/blob/${sinceOf(name, since) ? `v${version}` : 'main'}/${file}`
}
