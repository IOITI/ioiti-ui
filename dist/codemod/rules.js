// What the codemod rewrites, read from the list of what is deprecated (src/lib/deprecations.ts): a name the package
// exports, a component's prop, one value of a prop. What the list cannot say alone (a prop whose meaning turned the
// other way round, the values renamed with a prop) is said here, by the deprecation's id.
import { DEPRECATIONS } from '../lib/deprecations.js';
/** What the list says in words, said here in the codemod's terms. */
const SPECIAL = {
    'hide-close-button': { kind: 'invert', to: 'showCloseButton' },
    'toast-variant': { kind: 'rename', to: 'tone', values: { default: 'neutral', error: 'danger' } },
    'drag-to-confirm-variant': { kind: 'rename', to: 'tone', values: { default: 'neutral' } },
};
/** The props whose objects are written apart from the component (a sidebar's sections): renamed in any object. */
const ANYWHERE = new Set(['badgeTone']);
/** Where a meter's tone is written in objects: a slider's levels, a chart's references, a list's items. */
const NESTED = {
    'meter-tone-positive': ['levels', 'references', 'items'],
    'meter-tone-negative': ['levels', 'references', 'items'],
};
const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
const ATTRIBUTE = /^[A-Za-z][\w-]*$/;
const SET = /^([A-Za-z][\w-]*)="([^"]*)"$/;
/** The rules the list makes. `entries` is the list (DEPRECATIONS by default: a test gives its own). */
export function rulesOf(entries = DEPRECATIONS) {
    const exports = [];
    const byHand = [];
    for (const [id, entry] of Object.entries(entries)) {
        if (entry.kind !== 'export')
            continue;
        if (IDENTIFIER.test(entry.new))
            exports.push({ id, from: entry.old, to: entry.new });
        else
            byHand.push({ id, name: entry.old, instead: entry.new });
    }
    // A component named in a rule by its former name is matched by its name of today too.
    const renamed = new Map(exports.map((rename) => [rename.from, rename.to]));
    const today = (names = []) => new Set(names.flatMap((name) => [name, renamed.get(name) ?? name]));
    const props = [];
    const values = [];
    const toast = [];
    const anywhere = [];
    for (const [id, entry] of Object.entries(entries)) {
        if (entry.kind === 'prop') {
            const set = SET.exec(entry.new);
            const change = SPECIAL[id] ?? (set ? { kind: 'set', to: set[1], value: set[2] } : ATTRIBUTE.test(entry.new) ? { kind: 'rename', to: entry.new } : undefined);
            if (!change)
                continue;
            const components = today(entry.components?.filter((name) => !name.startsWith('use')));
            if (components.size)
                props.push({ id, components, from: entry.old, change });
            if (entry.components?.includes('useToast') && change.kind === 'rename') {
                toast.push({ id, from: entry.old, to: change.to, values: change.values ?? {} });
            }
        }
        else if (entry.kind === 'value' && entry.prop) {
            const set = SET.exec(entry.new);
            const rule = {
                id,
                components: today(entry.components),
                prop: entry.prop,
                from: entry.old,
                to: set ? { prop: set[1], value: set[2] } : { prop: entry.prop, value: entry.new },
                nested: NESTED[id] ?? [],
            };
            if (ANYWHERE.has(entry.prop))
                anywhere.push(rule);
            else
                values.push(rule);
        }
    }
    return { exports, byHand, props, values, toast, anywhere };
}
