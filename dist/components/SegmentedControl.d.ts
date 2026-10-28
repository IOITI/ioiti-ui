import type { ReactNode } from 'react';
export interface SegmentedControlOption<T extends string = string> {
    value: T;
    label: ReactNode;
    /** An icon of lucide-react, before the label. */
    icon?: ReactNode;
    disabled?: boolean;
    /** As a tab (`role="tablist"`): the id of the panel it shows. */
    panelId?: string;
}
export interface SegmentedControlProps<T extends string = string> {
    options: SegmentedControlOption<T>[];
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    /** The group's name for a screen reader: what is chosen ("Period"). Or `labelledBy`, a heading's id. */
    label?: string;
    labelledBy?: string;
    size?: 'sm' | 'md';
    /** As wide as its container, the segments sharing it. */
    fullWidth?: boolean;
    /** A choice (`radiogroup`, the default), or the tabs that switch panels (`tablist`). */
    role?: 'radiogroup' | 'tablist';
    className?: string;
}
/**
 * Two to five choices shown at once, one of them chosen, in one bar: the chosen one filled as a primary
 * button is (in the accent, where the look has one), the fill sliding to the next. The arrow keys move
 * and choose, as in a radio group. For a page's sections, `AnimatedTabs`; for a longer list, a `Select`.
 */
export declare function SegmentedControl<T extends string = string>({ options, value, defaultValue, onChange, label, labelledBy, size, fullWidth, role, className, }: SegmentedControlProps<T>): import("react").JSX.Element;
