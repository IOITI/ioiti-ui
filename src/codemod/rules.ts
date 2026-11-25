// What the codemod rewrites, read from what 1.0 removed (table.ts) and what is deprecated (src/lib/deprecations.ts): a name the package
// exports, a component's prop, one value of a prop. What the list cannot say alone (a prop whose meaning turned the
// other way round, the values renamed with a prop) is said here, by the deprecation's id.
import { DEPRECATIONS } from '../lib/deprecations.js'
import { REMOVED } from './table.js'

/** A name the package exports, renamed: its imports and every use of them in a file. */
export interface ExportRename {
  id: string
  from: string
  to: string
}

/** A name the package exports, with no name in its place: a person rewrites it (`instead`). */
export interface ExportByHand {
  id: string
  name: string
  instead: string
}

/**
 * How an old prop becomes its new one: renamed (`rename`); a boolean turned the other way round (`invert`,
 * `hideCloseButton` → `showCloseButton={false}`); a boolean become one value of a prop (`set`, `dense` →
 * `density="compact"`).
 */
export type PropChange =
  | { kind: 'rename'; to: string; values?: Readonly<Record<string, string>> }
  | { kind: 'invert'; to: string }
  | { kind: 'set'; to: string; value: string }

export interface PropRule {
  id: string
  /** The components that take it, by the name they are exported under today. */
  components: ReadonlySet<string>
  from: string
  change: PropChange
}

/** One value of a prop renamed (`tone="negative"` → `tone="danger"`), or become another prop (`variant="compact"` → `density="compact"`). */
export interface ValueRule {
  id: string
  components: ReadonlySet<string>
  prop: string
  from: string
  /** The new value, or, where the prop changes too, the new prop and its value. */
  to: { prop: string; value: string }
  /** The props given objects that hold this one (a chart's references, a slider's levels, a list's items). */
  nested: readonly string[]
}

/**
 * A prop a component takes in an object rather than as an attribute (a toast's `variant`, given to `toast()`), or a
 * value written wherever an object holds the prop (a sidebar's `badgeTone`: its sections are written apart from it).
 */
export interface Rules {
  exports: readonly ExportRename[]
  byHand: readonly ExportByHand[]
  props: readonly PropRule[]
  values: readonly ValueRule[]
  /** Keys renamed in what `useToast()`'s function is given: `variant` → `tone`, with its values. */
  toast: readonly { id: string; from: string; to: string; values: Readonly<Record<string, string>> }[]
  /** Props whose value is renamed in any object of a file that imports the package (their names say whose they are). */
  anywhere: readonly ValueRule[]
}

interface Entry {
  kind: 'prop' | 'value' | 'export'
  components?: readonly string[]
  prop?: string
  old: string
  new: string
  since: string
  note?: string
}

/** What the list says in words, said here in the codemod's terms. */
const SPECIAL: Record<string, PropChange> = {
  'hide-close-button': { kind: 'invert', to: 'showCloseButton' },
  'toast-variant': { kind: 'rename', to: 'tone', values: { default: 'neutral', error: 'danger' } },
  'drag-to-confirm-variant': { kind: 'rename', to: 'tone', values: { default: 'neutral' } },
}

/** The props whose objects are written apart from the component (a sidebar's sections): renamed in any object. */
const ANYWHERE = new Set(['badgeTone'])

/** Where a meter's tone is written in objects: a slider's levels, a chart's references, a list's items. */
const NESTED: Record<string, readonly string[]> = {
  'meter-tone-positive': ['levels', 'references', 'items'],
  'meter-tone-negative': ['levels', 'references', 'items'],
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/
const ATTRIBUTE = /^[A-Za-z][\w-]*$/
const SET = /^([A-Za-z][\w-]*)="([^"]*)"$/

/**
 * The rules the lists make: what 1.0 removed (table.ts) and what is deprecated today (deprecations.ts), by default; a
 * test gives its own.
 */
export function rulesOf(entries: Readonly<Record<string, Entry>> = { ...REMOVED, ...DEPRECATIONS }): Rules {
  const exports: ExportRename[] = []
  const byHand: ExportByHand[] = []
  for (const [id, entry] of Object.entries(entries)) {
    if (entry.kind !== 'export') continue
    if (IDENTIFIER.test(entry.new)) exports.push({ id, from: entry.old, to: entry.new })
    else byHand.push({ id, name: entry.old, instead: entry.new })
  }
  // A component named in a rule by its former name is matched by its name of today too.
  const renamed = new Map(exports.map((rename) => [rename.from, rename.to]))
  const today = (names: readonly string[] = []) => new Set(names.flatMap((name) => [name, renamed.get(name) ?? name]))

  const props: PropRule[] = []
  const values: ValueRule[] = []
  const toast: Rules['toast'][number][] = []
  const anywhere: ValueRule[] = []
  for (const [id, entry] of Object.entries(entries)) {
    if (entry.kind === 'prop') {
      const set = SET.exec(entry.new)
      const change: PropChange | undefined =
        SPECIAL[id] ?? (set ? { kind: 'set', to: set[1], value: set[2] } : ATTRIBUTE.test(entry.new) ? { kind: 'rename', to: entry.new } : undefined)
      if (!change) continue
      const components = today(entry.components?.filter((name) => !name.startsWith('use')))
      if (components.size) props.push({ id, components, from: entry.old, change })
      if (entry.components?.includes('useToast') && change.kind === 'rename') {
        toast.push({ id, from: entry.old, to: change.to, values: change.values ?? {} })
      }
    } else if (entry.kind === 'value' && entry.prop) {
      const set = SET.exec(entry.new)
      const rule: ValueRule = {
        id,
        components: today(entry.components),
        prop: entry.prop,
        from: entry.old,
        to: set ? { prop: set[1], value: set[2] } : { prop: entry.prop, value: entry.new },
        nested: NESTED[id] ?? [],
      }
      if (ANYWHERE.has(entry.prop)) anywhere.push(rule)
      else values.push(rule)
    }
  }
  return { exports, byHand, props, values, toast, anywhere }
}
