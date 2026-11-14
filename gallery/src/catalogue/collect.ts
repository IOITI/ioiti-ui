import type { ComponentType } from 'react'

import type { Examples } from './types'

/**
 * A category's examples from its two globs (`import.meta.glob('./*\/*.tsx')`, once for the modules and once for
 * their sources, `?raw`), by `<family>/<example>`.
 */
export function collect(modules: Record<string, unknown>, sources: Record<string, unknown>): Examples {
  const examples: Examples = {}
  for (const [path, module] of Object.entries(modules)) {
    const key = path.replace(/^\.\//, '').replace(/\.tsx$/, '')
    const Component = (module as { default?: ComponentType }).default
    if (!Component) throw new Error(`${path}: an example exports its component by default`)
    examples[key] = { Component, source: String(sources[path] ?? '') }
  }
  return examples
}
