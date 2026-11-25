// What the package deprecates, and what replaces it: the one list a deprecation is written in. A component given an old
// name says so once, in development (`deprecated(id)`, src/lib/deprecated.ts); a component renamed keeps its former name
// (`renamed()`, src/lib/renamed.ts); the props tables mark the old prop (scripts/props.mjs, which refuses one that is not
// marked); the CHANGELOG names each in the Deprecated section of its version (scripts/check-docs.mjs); the codemod
// rewrites them (src/codemod). Data only, no import: the scripts read it too.
//
// A name lives deprecated through one minor version at least, and goes only in a major (docs/stability.md), its entry
// moved then to the codemod's table of what was removed (src/codemod/table.ts). 1.0 removed every name 0.29.0 to 0.31.0
// deprecated: the list is empty until a minor version deprecates again.

/** What is deprecated: a component's prop, one value of a prop, or a name the package exports. */
export type DeprecationKind = 'prop' | 'value' | 'export'

export interface Deprecation {
  kind: DeprecationKind
  /** The components that take the prop or the value (`kind` prop or value). */
  components?: readonly string[]
  /** The prop that takes the value (`kind` value). */
  prop?: string
  /** The old name, or the old value. */
  old: string
  /** What replaces it, as an application writes it. */
  new: string
  /** The version it was deprecated in. */
  since: string
  /** What else changes with the name (an inverted meaning, a value renamed with it). */
  note?: string
}

export const DEPRECATIONS = {} as const satisfies Record<string, Deprecation>

export type DeprecationId = keyof typeof DEPRECATIONS
