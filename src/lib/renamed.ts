// A component the package gave the name of its role (0.31.0) is still exported under its former name until 1.0, which
// removes it: the former name draws the component of today with the props it is given, and says once, in development,
// that it is deprecated (deprecated.ts). A production build keeps none of it: the former name is the component itself
// there, which says nothing, and neither the list (deprecations.ts) nor the wrapper is bundled. A call is given the
// former name rather than the deprecation's id: what a call is given stays in a production build, where check:package
// finds no id of the list.
import { createElement } from 'react'
import type { ComponentType, JSXElementConstructor } from 'react'

import { deprecated } from './deprecated.js'
import { DEPRECATIONS } from './deprecations.js'
import type { DeprecationId } from './deprecations.js'

// The bundler's, or Node's in the tests: no type of Node in the package's own.
declare const process: { env: { NODE_ENV?: string } }

/** The deprecations of a name the package exports (`kind: 'export'`). */
type ExportId = { [Id in DeprecationId]: (typeof DEPRECATIONS)[Id]['kind'] extends 'export' ? Id : never }[DeprecationId]

/** A former name the package still exports: the `old` of a deprecation of `kind: 'export'`. */
export type FormerName = (typeof DEPRECATIONS)[ExportId]['old']

/**
 * `Component` under its former name: drawn as it, with the props it is given, the former name said once in development
 * (`deprecated(id)`, the deprecation whose `old` it is), and its `displayName`. Typed as `Component`, generics and all.
 */
export function renamed<C extends JSXElementConstructor<never>>(Component: C, former: FormerName): C {
  if (process.env.NODE_ENV === 'production') return Component
  const id = (Object.keys(DEPRECATIONS) as DeprecationId[]).find(
    (key) => DEPRECATIONS[key].kind === 'export' && DEPRECATIONS[key].old === former,
  )
  const Drawn = Component as unknown as ComponentType<object>
  function Renamed(props: object) {
    if (id) deprecated(id)
    return createElement(Drawn, props)
  }
  Renamed.displayName = former
  return Renamed as unknown as C
}
