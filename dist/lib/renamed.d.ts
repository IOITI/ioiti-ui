import type { JSXElementConstructor } from 'react';
import { DEPRECATIONS } from './deprecations.js';
import type { DeprecationId } from './deprecations.js';
/** The deprecations of a name the package exports (`kind: 'export'`). */
type ExportId = {
    [Id in DeprecationId]: (typeof DEPRECATIONS)[Id]['kind'] extends 'export' ? Id : never;
}[DeprecationId];
/** A former name the package still exports: the `old` of a deprecation of `kind: 'export'`. */
export type FormerName = (typeof DEPRECATIONS)[ExportId]['old'];
/**
 * `Component` under its former name: drawn as it, with the props it is given, the former name said once in development
 * (`deprecated(id)`, the deprecation whose `old` it is), and its `displayName`. Typed as `Component`, generics and all.
 */
export declare function renamed<C extends JSXElementConstructor<never>>(Component: C, former: FormerName): C;
export {};
