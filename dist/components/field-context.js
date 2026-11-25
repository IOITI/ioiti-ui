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
 * A part of a FormItem (or a Field's control) says it is drawn, under the id it has, before the page is painted: its
 * control is then described by it, or named by its label. Nothing while `drawn` is false (a FormMessage with nothing
 * to say).
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
 * The id of a FormItem's description, message or label: the one it is given, else its own in a FormItem (none
 * outside one, as before), said to the item while it is drawn, so that the item's control is described (or named) by
 * it.
 */
export function useFieldPartId(kind, given, drawn = true) {
    const inItem = Boolean(useContext(FieldContext)?.item);
    const own = useId();
    const id = given ?? (inItem ? `${own}-${kind}` : undefined);
    useFieldPart(kind, id, drawn);
    return id;
}
/**
 * A control's id, what names and describes it and whether it is wrong: its own first, then the field's around it,
 * each id once (a Field also gives them as props to a control it cannot tell from one of elsewhere). Its id is said to
 * the field, whose label then points to it: a FormItem's FormLabel, a Field's label (`htmlFor`). Without a name of its
 * own, the field's label names it (`labelledBy`), for a control a label cannot name, or would name wrongly.
 */
export function useFieldControl(own) {
    const field = useContext(FieldContext);
    const id = own.id ?? field?.id ?? (field ? own.fallbackId : undefined);
    useFieldPart('control', id);
    return {
        id,
        labelledBy: own.labelledBy ?? (own.named ? undefined : field?.labelledBy),
        describedBy: joinIds(own.describedBy, field?.describedBy),
        invalid: Boolean(own.invalid) || Boolean(field?.invalid),
    };
}
/**
 * What a Field's label points to (`htmlFor`): the id its control says it is drawn with, the first one's. A group's
 * too (radios, segments), which a label cannot name: the label then names none of its parts (its first radio), nor
 * passes them its clicks. A control from elsewhere says nothing, and the label names the first control in it, as
 * before. What is said goes on to a FormItem around the Field.
 */
export function useFieldLabelFor(outer) {
    const [controls, setControls] = useState({});
    const forward = outer?.report;
    const report = useCallback((key, part) => {
        forward?.(key, part);
        const id = part?.kind === 'control' ? part.id : undefined;
        setControls((now) => {
            if (now[key] === id)
                return now;
            const next = { ...now };
            if (id === undefined)
                delete next[key];
            else
                next[key] = id;
            return next;
        });
    }, [forward]);
    return { controlId: Object.values(controls)[0], report };
}
/** The words of an element, those hidden from a screen reader (`aria-hidden`: a required field's star) left out. */
function wordsOf(element) {
    return Array.from(element.childNodes, (node) => {
        if (node.nodeType === Node.TEXT_NODE)
            return node.textContent ?? '';
        return node instanceof Element && node.getAttribute('aria-hidden') !== 'true' ? wordsOf(node) : '';
    }).join('');
}
/**
 * The words of what names a control (a Field's label, a FormLabel), by the ids it is named by: for a name said around
 * them ("Price, from", "edit the name"), which `aria-labelledby` cannot say. Read once drawn, and again as they change.
 */
export function useLabelWords(labelledBy) {
    const [words, setWords] = useState();
    useLayoutEffect(() => {
        const labels = (labelledBy?.split(/\s+/) ?? []).flatMap((id) => document.getElementById(id) ?? []);
        const read = () => setWords(labels.map(wordsOf).join(' ').replace(/\s+/g, ' ').trim() || undefined);
        read();
        if (typeof MutationObserver === 'undefined')
            return;
        const observer = new MutationObserver(read);
        for (const label of labels)
            observer.observe(label, { childList: true, characterData: true, subtree: true });
        return () => observer.disconnect();
    }, [labelledBy]);
    return words;
}
/**
 * What a FormItem tells what it holds: one id for its control (that of a field around it, else its own), what names
 * it (its FormLabel's id) and what describes it as its FormLabel, FormDescription and FormMessage are drawn, and
 * whether it is wrong (its `error`, or a message under it). A field around it describes it too.
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
            labelledBy: of('label')[0] ?? outer?.labelledBy,
            describedBy: joinIds(outer?.describedBy, ...of('description'), ...messages),
            invalid: wrong || messages.length > 0 || Boolean(outer?.invalid),
            report,
            item: true,
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
