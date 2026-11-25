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
  /**
   * It makes a router of its own (`createMemoryRouter`), as an application's whole: drawn apart from the gallery's
   * (RouterApart), which React Router would not let it stand inside.
   */
  ownRouter?: boolean
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
  /**
   * Its former names, until 1.0 removes them (src/lib/deprecations.ts): said under its title, found by ⌘K and the
   * index. Its former address leads to its page (legacy.ts).
   */
  formerly?: string[]
  /** The component that replaces it, which takes the same props: its page says to use that one, until 1.0 removes it. */
  deprecated?: string
  /** Why one example says all there is to say (two at least otherwise). */
  single?: string
}

/** A row of a category's "Which one?": one of its families, and when it is the one to use. */
export interface ChoiceRow {
  /** The family's slug, in this category. */
  family: string
  /** When to use it, in a line of Markdown: what another category holds instead is a link to its page. */
  when: string
}

/** Where a category's families answer the same need in different ways: which to use, a table on its page. */
export interface Choose {
  /** Its heading: "Which button?". */
  heading: string
  rows: ChoiceRow[]
}

/** A group of families, in the sidebar under Components, and a page that shows each of them once. */
export interface CategoryInfo {
  slug: string
  label: string
  icon: LucideIcon
  /** What it holds, in a sentence. */
  summary: string
  /** Which of its families to use, where several answer the same need: drawn after its summary. */
  choose?: Choose
  families: FamilyInfo[]
}

/** An example, ready to draw: its component and its source. */
export interface Example {
  Component: ComponentType
  source: string
}

/** A category's examples, by `<family>/<example>`: loaded with the category's pages, a chunk of their own. */
export type Examples = Record<string, Example>
