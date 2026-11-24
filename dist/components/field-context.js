import { cloneElement, createContext, isValidElement, useCallback, useContext, useId, useLayoutEffect, useMemo, useState } from 'react';
export const FieldContext = createContext(null);
/** The field around a control, or a part of one; null outside any. */
export function useFieldContext() {
    return useContext(FieldContext);
}
/** Ids for `aria-describedby`, each once, in the order given; none for nothing. */
export function joinIds(...lists) {
    const ids = new Set(lists.flatMap((list) => (list ? list.split(/\s+/) : [])).filter(Boolean));
    return ids.size ? [...ids].join(' ') : undefined;
}
/**
 * A part of a FormItem says it is drawn, under the id it has, before the page is painted: its control is then
 * described by it, or named by its label. Nothing while `drawn` is false (a FormMessage with nothing to say).
 */
export function useFieldPart(kind, id, drawn = true) {
    const report = useContext(FieldContext)?.report;
    const key = useId();
    useLayoutEffect(() => {
        if (!report || !id || !drawn)
            return;
        report(key, { kind, id });
        return () => report(key);
    }, [report, key, kind, id, drawn]);
}
/**
 * The id of a FormItem's description or message: the one it is given, else its own in a FormItem (none outside
 * one, as before), said to the item while it is drawn, so that the item's control is described by it.
 */
export function useFieldPartId(kind, given, drawn = true) {
    const inItem = Boolean(useContext(FieldContext)?.report);
    const own = useId();
    const id = given ?? (inItem ? `${own}-${kind}` : undefined);
    useFieldPart(kind, id, drawn);
    return id;
}
/**
 * A control's id, what describes it and whether it is wrong: its own first, then the field's around it, each id
 * once (a Field also gives them as props to a control it cannot tell from one of elsewhere). Its id is said to a
 * FormItem, whose FormLabel then names it.
 */
export function useFieldControl(own) {
    const field = useContext(FieldContext);
    const id = own.id ?? field?.id;
    useFieldPart('control', id);
    return {
        id,
        describedBy: joinIds(own.describedBy, field?.describedBy),
        invalid: Boolean(own.invalid) || Boolean(field?.invalid),
    };
}
/**
 * What a FormItem tells what it holds: one id for its control (that of a field around it, else its own), what
 * describes it as its FormDescription and FormMessage are drawn, and whether it is wrong (its `error`, or a message
 * under it). A field around it describes it too.
 */
export function useFormItemField(error) {
    const outer = useContext(FieldContext);
    const id = useId();
    const [parts, setParts] = useState({});
    const report = useCallback((key, part) => {
        setParts((now) => {
            const was = now[key];
            if (part ? was?.kind === part.kind && was.id === part.id : !was)
                return now;
            const next = { ...now };
            if (part)
                next[key] = part;
            else
                delete next[key];
            return next;
        });
    }, []);
    const wrong = Boolean(error);
    return useMemo(() => {
        const drawn = Object.values(parts);
        const of = (kind) => drawn.filter((part) => part.kind === kind).map((part) => part.id);
        const messages = of('message');
        return {
            id: outer?.id ?? `${id}-control`,
            controlId: of('control')[0] ?? of('held')[0],
            describedBy: joinIds(outer?.describedBy, ...of('description'), ...messages),
            invalid: wrong || messages.length > 0 || Boolean(outer?.invalid),
            report,
        };
    }, [outer, id, parts, wrong, report]);
}
/** The elements that are a control themselves; another (a `div`) holds one, which reads the field. */
const CONTROLS = new Set(['input', 'select', 'textarea', 'button']);
/** Whether a FormControl's child takes the field's id: a control, or a component (which hands it to its own). */
const takesId = (control) => isValidElement(control) && (typeof control.type !== 'string' || CONTROLS.has(control.type));
/**
 * A control that cannot read the field (one from outside the package) given what the field says, as props: what
 * describes it after its own description, and `aria-invalid` while it is wrong. Beside its label (`beside`, a
 * FormControl's child), the field's id too where it has none, and nothing on an element that only holds the
 * control. The package's controls read the field as well, and join its ids with their own once each.
 */
export function markControl(control, field, { beside = false } = {}) {
    if (!field || !isValidElement(control))
        return control;
    if (beside && !takesId(control))
        return control;
    const own = control.props;
    const marks = {
        ...(beside && own.id === undefined && field.id !== undefined ? { id: field.id } : {}),
        ...(field.describedBy ? { 'aria-describedby': joinIds(own['aria-describedby'], field.describedBy) } : {}),
        ...(field.invalid ? { 'aria-invalid': true } : {}),
    };
    return Object.keys(marks).length ? cloneElement(control, marks) : control;
}
/** The id of the control beside its label (a FormControl's child), as it is drawn: its own, or the field's. */
export function besideId(control, field) {
    return field && takesId(control) ? (control.props.id ?? field.id) : undefined;
}
