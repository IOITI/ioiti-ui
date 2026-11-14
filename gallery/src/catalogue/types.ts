import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'

/** The entry of the package a component is imported from. */
export type Entry = 'ioiti-ui' | 'ioiti-ui/react-router' | 'ioiti-ui/code'

/** An example of a family: a file of its own (`<family>/<id>.tsx`), whose source the page shows under it. */
export interface ExampleInfo {
  /** Its file's name, and its anchor on the family's page (`#sizes`). */
  id: string
  title: string
  /** What it shows, and when to do so. */
  description?: string
}

/**
 * A component and the parts it is used with: one page of the gallery, named after its main export, which is also
 * the folder of its guidelines (`design-system/components/<name>/README.md`).
 */
export interface FamilyInfo {
  /** Its address in its category (`/components/actions/button`), and its folder of examples. */
  slug: string
  name: string
  /** What it shows of the package, the main part first: each import line, the props tables, the coverage test. */
  names: string[]
  /** The entry it is imported from; `ioiti-ui` by default. */
  entry?: Entry
  /** In order: the first is the one its category's page shows. */
  examples: ExampleInfo[]
  /** More words ⌘K finds it by. */
  keywords?: string[]
  /** Why one example says all there is to say (two at least otherwise). */
  single?: string
}

/** A group of families, in the sidebar under Components, and a page that shows each of them once. */
export interface CategoryInfo {
  slug: string
  label: string
  icon: LucideIcon
  /** What it holds, in a sentence. */
  summary: string
  families: FamilyInfo[]
}

/** An example, ready to draw: its component and its source. */
export interface Example {
  Component: ComponentType
  source: string
}

/** A category's examples, by `<family>/<example>`: loaded with the category's pages, a chunk of their own. */
export type Examples = Record<string, Example>
