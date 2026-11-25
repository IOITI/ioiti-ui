// A component the package gave the name of its role (0.31.0) is still exported under its former name until 1.0, which
// removes it: the former name draws the component of today with the props it is given, and says once, in development,
// that it is deprecated (deprecated.ts). A production build keeps none of it: the former name is the component itself
// there, which says nothing, and neither the list (deprecations.ts) nor the wrapper is bundled. A call is given the
// former name rather than the deprecation's id: what a call is given stays in a production build, where check:package
// finds no id of the list.
import { createElement } from 'react';
import { deprecated } from './deprecated.js';
import { DEPRECATIONS } from './deprecations.js';
/**
 * `Component` under its former name: drawn as it, with the props it is given, the former name said once in development
 * (`deprecated(id)`, the deprecation whose `old` it is), and its `displayName`. Typed as `Component`, generics and all.
 */
export function renamed(Component, former) {
    if (process.env.NODE_ENV === 'production')
        return Component;
    // Read as any list of deprecations: it is empty between a major and the next minor that deprecates.
    const list = DEPRECATIONS;
    const id = Object.keys(list).find((key) => list[key].kind === 'export' && list[key].old === former);
    const Drawn = Component;
    function Renamed(props) {
        if (id)
            deprecated(id);
        return createElement(Drawn, props);
    }
    Renamed.displayName = former;
    return Renamed;
}
