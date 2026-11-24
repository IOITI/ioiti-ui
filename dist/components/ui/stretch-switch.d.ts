import React from 'react';
export interface StretchSwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
    description?: string;
    className?: string;
    /** ioiti-ui: the switch's id, for a `<label htmlFor>` elsewhere; in a FormItem, the item's, which its FormLabel names. */
    id?: string;
    /** ioiti-ui: the name it is sent under with its form while on, as a checkbox is; nothing is sent while off. */
    name?: string;
    /** ioiti-ui: what it sends under its `name` while on. */
    value?: string;
    /** ioiti-ui: it must be on (`aria-required`): the page checks it, and says so. */
    required?: boolean;
    /** ioiti-ui: its name, where no label names it (its own, a Field's, a FormLabel). */
    'aria-label'?: string;
    /** ioiti-ui: the id of what names it: a heading, a label elsewhere. */
    'aria-labelledby'?: string;
    /** ioiti-ui: the ids of what is read out with it, after its description; a Field or a FormItem around it adds its own. */
    'aria-describedby'?: string;
    /** ioiti-ui: marked invalid, as a Field or a FormItem in error marks it. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** ioiti-ui: the switch itself (its button), to focus it. */
    ref?: React.Ref<HTMLButtonElement>;
}
/**
 * StretchSwitch — Thumb stretches slightly while dragging/pressing,
 * then snaps naturally to its destination.
 *
 * Implementation: while pressing, the thumb is allowed to grow horizontally
 * (scaleX > 1) and slightly vertically (scaleY < 1) so it looks "stretched".
 * On release, the spring (springSnappy) handles the snap to the new x.
 *
 * ioiti-ui: the switch is named by its label and described by its description, so
 * that a screen reader says which setting it is and not only "switch, on".
 */
export declare const StretchSwitch: React.FC<StretchSwitchProps>;
