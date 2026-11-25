import type { ReactNode } from 'react';
/**
 * What a FormItem holds, drawn: its control; the control a FormControl holds, by the id it gives it (what the
 * control says of itself comes first); a description; a message (what is wrong); its label.
 */
export interface FieldPart {
    kind: 'control' | 'held' | 'description' | 'message' | 'label';
    /** The id it is drawn with. */
    id: string;
}
/**
 * What a field (a FormItem, a Field) tells what it holds: the id its control takes, what names and describes the
 * control, and whether its value is wrong. The package's controls read it (`useFieldControl`); a control from
 * elsewhere, which cannot, is given the same as props by FormControl or Field (`markControl`).
 */
export interface FieldContextValue {
    /** The id a control without one of its own takes; none where a label around the control names it (a Field's). */
    id?: string;
    /** The id of the control drawn in a FormItem, its own or the field's: what its FormLabel names (`htmlFor`). */
    controlId?: string;
    /**
     * The id of its label's words (a Field's label, a FormItem's FormLabel): what names, by `aria-labelledby`, a control
     * a label cannot name (a group, a slider) or would name wrongly (a button that shows its value).
     */
    labelledBy?: string;
    /**
     * What describes the control, each id once, its descriptions' before its errors' (`aria-describedby`): a Field's,
     * or the ids a FormItem's FormDescription and FormMessage are drawn with (each its own: two never share one).
     */
    describedBy?: string;
    /** Whether its value is wrong: an error given to the field, or a message under its control. */
    invalid: boolean;
    /** How the parts of a FormItem, or the control of a Field, say they are drawn, with their id, or gone (no part). */
    report?: (key: string, part?: FieldPart) => void;
    /** A FormItem's (or a field in one): its label, its descriptions and its messages take ids of their own. */
    item?: boolean;
}
export declare const FieldContext: import("react").Context<FieldContextValue | null>;
/** The field around a control, or a part of one; null outside any. */
export declare function useFieldContext(): FieldContextValue | null;
/** Ids for `aria-describedby`, each once, in the order given; none for nothing. */
export declare function joinIds(...lists: (string | null | undefined | false)[]): string | undefined;
/**
 * A part of a FormItem (or a Field's control) says it is drawn, under the id it has, before the page is painted: its
 * control is then described by it, or named by its label. Nothing while `drawn` is false (a FormMessage with nothing
 * to say).
 */
export declare function useFieldPart(kind: FieldPart['kind'], id: string | undefined, drawn?: boolean): void;
/**
 * The id of a FormItem's description, message or label: the one it is given, else its own in a FormItem (none
 * outside one, as before), said to the item while it is drawn, so that the item's control is described (or named) by
 * it.
 */
export declare function useFieldPartId(kind: 'description' | 'message' | 'label', given: string | undefined, drawn?: boolean): string | undefined;
/** What a control tells `useFieldControl` of itself: its own props, read before the field's. */
export interface OwnFieldProps {
    id?: string;
    /**
     * Its id where it is given none and the field none (a Field's): its own (`useId`), drawn in a field only, so that
     * the field's label points to it.
     */
    fallbackId?: string;
    /** What names it, by its own props (`aria-labelledby`, a label of its own). */
    labelledBy?: string;
    /** It has a name of its own (an `aria-label`): the field's label does not replace it. */
    named?: boolean;
    describedBy?: string;
    invalid?: boolean;
}
/**
 * A control's id, what names and describes it and whether it is wrong: its own first, then the field's around it,
 * each id once (a Field also gives them as props to a control it cannot tell from one of elsewhere). Its id is said to
 * the field, whose label then points to it: a FormItem's FormLabel, a Field's label (`htmlFor`). Without a name of its
 * own, the field's label names it (`labelledBy`), for a control a label cannot name, or would name wrongly.
 */
export declare function useFieldControl(own: OwnFieldProps): {
    id: string | undefined;
    labelledBy: string | undefined;
    describedBy: string | undefined;
    invalid: boolean;
};
/**
 * What a Field's label points to (`htmlFor`): the id its control says it is drawn with, the first one's. A group's
 * too (radios, segments), which a label cannot name: the label then names none of its parts (its first radio), nor
 * passes them its clicks. A control from elsewhere says nothing, and the label names the first control in it, as
 * before. What is said goes on to a FormItem around the Field.
 */
export declare function useFieldLabelFor(outer: FieldContextValue | null): {
    controlId?: string;
    report: (key: string, part?: FieldPart) => void;
};
/**
 * The words of what names a control (a Field's label, a FormLabel), by the ids it is named by: for a name said around
 * them ("Price, from", "edit the name"), which `aria-labelledby` cannot say. Read once drawn, and again as they change.
 */
export declare function useLabelWords(labelledBy: string | undefined): string | undefined;
/**
 * What a FormItem tells what it holds: one id for its control (that of a field around it, else its own), what names
 * it (its FormLabel's id) and what describes it as its FormLabel, FormDescription and FormMessage are drawn, and
 * whether it is wrong (its `error`, or a message under it). A field around it describes it too.
 */
export declare function useFormItemField(error: unknown): FieldContextValue;
/**
 * A control that cannot read the field (one from outside the package) given what the field says, as props: what
 * describes it after its own description, and `aria-invalid` while it is wrong. Beside its label (`beside`, a
 * FormControl's child), the field's id too where it has none, and nothing on an element that only holds the
 * control. The package's controls read the field as well, and join its ids with their own once each.
 */
export declare function markControl(control: ReactNode, field: FieldContextValue | null, { beside }?: {
    beside?: boolean | undefined;
}): ReactNode;
/** The id of the control beside its label (a FormControl's child), as it is drawn: its own, or the field's. */
export declare function besideId(control: ReactNode, field: FieldContextValue | null): string | undefined;
