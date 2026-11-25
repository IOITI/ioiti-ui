/** What is deprecated: a component's prop, one value of a prop, or a name the package exports. */
export type DeprecationKind = 'prop' | 'value' | 'export';
export interface Deprecation {
    kind: DeprecationKind;
    /** The components that take the prop or the value (`kind` prop or value). */
    components?: readonly string[];
    /** The prop that takes the value (`kind` value). */
    prop?: string;
    /** The old name, or the old value. */
    old: string;
    /** What replaces it, as an application writes it. */
    new: string;
    /** The version it was deprecated in. */
    since: string;
    /** What else changes with the name (an inverted meaning, a value renamed with it). */
    note?: string;
}
export declare const DEPRECATIONS: {};
export type DeprecationId = keyof typeof DEPRECATIONS;
