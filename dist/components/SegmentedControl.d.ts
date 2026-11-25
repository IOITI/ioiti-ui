import type { ReactNode, Ref } from 'react';
import type { DataAttributes } from '../lib/data-attributes.js';
export interface SegmentedControlOption<T extends string = string> {
    value: T;
    label: ReactNode;
    /** An icon of lucide-react, before the label. */
    icon?: ReactNode;
    disabled?: boolean;
    /** As a tab (`role="tablist"`): the id of the panel it shows. */
    panelId?: string;
}
export interface SegmentedControlProps<T extends string = string> extends DataAttributes {
    options: SegmentedControlOption<T>[];
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    /** The group's name for a screen reader: what is chosen ("Period"). Or `aria-labelledby`, a heading's id. */
    label?: string;
    /** @deprecated Use `aria-labelledby`. Removed in 1.0. */
    labelledBy?: string;
    /** Its name, as `label`. */
    'aria-label'?: string;
    /** The id of what names the group: a heading. A Field's label names it without it. */
    'aria-labelledby'?: string;
    /** Read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** Marked invalid, as a Field with an error marks it. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** The group's id, for a `<label htmlFor>`; in a FormItem, the item's. */
    id?: string;
    /** The name its value is sent under with a form (a hidden input), as a radio's: nothing while none is chosen. */
    name?: string;
    size?: 'sm' | 'md';
    /** As wide as its container, the segments sharing it. */
    fullWidth?: boolean;
    /** A choice (`radiogroup`, the default), or the tabs that switch panels (`tablist`). */
    role?: 'radiogroup' | 'tablist';
    className?: string;
    /** The group (its `radiogroup` or `tablist` element), which holds its segments. */
    ref?: Ref<HTMLDivElement>;
}
/**
 * Two to five choices shown at once, one of them chosen, in one bar: the chosen one filled as a primary
 * button is (in the accent, where the look has one), the fill sliding to the next. The arrow keys move
 * and choose, as in a radio group. For a page's sections, `Tabs`; for a longer list, a `Select`.
 */
export declare function SegmentedControl<T extends string = string>({ options, value, defaultValue, onChange, label, labelledBy: formerLabelledBy, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, id, name, size, fullWidth, role, className, ref, ...rest }: SegmentedControlProps<T>): import("react").JSX.Element;
