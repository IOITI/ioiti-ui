import type { ReactNode } from 'react';
/**
 * What a FormItem holds, drawn: its control; the control a FormControl holds, by the id it gives it (what the
 * control says of itself comes first); a description; a message (what is wrong).
 */
export interface FieldPart {
    kind: 'control' | 'held' | 'description' | 'message';
    /** The id it is drawn with. */
    id: string;
}
/**
 * What a field (a FormItem, a Field) tells what it holds: the id its control takes, what describes the control, and
 * whether its value is wrong. The package's controls read it (`useFieldControl`); a control from elsewhere, which
 * cannot, is given the same as props by FormControl or Field (`markControl`).
 */
export interface FieldContextValue {
    /** The id a control without one of its own takes; none where a label around the control names it (a Field's). */
    id?: string;
    /** The id of the control drawn in a FormItem, its own or the field's: what its FormLabel names (`htmlFor`). */
    controlId?: string;
    /**
     * What describes the control, each id once, its descriptions' before its errors' (`aria-describedby`): a Field's,
     * or the ids a FormItem's FormDescription and FormMessage are drawn with (each its own: two never share one).
     */
    describedBy?: string;
    /** Whether its value is wrong: an error given to the field, or a message under its control. */
    invalid: boolean;
    /** How a FormItem's parts say they are drawn, with their id, or gone (no part). */
    report?: (key: string, part?: FieldPart) => void;
}
export declare const FieldContext: import("react").Context<FieldContextValue | null>;
/** The field around a control, or a part of one; null outside any. */
export declare function useFieldContext(): FieldContextValue | null;
/** Ids for `aria-describedby`, each once, in the order given; none for nothing. */
export declare function joinIds(...lists: (string | null | undefined | false)[]): string | undefined;
/**
 * A part of a FormItem says it is drawn, under the id it has, before the page is painted: its control is then
 * described by it, or named by its label. Nothing while `drawn` is false (a FormMessage with nothing to say).
 */
export declare function useFieldPart(kind: FieldPart['kind'], id: string | undefined, drawn?: boolean): void;
/**
 * The id of a FormItem's description or message: the one it is given, else its own in a FormItem (none outside
 * one, as before), said to the item while it is drawn, so that the item's control is described by it.
 */
export declare function useFieldPartId(kind: 'description' | 'message', given: string | undefined, drawn?: boolean): string | undefined;
/**
 * A control's id, what describes it and whether it is wrong: its own first, then the field's around it, each id
 * once (a Field also gives them as props to a control it cannot tell from one of elsewhere). Its id is said to a
 * FormItem, whose FormLabel then names it.
 */
export declare function useFieldControl(own: {
    id?: string;
    describedBy?: string;
    invalid?: boolean;
}): {
    id: string | undefined;
    describedBy: string | undefined;
    invalid: boolean;
};
/**
 * What a FormItem tells what it holds: one id for its control (that of a field around it, else its own), what
 * describes it as its FormDescription and FormMessage are drawn, and whether it is wrong (its `error`, or a message
 * under it). A field around it describes it too.
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
