// A component given a name the package deprecated says so to its developer: once, in development only (devWarn), naming
// the old name and what replaces it. A production build keeps neither the call's words nor the list (scripts/
// check-package.mjs holds it): the first line returns, and what follows is left out with it.
import { DEPRECATIONS } from './deprecations.js';
import { devWarn } from './dev.js';
/** Says once, in development, that a deprecated name was given, and what replaces it. */
export function deprecated(id, where) {
    if (process.env.NODE_ENV === 'production')
        return;
    const entry = DEPRECATIONS[id];
    // A value is named with its prop (`tone="positive"`), a prop or an export by its name; the component that took it first.
    const given = entry.kind === 'value' ? `${entry.prop}="${entry.old}"` : entry.old;
    devWarn('deprecated', `${where ? `${where}'s ` : ''}${given}: ${entry.new}${entry.note ? `, ${entry.note}` : ''}`);
}
